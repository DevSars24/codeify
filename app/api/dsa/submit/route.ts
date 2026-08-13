import { aiCache } from "@/lib/ai/cache";
import { getAIModel, executeAIWithRetry } from "@/lib/ai/client";
import { NextResponse } from "next/server";

function getSystemErrorMessage(error: any) {
  const msg = error?.message?.toLowerCase() || "";
  if (msg.includes("api_key") || msg.includes("key not found"))
    return "API Configuration Error: Check your GEMINI_API_KEY environment variable.";
  if (msg.includes("quota") || msg.includes("429"))
    return "Quota Exceeded: Your Gemini API free tier limit has been reached.";
  if (msg.includes("overloaded") || msg.includes("503"))
    return "Model Overloaded: Server is currently busy. Retried automatically.";
  return "Internal Judge Error: " + msg;
}

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const { question, code, language } = await req.json();

    if (!question || !code) {
      return NextResponse.json({
        verdict: "Input Error",
        score: 0,
        feedback: "The judge received empty code or question text.",
      });
    }

    // 1. In-Memory LRU Cache Check
    const cacheKey = aiCache.generateKey("dsa_submit", { question, code, language });
    const cachedResult = aiCache.get<any>(cacheKey);

    if (cachedResult) {
      console.log(`[DSA Submit Cache Hit] Returned in ${Date.now() - startTime}ms`);
      return NextResponse.json(cachedResult, {
        headers: {
          "X-Cache": "HIT",
          "X-Response-Time": `${Date.now() - startTime}ms`,
        },
      });
    }

    // 2. Strict & Compressed Prompt
    const prompt = `
JUDGE TASK: Evaluate DSA Code.
QUESTION: ${question}
USER_CODE (${language || "auto"}): ${code}

RULES:
1. One concise sentence feedback maximum.
2. Return ONLY a JSON object with keys: verdict ("Accepted" | "Wrong Answer" | "Time Limit Exceeded"), score (1 or 0), feedback (string).
`.trim();

    try {
      const model = getAIModel("gemini-flash-lite-latest");

      const result = await executeAIWithRetry(() =>
        model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        })
      );

      const response = await result.response;
      const rawText = response.text();
      const cleanedJson = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanedJson);

      const finalPayload = {
        verdict: parsed.verdict || "Evaluated",
        score: parsed.score ?? 0,
        feedback: parsed.feedback || "Evaluation complete.",
      };

      // Store in LRU cache
      aiCache.set(cacheKey, finalPayload);

      return NextResponse.json(finalPayload, {
        headers: {
          "X-Cache": "MISS",
          "X-Response-Time": `${Date.now() - startTime}ms`,
        },
      });
    } catch (apiErr: any) {
      return NextResponse.json({
        verdict: "System Error",
        score: 0,
        feedback: getSystemErrorMessage(apiErr),
      });
    }
  } catch (err: any) {
    return NextResponse.json({
      verdict: "Request Error",
      score: 0,
      feedback: "Failed to process the request payload.",
    });
  }
}