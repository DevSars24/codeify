import { DEV_QUESTION_BANK } from "@/lib/questionBank2";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { category = "web", count = 5 } = await req.json();

    // Normalize Category
    const validCategory = (category.toLowerCase() in DEV_QUESTION_BANK) ? category.toLowerCase() : "web";
    const bank = DEV_QUESTION_BANK[validCategory] || DEV_QUESTION_BANK["web"];

    // Select random questions
    const selected = [...bank]
      .sort(() => 0.5 - Math.random())
      .slice(0, count);

    return NextResponse.json({ success: true, tasks: selected });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch tasks" }, { status: 500 });
  }
}
