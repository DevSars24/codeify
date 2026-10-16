import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId: authUserId } = await auth();
    const userId = authUserId || "guest_developer";

    const body = await req.json();
    const { topic, correct, total, accuracy, language, submissions, difficulty } = body;

    // Validate required fields
    if (!topic || typeof correct !== 'number' || typeof total !== 'number' || typeof accuracy !== 'number' || !language) {
      console.error("SAVE_ERROR: Missing or invalid fields", body);
      return NextResponse.json(
        { error: "Missing required fields: topic, correct, total, accuracy, or language" },
        { status: 400 }
      );
    }

    try {
      const attempt = await prisma.contestAttempt.create({
        data: {
          userId,
          topic,
          correct,
          total,
          accuracy,
          language,
          difficulty,
          submissions: submissions || undefined,
        },
      });

      return NextResponse.json(attempt);
    } catch (dbErr: any) {
      console.warn("[Contest Save API] Remote database is paused or unreachable:", dbErr?.message);
      return NextResponse.json({
        id: `offline-${Date.now()}`,
        userId,
        topic,
        correct,
        total,
        accuracy,
        language,
        difficulty,
        submissions: submissions || undefined,
        createdAt: new Date().toISOString(),
        offlineSaved: true,
      });
    }
  } catch (error: any) {
    console.error("SAVE_ERROR:", error);
    return NextResponse.json(
      {
        error: error.message || "Internal Server Error",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
