// app/history/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import ContestAttempt from "@/models/ContestAttempt";
import HistoryDashboard from "./HistoryDashboard";

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let attempts = [];
  try {
    await connectDB();
    // Fetch data and convert to plain objects for the client
    const rawAttempts = await ContestAttempt.find({ userId })
      .sort({ createdAt: 1 }) // Chronological order for the graph
      .lean();
    
    attempts = JSON.parse(JSON.stringify(rawAttempts));
  } catch (error) {
    console.error("HISTORY_ERROR", error);
  }

  return <HistoryDashboard attempts={attempts} />;
}