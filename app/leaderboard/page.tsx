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
            <div className="min-h-screen bg-[#0B0A1E] text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-indigo-400 font-mono text-xs tracking-widest uppercase animate-pulse">Syncing Rankings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0A1E] text-white selection:bg-purple-500/30 overflow-hidden relative">
            <Navbar />

            {/* Ambient Glows */}
            <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

            <main className="max-w-5xl mx-auto px-4 md:px-6 pt-32 md:pt-40 pb-20 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                        <Trophy size={16} className="text-cyan-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Global Rankings</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">
                        Best coders are <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">waiting to enrich</span> your network.
                    </h1>
                    <p className="text-indigo-300/80 text-lg max-w-2xl mx-auto">
                        Top developers ranked by total XP earned from live contests and modules.
                    </p>
                </div>

                {/* Rating Tiers Legend */}
                <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    {[
                        { tier: "Grandmaster", color: "#ef4444", xp: "2000+" },
                        { tier: "Master", color: "#f97316", xp: "1500+" },
                        { tier: "Expert", color: "#a855f7", xp: "1000+" },
                        { tier: "Candidate", color: "#3b82f6", xp: "500+" },
                        { tier: "Specialist", color: "#22c55e", xp: "200+" },
                        { tier: "Knight", color: "#06b6d4", xp: "50+" },
                        { tier: "Novice", color: "#71717a", xp: "0+" },
                    ].map((t) => (
                        <div key={t.tier} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16133A]/60 backdrop-blur-md border border-white/5 shadow-lg">
                            <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: t.color, color: t.color }} />
                            <span className="text-[10px] font-bold uppercase" style={{ color: t.color }}>{t.tier}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">{t.xp} XP</span>
                        </div>
                    ))}
                </div>

                {/* Leaderboard List */}
                <div className="space-y-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    {leaderboard.length === 0 ? (
                        <div className="py-20 text-center bg-[#16133A]/40 rounded-[32px] border border-white/5 backdrop-blur-xl">
                            <Users size={48} className="mx-auto text-indigo-500/40 mb-4" />
                            <p className="text-indigo-300 font-bold text-lg">No rankings yet</p>
                            <p className="text-zinc-500 text-sm mt-2">Complete contests to appear here!</p>
                        </div>
                    ) : (
                        leaderboard.map((entry) => {
                            const TierIcon = tierIcons[entry.tier] || Zap;
                            
                            // Styling for Top 3
                            const isTop1 = entry.rank === 1;
                            const isTop2 = entry.rank === 2;
                            const isTop3 = entry.rank === 3;
                            
                            let rankBg = "bg-white/5 text-zinc-400";
                            let cardBorder = "border-white/5";
                            let cardBg = "bg-[#16133A]/60";
                            
                            if (isTop1) {
                                rankBg = "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)]";
                                cardBorder = "border-yellow-500/30";
                                cardBg = "bg-gradient-to-r from-yellow-500/10 to-[#16133A]/60";
                            } else if (isTop2) {
                                rankBg = "bg-zinc-300 text-black shadow-[0_0_20px_rgba(212,212,216,0.3)]";
                                cardBorder = "border-zinc-300/30";
                                cardBg = "bg-gradient-to-r from-zinc-300/10 to-[#16133A]/60";
                            } else if (isTop3) {
                                rankBg = "bg-orange-400 text-black shadow-[0_0_20px_rgba(251,146,60,0.3)]";
                                cardBorder = "border-orange-400/30";
                                cardBg = "bg-gradient-to-r from-orange-400/10 to-[#16133A]/60";
                            }

                            return (
                                <div 
                                    key={entry.userId} 
                                    className={`flex items-center justify-between p-4 md:p-6 rounded-[24px] ${cardBg} backdrop-blur-xl border ${cardBorder} hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] group`}
                                >
                                    <div className="flex items-center gap-4 md:gap-6">
                                        {/* Rank Badge */}
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-black text-lg md:text-xl shrink-0 transition-transform group-hover:scale-110 ${rankBg}`}>
                                            {entry.rank}
                                        </div>
                                        
                                        {/* User Info */}
                                        <div className="flex items-center gap-4">
                                            <div className="relative shrink-0">
                                                {entry.userImage ? (
                                                    <img src={entry.userImage} alt="" className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/10" />
                                                ) : (
                                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-indigo-900/50 border border-white/10 flex items-center justify-center text-indigo-300 font-bold text-xl">
                                                        {entry.userName.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                {(isTop1 || isTop2 || isTop3) && (
                                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                                        <Crown size={12} className={isTop1 ? "text-yellow-500" : isTop2 ? "text-zinc-300" : "text-orange-400"} />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <p className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors">{entry.userName}</p>
                                                <p className="text-xs text-indigo-300/60 font-mono mt-1 hidden sm:block">
                                                    {entry.contestCount} Code Missions Completed
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Right */}
                                    <div className="flex items-center gap-6 md:gap-12">
                                        {/* Tier Badge */}
                                        <div className="hidden md:flex flex-col items-end">
                                            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Current Tier</span>
                                            <div
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border shadow-inner"
                                                style={{ borderColor: entry.tierColor + '40' }}
                                            >
                                                <TierIcon size={14} style={{ color: entry.tierColor }} />
                                                <span className="text-xs font-black uppercase tracking-wider" style={{ color: entry.tierColor }}>
                                                    {entry.tier}
                                                </span>
                                            </div>
                                        </div>

                                        {/* XP Score */}
                                        <div className="text-right">
                                            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">Total XP</span>
                                            <div className="flex items-end gap-1">
                                                <span className="font-black text-2xl md:text-3xl text-white tracking-tighter">{entry.xp}</span>
                                                <span className="text-xs text-cyan-500 font-bold mb-1">XP</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Stats Footer */}
                {leaderboard.length > 0 && (
                    <div className="mt-12 flex justify-center gap-6 text-center">
                        <div className="px-8 py-6 rounded-[24px] bg-[#16133A]/40 border border-white/5 backdrop-blur-xl">
                            <p className="text-3xl font-black text-white mb-1">{leaderboard.length}</p>
                            <p className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest">Active Operatives</p>
                        </div>
                        <div className="px-8 py-6 rounded-[24px] bg-[#16133A]/40 border border-white/5 backdrop-blur-xl">
                            <p className="text-3xl font-black text-purple-400 mb-1">
                                {leaderboard.reduce((acc, e) => acc + e.xp, 0).toLocaleString()}
                            </p>
                            <p className="text-[10px] text-purple-400 uppercase font-bold tracking-widest">Global XP Pool</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
