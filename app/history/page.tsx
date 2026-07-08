"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { Trophy, Activity, Zap, Terminal, Search } from "lucide-react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import AnimatedCounter from "@/components/AnimatedCounter";

const HistoryVisualizations = dynamic(() => import("@/components/HistoryVisualizations"), {
  ssr: false,
  loading: () => <div className="h-[300px] surface-card flex items-center justify-center text-muted-foreground text-sm">Loading charts...</div>,
});

interface Attempt {
  id: string;
  userId: string;
  contestId: string;
  code: string;
  language: string;
  status: string;
  correct: number;
  total: number;
  accuracy: number;
  topic: string;
  difficulty: string;
  createdAt: string;
}

function StatCard({ label, value, icon, numeric }: { label: string; value: string | number; icon: ReactNode; numeric?: boolean }) {
  return (
    <div className="surface-card p-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
        {numeric && typeof value === "number" ? (
          <AnimatedCounter value={value} suffix={label === "Accuracy" ? "%" : ""} className="text-2xl font-semibold tabular-nums" />
        ) : (
          <p className="text-2xl font-semibold">{value}</p>
        )}
      </div>
      <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center">{icon}</div>
    </div>
  );
}

export default function HistoryPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalMissions: 0, globalAccuracy: 0, totalXP: 0, rank: "Novice" });

  useEffect(() => {
    if (isLoaded && !isSignedIn) redirect("/sign-in");
    fetch("/api/history")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Attempt[]) => {
        setAttempts(data);
        const totalMissions = data.length;
        const totalCorrect = data.reduce((acc, curr) => acc + curr.correct, 0);
        const totalQuestions = data.reduce((acc, curr) => acc + curr.total, 0);
        const globalAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        const totalXP = totalCorrect * 10;
        let rank = "Novice";
        if (totalXP >= 1000) rank = "Grandmaster";
        else if (totalXP >= 500) rank = "Architect";
        else if (totalXP >= 200) rank = "Ninja";
        else if (totalXP >= 50) rank = "Script Kiddie";
        setStats({ totalMissions, globalAccuracy, totalXP, rank });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn]);

  const activityData = attempts.slice(0, 7).reverse().map((a, i) => ({
    name: `M${i + 1}`, accuracy: a.accuracy, xp: a.correct * 10,
  }));
  const langCounts: Record<string, number> = {};
  attempts.forEach((a) => { langCounts[a.language] = (langCounts[a.language] || 0) + 1; });
  const langData = Object.entries(langCounts).map(([name, value]) => ({ name, value }));

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 pt-28 space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 surface-card animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-28 space-y-8">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Mission logs</p>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {user?.firstName || "coder"}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total XP" value={stats.totalXP} icon={<Zap size={16} className="text-foreground" />} numeric />
          <StatCard label="Rank" value={stats.rank} icon={<Trophy size={16} className="text-primary" />} />
          <StatCard label="Missions" value={stats.totalMissions} icon={<Terminal size={16} className="text-foreground" />} numeric />
          <StatCard label="Accuracy" value={stats.globalAccuracy} icon={<Activity size={16} className="text-foreground" />} numeric />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <HistoryVisualizations activityData={activityData} langData={langData} />

            <div className="surface-card overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-medium">Recent attempts</h3>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-muted-foreground text-xs">
                  <Search size={12} /> Filter
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-left">Topic</th>
                      <th className="px-5 py-3 text-left">Language</th>
                      <th className="px-5 py-3 text-left">Accuracy</th>
                      <th className="px-5 py-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {attempts.length === 0 ? (
                      <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No missions yet.</td></tr>
                    ) : (
                      attempts.map((a) => (
                        <tr key={a.id} className="hover:bg-muted/30">
                          <td className="px-5 py-3"><span className={`w-2 h-2 rounded-full inline-block ${a.correct === a.total ? "bg-foreground" : "bg-muted-foreground"}`} /></td>
                          <td className="px-5 py-3 font-medium">{a.topic}</td>
                          <td className="px-5 py-3 font-mono text-xs">{a.language}</td>
                          <td className="px-5 py-3">{a.accuracy}%</td>
                          <td className="px-5 py-3 text-right text-muted-foreground text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="surface-card p-6 border border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5">
                <Activity size={12} className="text-primary" /> Analytics Overview
              </h3>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-border bg-muted">
                <img src="/work4.jpg" alt="Platform Analytics Preview" className="object-cover w-full h-full" />
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                Review detailed reports of your accuracy distribution, language usage charts, and timeline maps to stay on top of your coding progress.
              </p>
            </div>

            <div className="surface-card p-6 border border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Trophy size={12} className="text-primary" /> Learning Goals
              </h3>
              <ul className="text-xs space-y-2.5 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Maintain a daily submission streak
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Reach 90%+ average code accuracy
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Practice across multiple tracks weekly
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
