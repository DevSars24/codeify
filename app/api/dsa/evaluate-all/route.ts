import { aiCache } from "@/lib/ai/cache";
import { getAIModel, executeAIWithRetry } from "@/lib/ai/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const { questions, submissions, language } = await req.json();

    if (!questions || !submissions || !language) {
      return NextResponse.json(
        { error: "Missing required fields: questions, submissions, or language" },
        { status: 400 }
      );
    }

    const total = questions.length;

    // Filter valid submission entries
    const submissionEntries = Object.entries(submissions).map(([idx, code]: [string, any]) => {
      const question = questions[parseInt(idx)];
      const submittedCode = (code || "").trim();
      return {
        questionIndex: parseInt(idx),
        questionTitle: question?.title || "Unknown",
        questionDescription: question?.description || "",
        testCases: question?.testCases || [],
        submission: submittedCode,
        isEmpty: submittedCode.length < 10,
      };
    });

    const validSubmissions = submissionEntries.filter((e) => !e.isEmpty);

    if (validSubmissions.length === 0) {
      return NextResponse.json({
        correct: 0,
        total: total,
        accuracy: 0,
      });
    }

    // 1. In-Memory Cache Check
    const cacheKey = aiCache.generateKey("dsa_eval_all", { validSubmissions, language });
    const cachedResult = aiCache.get<any>(cacheKey);

    if (cachedResult) {
      console.log(`[Evaluate All Cache Hit] Returned in ${Date.now() - startTime}ms`);
      return NextResponse.json(cachedResult, {
        headers: {
          "X-Cache": "HIT",
          "X-Response-Time": `${Date.now() - startTime}ms`,
        },
      });
    }

    // 2. Optimized Prompt and JSON Mode
    const prompt = `
You are a STRICT competitive programming judge.
Language: ${language}

Evaluate ${validSubmissions.length} submissions against their problems and test cases.
Submissions:
${JSON.stringify(validSubmissions)}

Return ONLY JSON with this structure:
{"correct": <number>, "total": ${total}, "accuracy": <number>}
`.trim();

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

    const rawText = result.response.text();
    const cleanedText = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch {
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { correct: 0, total, accuracy: 0 };
    }

    const correct = Math.min(Math.max(0, parsed.correct || 0), total);
    const accuracy = Math.round((correct / total) * 100);
    const finalPayload = { correct, total, accuracy };

    aiCache.set(cacheKey, finalPayload);

    return NextResponse.json(finalPayload, {
      headers: {
        "X-Cache": "MISS",
        "X-Response-Time": `${Date.now() - startTime}ms`,
      },
    });
  } catch (error: any) {
    console.error("EVALUATE_ALL_ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Evaluation failed" },
      { status: 500 }
    );
  }
}