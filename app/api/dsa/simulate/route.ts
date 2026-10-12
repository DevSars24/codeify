import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { SimulateRequestSchema } from "@/lib/ai/types";
import { simulateCodeWithAI } from "@/lib/ai/service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const rawBody = await req.json();

    const validation = SimulateRequestSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation Error", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { code, language, input, problemId, problemTitle } = validation.data;

    const result = await simulateCodeWithAI({
      userId: userId || "anonymous",
      code,
      language,
      input,
      problemTitle,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[DSA Simulate API Error]", err);
    return NextResponse.json(
      {
        error: err.message || "Failed to simulate code with AI.",
        disclaimer: "Predicted output — code was not executed.",
      },
      { status: err.status || 500 }
    );
  }
}
