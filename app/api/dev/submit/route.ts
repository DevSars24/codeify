import { aiCache } from "@/lib/ai/cache";
import { executeAIRequest } from "@/lib/ai/provider";
import { NextResponse } from "next/server";

function isQuotaError(error: any) {
  const msg = error?.message?.toLowerCase?.() || "";
  return (
    msg.includes("quota") ||
    msg.includes("429") ||
    msg.includes("rate") ||
    msg.includes("exceeded") ||
    msg.includes("too many requests")
  );
}

function safeJson(text: string) {
  try {
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { task, code } = body;

    /* 🔒 INPUT VALIDATION */
    if (
      typeof task !== "string" ||
      task.length < 10 ||
      typeof code !== "string" ||
      code.trim().length < 5
    ) {
      return NextResponse.json({
        verdict: "Invalid Submission",
        score: 0,
        feedback: "Task description or code is invalid.",
      });
    }

    // 1. In-Memory Cache Check
    const cacheKey = aiCache.generateKey("dev_submit", { task, code });
    const cachedResult = aiCache.get<any>(cacheKey);

    if (cachedResult) {
      console.log(`[Dev Submit Cache Hit] Returned in ${Date.now() - startTime}ms`);
      return NextResponse.json(cachedResult, {
        headers: {
          "X-Cache": "HIT",
          "X-Response-Time": `${Date.now() - startTime}ms`,
        },
      });
    }

    const systemPrompt = `You are Kautilya Saarthi — a strategic mentor inspired by Chanakya.
Role:
- Guide the coder logically and correct wrong intuition.
- Start feedback with: "Hey coder, don’t worry — Kautilya Saarthi is here to guide you."
- NEVER write full code or give direct solutions.
Return ONLY valid JSON matching:
{
  "verdict": "Accepted" | "Needs Improvement" | "Incorrect Approach",
  "score": 0 | 1,
  "feedback": "string"
}`;

    const prompt = `Task:
${task}

User Code:
${code}`;

    try {
      const aiRes = await executeAIRequest({
        systemPrompt,
        userPrompt: prompt,
        responseFormat: "json",
        modelType: "fast",
        temperature: 0.2,
      });

      const rawText = aiRes.text;
      const parsed = rawText ? safeJson(rawText) : null;

      if (!parsed) {
        return NextResponse.json({
          verdict: "Evaluation Error",
          score: 0,
          feedback: "Evaluation engine returned invalid output. Please retry.",
        });
      }

      const finalPayload = {
        verdict: parsed.verdict ?? "Needs Improvement",
        score: parsed.score === 1 ? 1 : 0,
        feedback: parsed.feedback ?? "No feedback provided.",
        provider: aiRes.provider,
        model: aiRes.model,
      };

      aiCache.set(cacheKey, finalPayload);

      return NextResponse.json(finalPayload, {
        headers: {
          "X-Cache": "MISS",
          "X-Response-Time": `${Date.now() - startTime}ms`,
          "X-Provider": aiRes.provider,
        },
      });
    } catch (aiError: any) {
      console.error("DEV SUBMIT AI ERROR:", aiError);

      if (isQuotaError(aiError)) {
        return NextResponse.json({
          verdict: "Judge Busy",
          score: 0,
          feedback:
            "Many users are submitting solutions right now. The evaluation server is temporarily busy. Please retry shortly.",
        });
      }

      return NextResponse.json({
        verdict: "Judge Error",
        score: 0,
        feedback: "AI failed to evaluate your solution.",
      });
    }
  } catch (error) {
    console.error("DEV SUBMIT FATAL:", error);
    return NextResponse.json({
      verdict: "Internal Error",
      score: 0,
      feedback: "An internal server error occurred.",
    });
  }
}
