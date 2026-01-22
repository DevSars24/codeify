import { QUESTION_BANK } from "@/lib/questionBank";
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

    // 3. Return Error if Static Bank Empty (No AI Fallback)
    return NextResponse.json(
      { success: false, message: `No questions found for topic: ${topic}` },
      { status: 404 }
    );

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch questions" }, { status: 500 });
  }
}