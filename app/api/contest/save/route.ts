import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { topic, correct, total, accuracy, language } = body;

    const attempt = await prisma.contestAttempt.create({
      data: {
        userId,
        topic,
        correct,
        total,
        accuracy,
        language,
        // aiReview field empty rahega ya remove kar sakte hain schema se
      },
    });

    return NextResponse.json(attempt);
  } catch (error) {
    console.error("SAVE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}