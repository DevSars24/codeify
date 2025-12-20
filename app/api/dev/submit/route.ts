import { GoogleGenerativeAI } from "@google/generative-ai";

/* ---------- HELPERS ---------- */
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
    return JSON.parse(
      text.replace(/```json/g, "").replace(/```/g, "").trim()
    );
  } catch {
    return null;
  }
}

/* ---------- API ---------- */
export async function POST(req: Request) {
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
      return new Response(
        JSON.stringify({
          verdict: "Invalid Submission",
          score: 0,
          feedback: "Task description or code is invalid.",
        }),
        { status: 200 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          verdict: "Judge Unavailable",
          score: 0,
          feedback:
            "Practice evaluation service is currently unavailable. Please contact Saurabh Singh.",
        }),
        { status: 200 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
    });

    const prompt = `
You are a strict senior code reviewer.

Evaluate the solution logically and practically.

Task:
${task}

User Code:
${code}

Rules:
- Return ONLY valid JSON
- Be concise and constructive

JSON format:
{
  "verdict": "Accepted | Needs Improvement",
  "score": 0 or 1,
  "feedback": ""
}
`.trim();

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (aiError: any) {
      console.error("DEV SUBMIT AI ERROR:", aiError);

      if (isQuotaError(aiError)) {
        return new Response(
          JSON.stringify({
            verdict: "Judge Busy",
            score: 0,
            feedback:
              "Many users are submitting solutions right now. The evaluation server is temporarily busy. Please retry shortly.",
          }),
          { status: 200 }
        );
      }

      return new Response(
        JSON.stringify({
          verdict: "Judge Error",
          score: 0,
          feedback: "AI failed to evaluate your solution.",
        }),
        { status: 200 }
      );
    }

    const rawText = result?.response?.text?.();
    const parsed = rawText ? safeJson(rawText) : null;

    if (!parsed) {
      return new Response(
        JSON.stringify({
          verdict: "Evaluation Error",
          score: 0,
          feedback:
            "Evaluation engine returned invalid output. Please retry.",
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        verdict: parsed.verdict ?? "Needs Improvement",
        score: parsed.score === 1 ? 1 : 0,
        feedback: parsed.feedback ?? "No feedback provided.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("DEV SUBMIT FATAL:", error);

    return new Response(
      JSON.stringify({
        verdict: "Internal Error",
        score: 0,
        feedback:
          "An internal server error occurred. Please contact Saurabh Singh.",
      }),
      { status: 200 }
    );
  }
}
