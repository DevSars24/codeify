"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionStatusButtonProps {
    sessionId: string;
    currentStatus: string;
}

export default function SessionStatusButton({ sessionId, currentStatus }: SessionStatusButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async () => {
        setLoading(true);
        const newStatus = currentStatus === 'scheduled' ? 'live' : 'ended';

        try {
            const res = await fetch(`/api/sessions/${sessionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error("Failed to update status");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to update session status");
        } finally {
            setLoading(false);
        }
    };

    if (currentStatus === 'scheduled') {
        return (
            <Button
                onClick={handleStatusChange}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs"
            >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <><Play size={14} className="mr-1" /> Go Live</>}
            </Button>
        );
    }

    if (currentStatus === 'live') {
        return (
            <Button
                onClick={handleStatusChange}
                disabled={loading}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 font-bold text-xs"
            >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <><Square size={14} className="mr-1" /> End Session</>}
            </Button>
        );
    }

    return null;
}
