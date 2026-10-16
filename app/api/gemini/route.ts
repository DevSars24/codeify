import { aiCache } from "@/lib/ai/cache";
import { executeAIRequest, executeAIStreamRequest } from "@/lib/ai/provider";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const userPrompt = body?.prompt?.trim();
    const streamMode = body?.stream !== false; // Default to streaming for ultra-low TTFB

    if (!userPrompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 1. SHA-256 LRU Cache Check (0ms response latency on cache hits)
    const cacheKey = aiCache.generateKey("gemini_code", { prompt: userPrompt, stream: streamMode });
    const cachedResponse = aiCache.get<string>(cacheKey);

    if (cachedResponse) {
      const cacheLatency = Date.now() - startTime;
      console.log(`[AI Cache Hit] Returned in ${cacheLatency}ms`);

      if (streamMode) {
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(cachedResponse));
            controller.close();
          },
        });
        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Cache": "HIT",
            "X-Response-Time": `${cacheLatency}ms`,
          },
        });
      }

      return NextResponse.json(
        { text: cachedResponse, cached: true },
        {
          headers: {
            "X-Cache": "HIT",
            "X-Response-Time": `${cacheLatency}ms`,
          },
        }
      );
    }

    const systemPrompt = `You are a senior software architect. Answer clearly, accurately, and concisely.
Rules:
- Provide high-quality, professional code and explanations.
- Avoid unnecessary fluff or redundant disclaimers.`;

    if (streamMode) {
      // 2. High-Speed Multi-Model Streaming (Groq Primary Pool -> Gemini Fallback)
      const { stream: rawStream, provider, model } = await executeAIStreamRequest({
        systemPrompt,
        userPrompt,
        temperature: 0.2,
      });

      let accumulatedText = "";
      const decoder = new TextDecoder();
      const reader = rawStream.getReader();

      const cachingStream = new ReadableStream<Uint8Array>({
        async pull(controller) {
          try {
            const { done, value } = await reader.read();
            if (done) {
              if (accumulatedText.trim()) {
                aiCache.set(cacheKey, accumulatedText);
              }
              controller.close();
              return;
            }
            if (value) {
              accumulatedText += decoder.decode(value, { stream: true });
              controller.enqueue(value);
            }
          } catch (err) {
            console.error("[Stream Process Error]", err);
            controller.error(err);
          }
        },
        cancel() {
          reader.cancel();
        },
      });

      return new Response(cachingStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Cache": "MISS",
          "X-Response-Time": `${Date.now() - startTime}ms`,
          "X-Provider": provider,
          "X-Model": model,
        },
      });
    } else {
      // Non-streaming multi-model fallback
      const aiRes = await executeAIRequest({
        systemPrompt,
        userPrompt,
        temperature: 0.2,
      });

      if (aiRes.text) {
        aiCache.set(cacheKey, aiRes.text);
      }

      return NextResponse.json(
        { text: aiRes.text, provider: aiRes.provider, model: aiRes.model },
        {
          headers: {
            "X-Cache": "MISS",
            "X-Response-Time": `${Date.now() - startTime}ms`,
            "X-Provider": aiRes.provider,
            "X-Model": aiRes.model,
          },
        }
      );
    }
  } catch (error: any) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}
