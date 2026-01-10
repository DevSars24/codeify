import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const { userId } = await auth();

  // Agar user logged in nahi hai toh redirect karein
  if (!userId) {
    redirect("/sign-in");
  }

  const attempts = await prisma.contestAttempt.findMany({
    where: { 
      userId: userId // Direct pass karein, runtime validation safe hai
    },
    orderBy: { 
      createdAt: "desc" 
    },
  });

  return (
    <div className="min-h-screen bg-black text-white p-10 pt-32">
      <h1 className="text-4xl font-black italic mb-10 tracking-tighter uppercase">Mission Logs</h1>
      <div className="grid gap-6">
        {attempts.length === 0 ? (
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No logs found in the neural link.</p>
        ) : (
          attempts.map((attempt) => (
            <div key={attempt.id} className="p-8 bg-zinc-900/50 border border-white/5 rounded-[24px] backdrop-blur-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">
                  {attempt.topic} • {attempt.language}
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date(attempt.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">{attempt.accuracy}% ACCURACY</h3>
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                Score: {attempt.correct} / {attempt.total}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}