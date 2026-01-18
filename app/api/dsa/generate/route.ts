import { QUESTION_BANK } from "@/lib/questionBank";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic, difficulty, count = 1 } = await req.json();

    // 1. Normalize Difficulty (UI sends 'Basic', Bank uses 'Easy')
    const diffMap: Record<string, any> = { "Basic": "Easy", "Medium": "Medium", "Hard": "Hard" };
    const targetDiff = diffMap[difficulty] || "Easy";

    // 2. Try Static Bank First
    if (QUESTION_BANK[topic]) {
      const filtered = QUESTION_BANK[topic].filter(q => q.difficulty === targetDiff);
      const sourceList = filtered.length > 0 ? filtered : QUESTION_BANK[topic];
      
      const selected = [...sourceList]
        .sort(() => 0.5 - Math.random())
        .slice(0, count);

      return NextResponse.json({ success: true, questions: selected, source: "static" });
    }

    // 3. AI Fallback (Strict JSON Mode)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate ${count} DSA problem(s) on "${topic}" with difficulty "${targetDiff}". 
    Return strictly a JSON object: {"questions": [{"id": number, "title": string, "description": string, "difficulty": string, "testCases": [{"input": string, "output": string}]}]}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text);

    return NextResponse.json({ success: true, questions: parsed.questions, source: "ai" });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch questions" }, { status: 500 });
  }
}