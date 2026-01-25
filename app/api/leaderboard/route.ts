import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

// Rating tiers based on total XP (correct answers * 10)
function getRatingTier(xp: number): { tier: string; color: string } {
    if (xp >= 2000) return { tier: "Grandmaster", color: "#ff0000" };
    if (xp >= 1500) return { tier: "Master", color: "#ff8c00" };
    if (xp >= 1000) return { tier: "Expert", color: "#a855f7" };
    if (xp >= 500) return { tier: "Candidate", color: "#3b82f6" };
    if (xp >= 200) return { tier: "Specialist", color: "#22c55e" };
    if (xp >= 50) return { tier: "Knight", color: "#06b6d4" };
    return { tier: "Novice", color: "#71717a" };
}

export async function GET() {
    try {
        // Aggregate scores by userId
        const leaderboardData = await prisma.contestAttempt.groupBy({
            by: ['userId'],
            _sum: {
                correct: true,
            },
            _count: {
                id: true,
            },
            orderBy: {
                _sum: {
                    correct: 'desc',
                },
            },
            take: 10, // Top 10
        });

        // Fetch user details from Clerk for each userId
        const clerk = await clerkClient();
        const leaderboard = await Promise.all(
            leaderboardData.map(async (entry, index) => {
                const totalCorrect = entry._sum.correct || 0;
                const xp = totalCorrect * 10;
                const { tier, color } = getRatingTier(xp);

                // Try to get user info from Clerk
                let userName = "Unknown User";
                let userImage = null;
                try {
                    const user = await clerk.users.getUser(entry.userId);
                    userName = user.firstName || user.username || "Anonymous";
                    userImage = user.imageUrl;
                } catch (e) {
                    // User might not exist or Clerk error
                }

                return {
                    rank: index + 1,
                    userId: entry.userId,
                    userName,
                    userImage,
                    xp,
                    contestCount: entry._count.id,
                    tier,
                    tierColor: color,
                };
            })
        );

        return NextResponse.json(leaderboard);
    } catch (error: any) {
        console.error("LEADERBOARD_ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
