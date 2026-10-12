import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { assessCodeWithAI } from "@/lib/ai/service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { question, title, code, language, problemId, description } = body;

    const problemTitle = title || question || "DSA Problem";
    const userCode = code?.trim();

    if (!userCode) {
      return NextResponse.json({
        verdict: "Input Error",
        verdictLabel: "Input Error",
        score: 0,
        aiEstimatedScore: 0,
        scoreLabel: "AI-estimated score",
        feedback: "Empty code submitted. Please write a solution before submitting.",
        isVerified: false,
        disclaimer: "AI-estimated assessment — code was not executed on a sandbox runner.",
      });
    }

    const assessment = await assessCodeWithAI({
      userId: userId || "anonymous",
      code: userCode,
      language: language || "python",
      problemId: problemId,
      problemTitle,
      problemDescription: description || "",
    });

    return NextResponse.json({
      verdict: assessment.verdictLabel,
      verdictLabel: assessment.verdictLabel,
      score: assessment.aiEstimatedScore >= 70 ? 1 : 0, // Legacy 0/1 score
      aiEstimatedScore: assessment.aiEstimatedScore, // Accurate 0-100 AI estimate
      scoreLabel: "AI-estimated score",
      isVerified: false,
      disclaimer: assessment.disclaimer,
      feedback: assessment.summary,
      timeComplexity: assessment.timeComplexity,
      spaceComplexity: assessment.spaceComplexity,
      likelyEdgeCaseFailures: assessment.likelyEdgeCaseFailures,
      confidence: assessment.confidence,
      provider: assessment.provider,
      model: assessment.model,
      cached: assessment.cached,
      assessmentId: assessment.assessmentId,
    });
  } catch (error: any) {
    console.error("[DSA Submit API Error]:", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to assess submission.",
        disclaimer: "AI-estimated assessment — code was not executed on a sandbox runner.",
      },
      { status: error?.status || 500 }
    );
  }
}