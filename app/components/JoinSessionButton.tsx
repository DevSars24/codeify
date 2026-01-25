"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

interface JoinSessionButtonProps {
    sessionId: string;
    roomName: string;
}

export default function JoinSessionButton({ sessionId, roomName }: JoinSessionButtonProps) {
    const router = useRouter();

    const handleJoin = () => {
        router.push(`/sessions/${sessionId}/room`);
    };

    return (
        <Button
            onClick={handleJoin}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 text-base rounded-xl"
        >
            <Video className="mr-2 w-5 h-5" />
            Join Live Session
        </Button>
    );
}
