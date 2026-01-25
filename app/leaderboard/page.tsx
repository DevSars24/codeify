"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Trophy, Medal, Crown, Zap, Users, TrendingUp } from "lucide-react";

interface LeaderboardEntry {
    rank: number;
    userId: string;
    userName: string;
    userImage: string | null;
    xp: number;
    contestCount: number;
    tier: string;
    tierColor: string;
}

// Rating tier badges
const tierIcons: Record<string, any> = {
    Grandmaster: Crown,
    Master: Crown,
    Expert: Trophy,
    Candidate: Medal,
    Specialist: Medal,
    Knight: Zap,
    Novice: Zap,
};

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const res = await fetch("/api/leaderboard");
                if (res.ok) {
                    const data = await res.json();
                    setLeaderboard(data);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        }
        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">Loading Rankings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 md:px-6 pt-28 md:pt-36 pb-20">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                        <Trophy size={16} className="text-purple-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Global Rankings</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
                        Leader<span className="text-purple-500">board</span>
                    </h1>
                    <p className="text-zinc-500 text-sm max-w-md mx-auto">
                        Top coders ranked by total XP earned from contests
                    </p>
                </div>

                {/* Rating Tiers Legend */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {[
                        { tier: "Grandmaster", color: "#ff0000", xp: "2000+" },
                        { tier: "Master", color: "#ff8c00", xp: "1500+" },
                        { tier: "Expert", color: "#a855f7", xp: "1000+" },
                        { tier: "Candidate", color: "#3b82f6", xp: "500+" },
                        { tier: "Specialist", color: "#22c55e", xp: "200+" },
                        { tier: "Knight", color: "#06b6d4", xp: "50+" },
                        { tier: "Novice", color: "#71717a", xp: "0+" },
                    ].map((t) => (
                        <div key={t.tier} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                            <span className="text-[10px] font-bold uppercase" style={{ color: t.color }}>{t.tier}</span>
                            <span className="text-[10px] text-zinc-600">{t.xp} XP</span>
                        </div>
                    ))}
                </div>

                {/* Leaderboard Table */}
                <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800 overflow-hidden">
                    {leaderboard.length === 0 ? (
                        <div className="py-20 text-center">
                            <Users size={48} className="mx-auto text-zinc-700 mb-4" />
                            <p className="text-zinc-500 font-mono text-sm uppercase">No rankings yet</p>
                            <p className="text-zinc-600 text-xs mt-2">Complete contests to appear here!</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-black/50 text-zinc-500 uppercase text-xs font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 text-left">Rank</th>
                                    <th className="px-6 py-4 text-left">Coder</th>
                                    <th className="px-6 py-4 text-center">Tier</th>
                                    <th className="px-6 py-4 text-right">XP</th>
                                    <th className="px-6 py-4 text-right hidden sm:table-cell">Contests</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {leaderboard.map((entry) => {
                                    const TierIcon = tierIcons[entry.tier] || Zap;
                                    return (
                                        <tr key={entry.userId} className="hover:bg-zinc-900/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                                                        entry.rank === 2 ? 'bg-zinc-400/20 text-zinc-400' :
                                                            entry.rank === 3 ? 'bg-orange-500/20 text-orange-500' :
                                                                'bg-zinc-800 text-zinc-500'
                                                    }`}>
                                                    {entry.rank}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    {entry.userImage ? (
                                                        <img src={entry.userImage} alt="" className="w-10 h-10 rounded-full border-2 border-zinc-800" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
                                                            {entry.userName.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-white">{entry.userName}</p>
                                                        <p className="text-[10px] text-zinc-600 font-mono">{entry.contestCount} contests</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
                                                    style={{
                                                        borderColor: entry.tierColor + '40',
                                                        backgroundColor: entry.tierColor + '10'
                                                    }}
                                                >
                                                    <TierIcon size={12} style={{ color: entry.tierColor }} />
                                                    <span className="text-[10px] font-black uppercase" style={{ color: entry.tierColor }}>
                                                        {entry.tier}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <span className="font-black text-xl text-white">{entry.xp}</span>
                                                <span className="text-xs text-zinc-500 ml-1">XP</span>
                                            </td>
                                            <td className="px-6 py-5 text-right hidden sm:table-cell">
                                                <span className="text-zinc-400 font-mono">{entry.contestCount}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Stats Footer */}
                <div className="mt-8 flex justify-center gap-6 text-center">
                    <div className="px-6 py-4 rounded-xl bg-zinc-900/30 border border-zinc-800">
                        <p className="text-2xl font-black text-white">{leaderboard.length}</p>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">Top Coders</p>
                    </div>
                    <div className="px-6 py-4 rounded-xl bg-zinc-900/30 border border-zinc-800">
                        <p className="text-2xl font-black text-purple-500">
                            {leaderboard.reduce((acc, e) => acc + e.xp, 0)}
                        </p>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">Total XP</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
