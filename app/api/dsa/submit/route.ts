import { GoogleGenerativeAI } from "@google/generative-ai";

// Enhanced error detection for Gemini Quota/API issues
function getSystemErrorMessage(error: any) {
  const msg = error?.message?.toLowerCase() || "";
  if (msg.includes("api_key") || msg.includes("key not found")) 
    return "API Configuration Error: Check your GEMINI_API_KEY environment variable.";
  if (msg.includes("quota") || msg.includes("429")) 
    return "Quota Exceeded: Your Gemini API free tier limit has been reached.";
  if (msg.includes("overloaded") || msg.includes("503")) 
    return "Model Overloaded: gemini-flash-lite-latest is currently busy. Try again in 10 seconds.";
  return "Internal Judge Error: " + msg;
}

export async function POST(req: Request) {
  try {
    const { question, code, language } = await req.json();

    // Edge Case: Empty Inputs
    if (!question || !code) {
      return Response.json({
        verdict: "Input Error",
        score: 0,
        feedback: "The judge received empty code or question text.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({
        verdict: "Setup Error",
        score: 0,
        feedback: "GEMINI_API_KEY is missing from the server environment.",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    // Strict prompt to ensure valid JSON and avoid prose
    const prompt = `
      JUDGE TASK: Evaluate DSA Code.
      QUESTION: ${question}
      USER_CODE (${language}): ${code}

      RULES:
      1. One sentence feedback maximum.
      2. No code snippets in feedback.
      3. Return ONLY valid JSON.

      FORMAT:
      {
        "verdict": "Accepted" | "Wrong Answer" | "Time Limit Exceeded",
        "score": 1 or 0,
        "feedback": "string"
      }
    `.trim();

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text();
      
      // Clean JSON in case model adds markdown backticks
      const cleanedJson = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanedJson);

      return Response.json({
        verdict: parsed.verdict || "Evaluated",
        score: parsed.score ?? 0,
        feedback: parsed.feedback || "Evaluation complete.",
      });

    } catch (apiErr: any) {
      // Catch specific Gemini API Errors (Quota, Keys, Model Busy)
      return Response.json({
        verdict: "System Error",
        score: 0,
        feedback: getSystemErrorMessage(apiErr),
      });
    }

  } catch (err: any) {
    return Response.json({
      verdict: "Request Error",
      score: 0,
      feedback: "Failed to process the request payload.",
    });
  }
}