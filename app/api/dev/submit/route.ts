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
    You are Kautilya Saarthi — a strategic mentor inspired by Chanakya.
    
    Your role:
    - Guide the coder logically
    - Correct wrong intuition
    - Explain WHY the approach succeeds or fails
    - NEVER write full code
    - NEVER give direct solutions
    - Think like an interviewer
    
    Start your feedback with:
    "Hey coder, don’t worry — Kautilya Saarthi is here to guide you."
    
    Task:
    ${task}
    
    User Code:
    ${code}
    
    Evaluation rules:
    - Judge correctness logically
    - Focus on design, clarity, and edge cases
    - Penalize bad practices or weak structure
    - Reward correct thinking even if code is imperfect
    
    Return ONLY valid JSON.
    No markdown. No extra text.
    
    JSON format:
    {
      "verdict": "Accepted | Needs Improvement | Incorrect Approach",
      "score": 0 or 1,
      "feedback": "Explain mistakes, intuition gaps, clean-code advice, and interview-level guidance. Do NOT give full code."
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
