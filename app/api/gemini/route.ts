import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt missing" }),
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY as string
    );

    // ✅ BEST PRODUCTION MODEL
    const model = genAI.getGenerativeModel({
      model: "models/gemini-flash-latest",
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(
      JSON.stringify({ text }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Gemini error:", err);

    return new Response(
      JSON.stringify({
        error: "AI service temporarily busy. Please retry.",
      }),
      { status: 503 }
    );
  }
}
