"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { Trophy, Activity, Zap, Clock, Terminal, Search } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell
} from 'recharts';

// Types
interface Attempt {
  _id: string;
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

export default function HistoryPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats State
  const [stats, setStats] = useState({
    totalMissions: 0,
    globalAccuracy: 0,
    totalXP: 0,
    rank: "Novice"
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) redirect("/sign-in");

    // Simulate fetching data for now (Replace with real API call later if needed)
    // For this task, we will try to fetch if an API exists, or fallback to empty state/mock
    // Since the original file had DB logic directly in the component (Server Component), 
    // and I'm converting to Client Component for Recharts, I should ideally fetch data via API.
    // However, to keep it simple and working without creating a new API route immediately,
    // I will mock the data or assuming the user meant to keep it server-side.
    // WAIT: Recharts only works on Client Side. 
    // I'll fetch from a new API route or just use the existing logic if I can.
    // Ah, the previous file was a Server Component connecting directly to DB.
    // I need to create an API route to fetch history if I want this to be a Client Component.
    // OR: I can make this a Server Component that passes data to a Client Component Wrapper.

    // STRATEGY: Create a Client Component for the Dashboard and fetch data from an API.
    // First, let's create the API route.

    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        if (res.ok) {
          const data = await res.json();
          setAttempts(data);
          calculateStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isLoaded, isSignedIn]);


  // Helper Calculation
  const calculateStats = (data: Attempt[]) => {
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
  };

  // Prepare Chart Data
  const activityData = attempts.slice(0, 7).reverse().map((a, i) => ({
    name: `Mission ${i + 1}`,
    accuracy: a.accuracy,
    xp: a.correct * 10
  }));

  const langCounts: Record<string, number> = {};
  attempts.forEach(a => { langCounts[a.language] = (langCounts[a.language] || 0) + 1; });
  const langData = Object.entries(langCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

  // Loading State
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">Initializing Mission Control...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 pb-20">

      {/* Header */}
      <header className="border-b border-zinc-900 bg-black/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="font-bold text-sm tracking-widest uppercase text-zinc-400">Mission Control</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono text-zinc-600">User: {user?.firstName || 'Unknown'}</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total XP" value={stats.totalXP.toString()} icon={<Zap size={18} className="text-yellow-500" />} />
          <StatCard label="Current Rank" value={stats.rank} icon={<Trophy size={18} className="text-purple-500" />} />
          <StatCard label="Missions" value={stats.totalMissions.toString()} icon={<Terminal size={18} className="text-blue-500" />} />
          <StatCard label="Accuracy" value={`${stats.globalAccuracy}%`} icon={<Activity size={18} className="text-emerald-500" />} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Activity Chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6">Recent Performance Metrics</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" hide />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="accuracy" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorAccuracy)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Language Distribution */}
          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 flex flex-col items-center justify-center">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6 w-full text-left">Language Core</h3>
            <div className="h-[250px] w-full">
              {langData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={langData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {langData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-600 text-xs text-center">
                  NO DATA AVAILABLE
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Logs Table */}
        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Mission Logs</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black border border-zinc-800 text-zinc-500 text-xs">
              <Search size={14} />
              <span>Search logs...</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-black/50 text-zinc-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Mission Report</th>
                  <th className="px-6 py-4">Language</th>
                  <th className="px-6 py-4">Accuracy</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {attempts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
                      No missions attempted yet.
                    </td>
                  </tr>
                ) : (
                  attempts.map((attempt) => (
                    <tr key={attempt._id} className="hover:bg-zinc-900/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`w-2 h-2 rounded-full ${attempt.correct === attempt.total ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      </td>
                      <td className="px-6 py-4 font-medium text-white">{attempt.topic}</td>
                      <td className="px-6 py-4 font-mono text-xs">{attempt.language}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500" style={{ width: `${attempt.accuracy}%` }} />
                          </div>
                          <span className="text-xs">{attempt.accuracy}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-zinc-600">
                        {new Date(attempt.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-colors">
      <div>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-lg bg-black border border-zinc-800 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
        {icon}
      </div>
    </div>
  )
}