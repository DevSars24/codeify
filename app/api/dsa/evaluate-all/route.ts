import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { questions, submissions, language } = await req.json();

    if (!questions || !submissions || !language) {
      return NextResponse.json(
        { error: "Missing required fields: questions, submissions, or language" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Count total questions
    const total = questions.length;

    // STRICT CHECK: Count how many submissions are actually non-empty
    const submissionEntries = Object.entries(submissions)
      .map(([idx, code]: [string, any]) => {
        const question = questions[parseInt(idx)];
        const submittedCode = (code || "").trim();
        return {
          questionIndex: parseInt(idx),
          questionTitle: question?.title || "Unknown",
          questionDescription: question?.description || "",
          testCases: question?.testCases || [],
          submission: submittedCode,
          isEmpty: submittedCode.length === 0 || submittedCode.length < 10 // Less than 10 chars = empty
        };
      });

    // Count how many are actually submitted (non-empty)
    const validSubmissions = submissionEntries.filter(e => !e.isEmpty);

    // If ALL submissions are empty or nearly empty, return 0 immediately
    if (validSubmissions.length === 0) {
      return NextResponse.json({
        correct: 0,
        total: total,
        accuracy: 0
      });
    }

    const prompt = `
      You are a STRICT competitive programming judge.
      Language: ${language}
      
      IMPORTANT: Be VERY STRICT. Only mark a submission as correct if the code logic is completely correct.
      Empty submissions or placeholder code = WRONG.
      Incomplete code = WRONG.
      Syntax errors = WRONG.
      
      Evaluate ${validSubmissions.length} submissions. For each submission, check if the code logic is correct based on the problem description and test cases.
      
      Submissions to evaluate:
      ${JSON.stringify(validSubmissions, null, 2)}
      
      Return ONLY a JSON object with this exact structure (no other text):
      {"correct": <number>, "total": ${total}, "accuracy": <number>}
      
      Remember: accuracy = (correct / ${total}) * 100. Round to nearest integer.
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const text = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", text);
      // STRICT: If parsing fails, give 0 credit
      parsed = {
        correct: 0,
        total: total,
        accuracy: 0
      };
    }

    // Validate and clamp values
    const correct = Math.min(Math.max(0, parsed.correct || 0), total);
    const accuracy = Math.round((correct / total) * 100);

    return NextResponse.json({ correct, total, accuracy });
  } catch (error: any) {
    console.error("EVALUATE_ALL_ERROR:", error);
    return NextResponse.json(
      {
        error: error.message || "Evaluation failed",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}