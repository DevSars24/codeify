import { aiCache } from "@/lib/ai/cache";
import { getAIModel, executeAIWithRetry } from "@/lib/ai/client";
import { createTextResponseStream } from "@/lib/ai/stream";
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
        // Return stream from cached text instantly
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

    // 2. Optimized Model & System Instruction
    const model = getAIModel("gemini-flash-lite-latest");

    const controlledPrompt = `
You are a senior software architect. Answer clearly, accurately, and concisely.

Rules:
- Provide high-quality, professional code and explanations.
- Avoid unnecessary fluff or redundant disclaimers.

Question/Task:
${userPrompt}
`.trim();

    if (streamMode) {
      // 3. Ultra-Low TTFB Response Streaming
      const resultStream = await executeAIWithRetry(() =>
        model.generateContentStream(controlledPrompt)
      );

      let accumulatedText = "";
      const encoder = new TextEncoder();

      const transformStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of resultStream.stream) {
              const chunkText = chunk.text();
              if (chunkText) {
                accumulatedText += chunkText;
                controller.enqueue(encoder.encode(chunkText));
              }
            }
            // Store accumulated response in LRU Cache for future instant calls
            if (accumulatedText.trim()) {
              aiCache.set(cacheKey, accumulatedText);
            }
            controller.close();
          } catch (err) {
            console.error("[Gemini Stream Process Error]", err);
            controller.error(err);
          }
        },
      });

      return new Response(transformStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Cache": "MISS",
          "X-Response-Time": `${Date.now() - startTime}ms`,
        },
      });
    } else {
      // Non-streaming fallback option
      const result = await executeAIWithRetry(() =>
        model.generateContent(controlledPrompt)
      );
      const text = result.response.text()?.trim() || "";

      if (text) {
        aiCache.set(cacheKey, text);
      }

      return NextResponse.json(
        { text },
        {
          headers: {
            "X-Cache": "MISS",
            "X-Response-Time": `${Date.now() - startTime}ms`,
          },
        }
      );
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}
