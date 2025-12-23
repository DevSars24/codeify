export const runtime = "nodejs";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🛑 Detailed Validation
    const { userId, topic, total, correct, accuracy, language } = body;
    
    const requiredFields = { userId, topic, total, correct, accuracy, language };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
      }
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

  } catch (error) {
    // 🔍 Strategic Error Identification
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors (P2002, P2003, etc.)
      console.error("PRISMA KNOWN ERROR:", error.code, error.message);
      return NextResponse.json(
        { error: `Database error: ${error.code}`, details: error.message },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error("PRISMA INIT ERROR:", error.message);
      return NextResponse.json(
        { error: "Failed to connect to database. Check connection string." },
        { status: 503 }
      );
    }

    console.error("UNEXPECTED SERVER ERROR:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while saving." },
      { status: 500 }
    );
  }
}