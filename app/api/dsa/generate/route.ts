import { GoogleGenerativeAI } from "@google/generative-ai";

/* ---------- ERROR CHECK ---------- */
function isQuotaOrOverloadError(error: any) {
  const msg = error?.message?.toLowerCase?.() || "";
  return (
    msg.includes("quota") ||
    msg.includes("429") ||
    msg.includes("exceeded") ||
    msg.includes("too many requests") ||
    msg.includes("overloaded") ||
    msg.includes("unavailable")
  );
}

/* ---------- SERVER DOWN ---------- */
function serverDownResponse(message?: string) {
  return new Response(
    JSON.stringify({
      error: "Service Temporarily Unavailable",
      message:
        message ||
        "The server is currently overloaded. Please try again later.",
    }),
    { status: 503 }
  );
}

/* ---------- API ---------- */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, count } = body;

    /* ✅ VALIDATION */
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
      return serverDownResponse("AI service not configured.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
    });

    const prompt = `
You are Kautilya Saarthi — a senior DSA problem setter.

Rules:
- Generate interview-quality DSA problems
- No solutions, no hints
- Clear problem statements
- Each problem must have examples
- Return ONLY valid JSON
- No markdown, no explanation

Generate ${count} DSA problems on topic: ${topic}

JSON format:
{
  "questions": [
    {
      "id": 1,
      "title": "Problem title",
      "description": "Problem description",
      "examples": [
        {
          "input": "",
          "output": "",
          "explanation": ""
        }
      ]
    }
  ]
}
`.trim();

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (aiError: any) {
      console.error("DSA GENERATE AI ERROR:", aiError);
      if (isQuotaOrOverloadError(aiError)) {
        return serverDownResponse();
      }
      return serverDownResponse("Failed to generate questions.");
    }

    const rawText = result?.response?.text?.();
    if (!rawText) return serverDownResponse();

    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("JSON PARSE FAILED:", cleaned);
      return serverDownResponse("Invalid AI response format.");
    }

    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return serverDownResponse("No questions generated.");
    }

    return new Response(
      JSON.stringify({
        topic,
        total: parsed.questions.length,
        questions: parsed.questions,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("DSA GENERATE FATAL:", error);
    return serverDownResponse();
  }
}
