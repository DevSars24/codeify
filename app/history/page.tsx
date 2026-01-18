import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import ContestAttempt from "@/models/ContestAttempt";

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let attempts: any[] = [];
  try {
    await connectDB();
    attempts = await ContestAttempt.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    console.error("HISTORY_ERROR", error);
  }

  return (
    <div className="min-h-screen bg-black text-white p-10 pt-32">
      <h1 className="text-4xl font-black italic mb-10 uppercase">
        Mission Logs
      </h1>

      {attempts.length === 0 ? (
        <p className="text-zinc-500">No history found.</p>
      ) : (
        attempts.map((a: any) => (
          <div key={a._id} className="p-6 bg-zinc-900 mb-4 rounded-xl">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>{a.topic} • {a.language}</span>
              <span>{new Date(a.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 className="text-2xl font-bold mt-2">
              {a.accuracy}% Accuracy
            </h3>
            <p className="text-xs mt-1">
              Score: {a.correct}/{a.total}
            </p>
          </div>
        ))
      )}
    </div>
  );
}