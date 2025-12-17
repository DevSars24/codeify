import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userPrompt = body?.prompt?.trim();

    if (!userPrompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY as string
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
    });

    /**
     * 🔒 RESPONSE CONTROL PROMPT
     * - Short
     * - Straight
     * - Clear
     * - No over-explaining
     */
    const controlledPrompt = `
Answer the question clearly and concisely.

Rules:
- Give a detailed reposnse like an senior developer is giving 

Question:
${userPrompt}
    `.trim();

    const result = await model.generateContent(controlledPrompt);
    const text = result.response.text()?.trim() || "";

    return new Response(
      JSON.stringify({
        text,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to generate response",
      }),
      { status: 500 }
    );
  }
}
