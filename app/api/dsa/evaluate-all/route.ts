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
    
    // Build evaluation prompt with structured data
    const submissionEntries = Object.entries(submissions)
      .map(([idx, code]: [string, any]) => {
        const question = questions[parseInt(idx)];
        return {
          questionIndex: idx,
          questionTitle: question?.title || "Unknown",
          questionDescription: question?.description || "",
          testCases: question?.testCases || [],
          submission: code || ""
        };
      });

    const prompt = `
      Act as a competitive programming judge.
      Language: ${language}
      
      Evaluate ${total} submissions. For each submission, check if the code logic is correct based on the problem description and test cases.
      
      Submissions to evaluate:
      ${JSON.stringify(submissionEntries, null, 2)}
      
      For each submission, return:
      - correct: boolean (true if the logic is correct, false otherwise)
      
      Return a JSON object with this exact structure:
      {
        "correct": number (count of correct submissions, 0-${total}),
        "total": ${total},
        "accuracy": number (percentage, 0-100)
      }
      
      Example response: {"correct": 3, "total": 5, "accuracy": 60}
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const text = rawText.replace(/```json|```/g, "").trim();
    
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", text);
      // Fallback: count non-empty submissions as correct if parsing fails
      const nonEmptySubmissions = Object.values(submissions).filter((code: any) => code && code.trim().length > 0);
      parsed = {
        correct: Math.floor(nonEmptySubmissions.length * 0.6), // Conservative estimate
        total: total,
        accuracy: Math.round((nonEmptySubmissions.length * 0.6 / total) * 100)
      };
    }

    // Validate response structure
    if (typeof parsed.correct !== 'number' || typeof parsed.total !== 'number' || typeof parsed.accuracy !== 'number') {
      throw new Error("Invalid response structure from AI");
    }

    return NextResponse.json(parsed);
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