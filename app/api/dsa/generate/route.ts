import { GoogleGenerativeAI } from "@google/generative-ai";

function isQuotaOrOverloadError(error: any) {
  const msg = error?.message?.toLowerCase() || "";
  return (
    msg.includes("quota") ||
    msg.includes("429") ||
    msg.includes("exceeded") ||
    msg.includes("too many requests") ||
    msg.includes("resource") ||
    msg.includes("overloaded") ||
    msg.includes("unavailable")
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, count } = body;

    /* ---------------- STRONG VALIDATION ---------------- */
    if (
      typeof topic !== "string" ||
      topic.trim().length < 2 ||
      typeof count !== "number" ||
      count < 1 ||
      count > 20
    ) {
      return new Response(
        JSON.stringify({
          error: "Invalid request parameters",
          details: { topic, count },
        }),
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return serverDownResponse();
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
    });

    const prompt = `
You are a senior DSA problem setter.

Return ONLY valid JSON.
No markdown.
No explanation.

Generate ${count} ${topic} DSA questions.

JSON format:
{
  "questions": [
    {
      "id": 1,
      "title": "",
      "description": "",
      "examples": []
    }
  ]
}
`.trim();

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (aiError: any) {
      console.error("GEMINI GENERATE ERROR:", aiError);

      if (isQuotaOrOverloadError(aiError)) {
        return serverDownResponse();
      }

      return new Response(
        JSON.stringify({
          error: "Question generation failed",
          message: "Please try again after some time.",
        }),
        { status: 200 }
      );
    }

    const rawText = result?.response?.text?.();

    if (!rawText || typeof rawText !== "string") {
      return serverDownResponse();
    }

    console.log("RAW GENERATE RESPONSE:", rawText);

    /* ---------------- CLEAN JSON ---------------- */
    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return serverDownResponse();
    }

    if (!Array.isArray(parsed.questions)) {
      return serverDownResponse();
    }

    return new Response(
      JSON.stringify({
        topic,
        total: count,
        questions: parsed.questions,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("DSA GENERATE FATAL:", error);
    return serverDownResponse();
  }
}

/* ---------------- CENTRALIZED SERVER-DOWN RESPONSE ---------------- */

function serverDownResponse() {
  return new Response(
    JSON.stringify({
      error: "Service Temporarily Unavailable",
      message:
        "Due to high traffic, the server is currently overloaded. " +
        "Please try again after some time. " +
        "If the issue persists, contact the site owner Saurabh Singh immediately to restore the service.",
    }),
    { status: 200 }
  );
}
