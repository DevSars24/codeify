import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { AssessRequestSchema } from "@/lib/ai/types";
import { assessCodeWithAI } from "@/lib/ai/service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const rawBody = await req.json();

    const validation = AssessRequestSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation Error", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { code, language, problemId, problemTitle, problemDescription } = validation.data;

    const result = await assessCodeWithAI({
      userId: userId || "anonymous",
      code,
      language,
      problemId,
      problemTitle,
      problemDescription,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[DSA Assess API Error]", err);
    return NextResponse.json(
      {
        error: err.message || "Failed to assess code with AI.",
        disclaimer: "AI-estimated assessment — code was not executed on a sandbox runner.",
      },
      { status: err.status || 500 }
    );
  }
}
