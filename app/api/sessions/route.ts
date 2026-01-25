import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

// GET all sessions
export async function GET() {
    try {
        const sessions = await prisma.liveSession.findMany({
            orderBy: { scheduledAt: 'asc' }
        });

        return NextResponse.json(sessions);
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }
}

// POST - Create new session (admin only)
export async function POST(request: Request) {
    try {
        const user = await currentUser();
        if (!user || user.emailAddresses[0]?.emailAddress !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, scheduledAt, duration, maxParticipants } = body;

        if (!title || !scheduledAt) {
            return NextResponse.json({ error: "Title and scheduled time are required" }, { status: 400 });
        }

        // Generate unique room name
        const roomName = `cs-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        const session = await prisma.liveSession.create({
            data: {
                title,
                description: description || "",
                roomName,
                scheduledAt: new Date(scheduledAt),
                duration: duration || 60,
                maxParticipants: maxParticipants || 50,
                hostEmail: ADMIN_EMAIL,
                status: "scheduled"
            }
        });

        return NextResponse.json(session, { status: 201 });
    } catch (error) {
        console.error("Error creating session:", error);
        return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }
}
