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
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
            <div className="absolute top-0 right-0 p-32 bg-purple-600/10 blur-[80px] rounded-full group-hover:bg-purple-600/20 transition-all" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-black rounded-xl border border-white/10"><Trophy size={18} className="text-yellow-500" /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Total_Missions</span>
              </div>
              <div className="text-5xl font-black text-white">{totalMissions}</div>
              <div className="text-xs text-zinc-500 mt-2 font-mono">Completed Operations</div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="absolute top-0 right-0 p-32 bg-emerald-600/10 blur-[80px] rounded-full group-hover:bg-emerald-600/20 transition-all" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-black rounded-xl border border-white/10"><Target size={18} className="text-emerald-500" /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Global_Accuracy</span>
              </div>
              <div className="text-5xl font-black text-white">{globalAccuracy}%</div>
              <div className="text-xs text-zinc-500 mt-2 font-mono">{totalCorrect} / {totalQuestions} Validated</div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-all" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-black rounded-xl border border-white/10"><Zap size={18} className="text-blue-500" /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Intensity_Level</span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between"><span className="text-zinc-500">BASIC</span> <span className="text-white">{difficultyStats.Basic}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">MEDIUM</span> <span className="text-white">{difficultyStats.Medium}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">HARD</span> <span className="text-white">{difficultyStats.Hard}</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Logs */}
        <section>
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
                <div key={a._id} className="group relative bg-[#080808] border border-white/5 hover:border-white/10 p-6 md:p-8 rounded-3xl transition-all hover:bg-[#0a0a0a]">
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">

                    {/* Icon & Meta */}
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className={`p-4 rounded-2xl border flex items-center justify-center ${a.accuracy >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                          a.accuracy >= 50 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                            'bg-red-500/10 border-red-500/20 text-red-500'
                        }`}>
                        <span className="font-black text-xl">{a.accuracy}%</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">{a.topic}</h3>
                        <div className="flex gap-2 text-[10px] uppercase font-bold tracking-wider text-zinc-500 mt-1">
                          <span className={a.difficulty === 'Hard' ? 'text-red-400' : a.difficulty === 'Medium' ? 'text-yellow-400' : 'text-zinc-500'}>{a.difficulty || 'BASIC'}</span>
                          <span>•</span>
                          <span>{a.language}</span>
                        </div>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase mb-2">
                        <span>Progress</span>
                        <span>{a.correct} / {a.total} Completed</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${a.accuracy >= 80 ? 'bg-emerald-500' :
                              a.accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${a.accuracy}%` }}
                        />
                      </div>
                    </div>

                    {/* Date & Action */}
                    <div className="flex items-center justify-between md:justify-end gap-6 min-w-[150px]">
                      <div className="flex items-center gap-2 text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
                        <Clock size={12} />
                        {new Date(a.createdAt).toLocaleDateString()}
                      </div>
                      <ChevronRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}