import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { AccessToken } from "livekit-server-sdk";

export async function POST(request: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { roomName, participantName } = body;

        if (!roomName) {
            return NextResponse.json({ error: "Room name is required" }, { status: 400 });
        }

        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;

        if (!apiKey || !apiSecret) {
            return NextResponse.json({ error: "LiveKit not configured" }, { status: 500 });
        }

        // Create access token
        const at = new AccessToken(apiKey, apiSecret, {
            identity: user.id,
            name: participantName || user.firstName || "Participant",
        });

        // Grant permissions for the room
        at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
        });

        const token = await at.toJwt();

        return NextResponse.json({ token });
    } catch (error) {
        console.error("Error generating token:", error);
        return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
    }
}
