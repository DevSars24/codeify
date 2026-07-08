"use client";

import { Trophy, Medal, Crown, Zap, Users } from "lucide-react";
import Image from "next/image";
import AnimatedCounter from "@/components/AnimatedCounter";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userImage: string | null;
  xp: number;
  contestCount: number;
  tier: string;
  tierColor: string;
}

const tierIcons: Record<string, typeof Zap> = {
  Grandmaster: Crown, Master: Crown, Expert: Trophy,
  Candidate: Medal, Specialist: Medal, Knight: Zap, Novice: Zap,
};

export default function LeaderboardList({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
  const totalXp = leaderboard.reduce((acc, e) => acc + e.xp, 0);

  return (
    <>
      <div className="space-y-3">
        {leaderboard.length === 0 ? (
          <div className="py-16 text-center surface-card">
            <Users size={40} className="mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">No rankings yet</p>
            <p className="text-sm text-muted-foreground mt-1">Complete contests to appear here.</p>
          </div>
        ) : (
          leaderboard.map((entry) => {
            const TierIcon = tierIcons[entry.tier] || Zap;
            const isTop3 = entry.rank <= 3;

            return (
              <div
                key={entry.userId}
                className={`flex items-center justify-between p-4 md:p-5 rounded-md border transition-colors hover:border-foreground ${
                  isTop3 ? "bg-muted/50 border-border" : "surface-card"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center font-semibold text-sm shrink-0 ${
                    entry.rank <= 3 ? "bg-foreground text-background" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {entry.rank}
                  </div>
                  <div className="flex items-center gap-3">
                    {entry.userImage ? (
                      <Image src={entry.userImage} alt={entry.userName} width={44} height={44} className="rounded-full object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center font-medium text-sm">
                        {entry.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{entry.userName}</p>
                      <p className="text-xs text-muted-foreground">{entry.contestCount} contests</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded border border-border text-xs font-medium" style={{ color: entry.tierColor }}>
                    <TierIcon size={12} /> {entry.tier}
                  </div>
                  <div className="text-right">
                    <AnimatedCounter value={entry.xp} suffix=" XP" className="font-semibold text-lg tabular-nums" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {leaderboard.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="surface-card p-4 text-center">
            <p className="text-2xl font-semibold tabular-nums">{leaderboard.length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Ranked users</p>
          </div>
          <div className="surface-card p-4 text-center">
            <AnimatedCounter value={totalXp} className="text-2xl font-semibold tabular-nums text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Total XP</p>
          </div>
        </div>
      )}
    </>
  );
}
