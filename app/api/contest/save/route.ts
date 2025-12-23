export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, topic, total, correct, accuracy, language } = body;

    // 🛑 Validation
    if (!userId || !topic || !language) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const saved = await prisma.contestAttempt.create({
      data: {
        userId,
        topic,
        total: Number(total),
        correct: Number(correct),
        accuracy: Number(accuracy),
        language,
      },
    });

    return NextResponse.json({ success: true, id: saved.id }, { status: 201 });
  } catch (error: any) {
    console.error("❌ SAVE ERROR:", error);

    // Handle Prisma errors by checking the error code directly
    // This avoids needing the 'Prisma' namespace import
    if (error?.code === "P2022") {
      return NextResponse.json(
        { error: "Database schema mismatch. Please run npx prisma db push." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save contest", details: error.message },
      { status: 500 }
    );
  }
}