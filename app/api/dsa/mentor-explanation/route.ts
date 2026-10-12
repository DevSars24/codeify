import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { MentorExplanationRequestSchema } from "@/lib/ai/types";
import { explainWithMentorAI } from "@/lib/ai/service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const rawBody = await req.json();

    const validation = MentorExplanationRequestSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation Error", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { code, language, problemTitle, problemDescription, assessmentSummary, likelyEdgeCases } = validation.data;

    const result = await explainWithMentorAI({
      userId: userId || "anonymous",
      code,
      language,
      problemTitle,
      problemDescription,
      assessmentSummary,
      likelyEdgeCases,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[DSA Mentor Explanation Error]", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate mentor explanation." },
      { status: err.status || 500 }
    );
  }
}
