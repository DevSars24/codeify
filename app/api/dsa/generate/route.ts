


import { QUESTION_BANK } from "@/lib/questionBank";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { topic, difficulty = "Medium", count = 1 } = await req.json();

    // Check if topic exists in Question Bank
    if (QUESTION_BANK[topic]) {
      const filtered = QUESTION_BANK[topic].filter(q => q.difficulty === difficulty);
      const sourceList = filtered.length > 0 ? filtered : QUESTION_BANK[topic];
      
      // Shuffle and take 'count' number of questions
      const shuffled = [...sourceList].sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, count);

      return new Response(JSON.stringify({ 
        success: true, 
        questions: selectedQuestions,
        source: "static_bank" 
      }), { status: 200 });
    }

    // AI Fallback if topic not in bank
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `Generate ${count} DSA problem on "${topic}" with difficulty "${difficulty}". Return JSON with keys: questions[{id, title, description, difficulty, testCases[{input, output}]}]`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text);

    return new Response(JSON.stringify({ 
      success: true, 
      questions: parsed.questions, 
      source: "gemini_ai" 
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ message: "Error loading question" }), { status: 500 });
  }
}