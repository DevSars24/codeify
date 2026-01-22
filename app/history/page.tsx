import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import ContestAttempt from "@/models/ContestAttempt";
import { Trophy, Target, Zap, Clock, ChevronRight, Activity } from "lucide-react";

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

  // Calculate Stats
  const totalMissions = attempts.length;
  const totalCorrect = attempts.reduce((acc, curr) => acc + curr.correct, 0);
  const totalQuestions = attempts.reduce((acc, curr) => acc + curr.total, 0);
  const globalAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // XP & Rank System
  const xp = totalCorrect * 10;
  let rank = "Novice";
  let nextRank = "Script Kiddie";
  let xpTarget = 50;

  if (xp >= 1000) { rank = "Grandmaster"; nextRank = "Max Level"; xpTarget = 1000; }
  else if (xp >= 500) { rank = "System Architect"; nextRank = "Grandmaster"; xpTarget = 1000; }
  else if (xp >= 200) { rank = "Code Ninja"; nextRank = "System Architect"; xpTarget = 500; }
  else if (xp >= 50) { rank = "Script Kiddie"; nextRank = "Code Ninja"; xpTarget = 200; }

  const xpProgress = Math.min((xp / xpTarget) * 100, 100);

  // Topic Mastery (Top 3)
  const topicCounts: Record<string, number> = {};
  attempts.forEach(a => { topicCounts[a.topic] = (topicCounts[a.topic] || 0) + a.correct; });
  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Language Distribution
  const langCounts: Record<string, number> = {};
  attempts.forEach(a => { langCounts[a.language] = (langCounts[a.language] || 0) + 1; });
  const totalLangs = Object.values(langCounts).reduce((a, b) => a + b, 0);

  const difficultyStats = {
    Basic: attempts.filter(a => a.difficulty === 'Basic').length,
    Medium: attempts.filter(a => a.difficulty === 'Medium').length,
    Hard: attempts.filter(a => a.difficulty === 'Hard').length
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-purple-500/30">

      {/* Header */}
      <header className="pt-24 pb-12 px-6 border-b border-white/5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
                  <Activity size={20} />
                </div>
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-500">System_Logs_V2</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic">
                Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Control</span>
              </h1>
            </div>

            {/* Rank Card */}
            <div className="p-6 bg-zinc-900/80 backdrop-blur border border-white/10 rounded-2xl min-w-[280px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Current Rank</span>
                <Trophy size={16} className="text-yellow-500" />
              </div>
              <div className="text-2xl font-black text-white uppercase italic">{rank}</div>
              <div className="mt-4">
                <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-600 mb-1">
                  <span>{xp} XP</span>
                  <span>{nextRank}</span>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600" style={{ width: `${xpProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ... (Keep existing Stats cards but maybe update styles slightly if needed, existing is fine) ... */}
          {/* Re-implementing simplified to allow replacing efficiently */}
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
            <div className="absolute top-0 right-0 p-32 bg-purple-600/10 blur-[80px] rounded-full group-hover:bg-purple-600/20 transition-all" />
            <div className="relative z-10">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4">Total_Missions</div>
              <div className="text-5xl font-black text-white">{totalMissions}</div>
            </div>
          </div>
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="absolute top-0 right-0 p-32 bg-emerald-600/10 blur-[80px] rounded-full group-hover:bg-emerald-600/20 transition-all" />
            <div className="relative z-10">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4">Global_Accuracy</div>
              <div className="text-5xl font-black text-white">{globalAccuracy}%</div>
            </div>
          </div>
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            {/* Topic Mastery Mini-Chart */}
            <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-all" />
            <div className="relative z-10">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-6">Top_Topics</div>
              <div className="space-y-3">
                {topTopics.map(([t, c], i) => (
                  <div key={t} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-400 w-20 truncate">{t}</span>
                    <div className="flex-1 h-1.5 bg-black rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${(c / Math.max(...topTopics.map(x => x[1]), 1)) * 100}%` }} />
                    </div>
                  </div>
                ))}
                {topTopics.length === 0 && <span className="text-xs text-zinc-600">No data yet.</span>}
              </div>
            </div>
          </div>
        </section>

        {/* Language & Recent Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Sidebar: Languages */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6">Languages_Used</h3>
              <div className="space-y-4">
                {Object.entries(langCounts).map(([l, c]) => (
                  <div key={l} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/30 border border-white/5">
                    <span className="font-bold text-sm text-zinc-300">{l}</span>
                    <span className="text-xs font-mono text-zinc-500">{Math.round((c / totalLangs) * 100)}%</span>
                  </div>
                ))}
                {totalLangs === 0 && <span className="text-xs text-zinc-600">No data yet.</span>}
              </div>
            </div>
          </div>

          {/* Main: Recent Logs */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-black italic uppercase text-white mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-purple-500 rounded-full" />
              Recent_Operations
            </h2>
            <div className="space-y-4">
              {attempts.length === 0 ? (
                <div className="p-10 border border-dashed border-zinc-800 rounded-3xl text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  No Data Found. Initialize Sequence.
                </div>
              ) : (
                attempts.map((a: any) => (
                  <div key={a._id} className="group relative bg-[#080808] border border-white/5 hover:border-white/10 p-6 rounded-2xl transition-all hover:bg-[#0a0a0a]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm border ${a.accuracy >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                            a.accuracy >= 50 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                              'bg-red-500/10 border-red-500/20 text-red-500'
                          }`}>
                          {a.accuracy}%
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{a.topic}</h3>
                          <div className="flex gap-2 text-[10px] uppercase font-bold tracking-wider text-zinc-600 mt-0.5">
                            <span>{a.difficulty || 'BASIC'}</span>
                            <span>•</span>
                            <span>{a.language}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 justify-between sm:justify-end">
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-zinc-500 uppercase">Score</div>
                          <div className="text-sm font-bold text-white font-mono">{a.correct}/{a.total}</div>
                        </div>
                        <div className="text-right pl-4 border-l border-zinc-800">
                          <div className="text-[10px] font-bold text-zinc-500 uppercase">Date</div>
                          <div className="text-sm font-bold text-white font-mono">{new Date(a.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}