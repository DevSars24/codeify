import { GoogleGenerativeAI } from "@google/generative-ai";

function isOverloadError(error: any) {
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
    const { question, code, language } = body;

    if (
      typeof question !== "string" ||
      question.trim().length < 10 ||
      typeof code !== "string" ||
      code.trim().length < 5
    ) {
      return Response.json({
        verdict: "Invalid Submission",
        score: 0,
        feedback: "Question or code is invalid.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return serviceDownResponse();
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
    });

    const prompt = `
    You are Kautilya Saarthi, a strict judge.
    
    Rules:
    - Do NOT give full code
    - Be extremely brief
    - One or two sentences only
    
    Question:
    ${question}
    
    User Code (${language}):
    ${code}
    
    Return ONLY valid JSON.
    
    JSON:
    {
      "verdict": "Accepted | Wrong | Partial",
      "score": 0 or 1,
      "feedback": "One short hint or mistake summary (max 20 words)."
    }
    `.trim();
    
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (err: any) {
      if (isOverloadError(err)) return serviceDownResponse();
      return judgeErrorResponse();
    }

    const raw = result?.response?.text?.();
    if (!raw) return judgeErrorResponse();

    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return judgeErrorResponse();
    }

    return Response.json({
      verdict: parsed.verdict || "Wrong Answer",
      score: parsed.score === 1 ? 1 : 0,
      feedback: parsed.feedback || "No feedback provided.",
    });

  } catch (err) {
    return serviceDownResponse();
  }
}

function serviceDownResponse() {
  return Response.json({
    verdict: "Judge Unavailable",
    score: 0,
    feedback:
      "Due to high traffic, the server is temporarily overloaded. Please try again later. If the issue persists, contact the site owner Saurabh Singh immediately.",
  });
}

function judgeErrorResponse() {
  return Response.json({
    verdict: "Evaluation Error",
    score: 0,
    feedback: "The judge failed to evaluate this submission.",
  });
}
