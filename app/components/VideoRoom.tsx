"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
    ControlBar,
    useTracks,
    GridLayout,
    ParticipantTile,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface VideoRoomProps {
    roomName: string;
    sessionId: string;
    participantName: string;
}

export default function VideoRoom({ roomName, sessionId, participantName }: VideoRoomProps) {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    useEffect(() => {
        const getToken = async () => {
            try {
                const res = await fetch("/api/livekit/token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ roomName, participantName })
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to get token");
                }

                const data = await res.json();
                setToken(data.token);
            } catch (err: any) {
                console.error("Error getting token:", err);
                setError(err.message);
            }
        };

        getToken();
    }, [roomName, participantName]);

    const handleDisconnect = () => {
        router.push(`/sessions/${sessionId}`);
    };

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <div className="text-red-400 text-center mb-6">
                    <p className="text-xl font-bold mb-2">Connection Error</p>
                    <p className="text-zinc-400">{error}</p>
                </div>
                <Link href={`/sessions/${sessionId}`} className="text-purple-400 hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Session
                </Link>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <Loader2 className="animate-spin w-12 h-12 text-purple-500 mb-4" />
                <p className="text-zinc-400 font-mono text-sm uppercase tracking-wider">Connecting to session...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-black">
            <LiveKitRoom
                token={token}
                serverUrl={livekitUrl}
                connect={true}
                video={true}
                audio={true}
                onDisconnected={handleDisconnect}
                data-lk-theme="default"
                style={{ height: "100vh" }}
            >
                <VideoConference />
                <RoomAudioRenderer />
            </LiveKitRoom>
        </div>
    );
}
