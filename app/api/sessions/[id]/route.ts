import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET single session
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const session = await prisma.liveSession.findUnique({
            where: { id }
        });

        if (!session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        return NextResponse.json(session);
    } catch (error) {
        console.error("Error fetching session:", error);
        return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
    }
}

// PUT - Update session (admin only)
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const user = await currentUser();
        if (!user || user.emailAddresses[0]?.emailAddress !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const session = await prisma.liveSession.update({
            where: { id },
            data: body
        });

        return NextResponse.json(session);
    } catch (error) {
        console.error("Error updating session:", error);
        return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
    }
}

// DELETE - Delete session (admin only)
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const user = await currentUser();
        if (!user || user.emailAddresses[0]?.emailAddress !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await prisma.liveSession.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting session:", error);
        return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
    }
}
