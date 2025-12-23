import { GoogleGenerativeAI } from "@google/generative-ai";

/* ---------- ERROR CLASSIFIER ---------- */
function classifyAIError(error: any) {
  const msg = error?.message?.toLowerCase?.() || "";

  if (
    msg.includes("quota") ||
    msg.includes("exceeded") ||
    msg.includes("too many requests") ||
    msg.includes("429")
  ) {
    return {
      status: 429,
      code: "AI_QUOTA_EXCEEDED",
      message: "AI quota exceeded. Try again later.",
    };
  }

  return {
    status: 500,
    code: "AI_ERROR",
    message: "AI generation failed.",
  };
}

/* ---------- RESPONSE ---------- */
function jsonError(status: number, code: string, message: string) {
  return new Response(
    JSON.stringify({ error: true, code, message }),
    { status }
  );
}

/* ---------- API ---------- */
export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (typeof topic !== "string" || topic.length < 2) {
      return jsonError(400, "INVALID_TOPIC", "Invalid topic");
    }

    if (!process.env.GEMINI_API_KEY) {
      return jsonError(500, "AI_NOT_CONFIGURED", "AI not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
    });

    /* 🔥 ULTRA-SHORT PROMPT (LOW TOKEN) */
    const prompt = `
Generate ONE short DSA problem on topic "${topic}".
Return ONLY valid JSON in this format:

{
  "questions": [
    {
      "id": 1,
      "title": "",
      "description": ""
    }
  ]
}
`.trim();

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (err: any) {
      const classified = classifyAIError(err);
      return jsonError(
        classified.status,
        classified.code,
        classified.message
      );
    }

    const text = result?.response?.text?.();
    if (!text) {
      return jsonError(502, "AI_EMPTY", "Empty AI response");
    }

    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return jsonError(502, "AI_BAD_JSON", "Invalid JSON from AI");
    }

    return new Response(
      JSON.stringify({
        success: true,
        topic,
        questions: parsed.questions,
      }),
      { status: 200 }
    );
  } catch {
    return jsonError(500, "SERVER_ERROR", "Unexpected error");
  }
}
