import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContestAttempt from "@/models/ContestAttempt";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return new NextResponse("Unauthorized", { status: 401 });

    await connectDB();

    const attempts = await ContestAttempt.find({ userId })
      .sort({ createdAt: -1 });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error("HISTORY_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
