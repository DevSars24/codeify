import Navbar from "@/components/Navbar";
import { Trophy } from "lucide-react";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import LeaderboardList, { LeaderboardEntry } from "@/components/LeaderboardList";

export const revalidate = 60;
export const dynamic = "force-dynamic";

function getRatingTier(xp: number): { tier: string; color: string } {
  if (xp >= 2000) return { tier: "Grandmaster", color: "#ef4444" };
  if (xp >= 1500) return { tier: "Master", color: "#f97316" };
  if (xp >= 1000) return { tier: "Expert", color: "#a855f7" };
  if (xp >= 500) return { tier: "Candidate", color: "#3b82f6" };
  if (xp >= 200) return { tier: "Specialist", color: "#22c55e" };
  if (xp >= 50) return { tier: "Knight", color: "#06b6d4" };
  return { tier: "Novice", color: "#71717a" };
}

export default async function LeaderboardPage() {
  let leaderboard: LeaderboardEntry[] = [];

  try {
    const leaderboardData = await prisma.contestAttempt.groupBy({
      by: ["userId"],
      _sum: { correct: true },
      _count: { id: true },
      orderBy: { _sum: { correct: "desc" } },
      take: 10,
    });

    const clerk = await clerkClient();
    const userIds = leaderboardData.map((d) => d.userId);
    const userMap = new Map<string, { firstName?: string | null; username?: string | null; imageUrl?: string }>();

    if (userIds.length > 0) {
      try {
        const response = await clerk.users.getUserList({ userId: userIds });
        const users = Array.isArray(response) ? response : response?.data || [];
        users.forEach((u) => userMap.set(u.id, u));
      } catch (e) {
        console.error("Clerk batch fetch error:", e);
      }
    }

    leaderboard = leaderboardData.map((entry, index) => {
      const totalCorrect = entry._sum.correct || 0;
      const xp = totalCorrect * 10;
      const { tier, color } = getRatingTier(xp);
      const user = userMap.get(entry.userId);
      return {
        rank: index + 1,
        userId: entry.userId,
        userName: user ? user.firstName || user.username || "Anonymous" : "Unknown User",
        userImage: user?.imageUrl ?? null,
        xp,
        contestCount: entry._count.id,
        tier,
        tierColor: color,
      };
    });
  } catch (error) {
    console.error("Failed to query leaderboard:", error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 md:px-6 pt-28 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted border border-border text-xs font-medium text-muted-foreground mb-4">
            <Trophy size={14} className="text-primary" /> Global rankings
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Leaderboard</h1>
          <p className="text-muted-foreground">Top developers ranked by XP from contests.</p>
        </div>
        <LeaderboardList leaderboard={leaderboard} />
      </main>
    </div>
  );
}
