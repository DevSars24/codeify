"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteSessionButtonProps {
    id: string;
}

export default function DeleteSessionButton({ id }: DeleteSessionButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this session?")) return;

        setLoading(true);

        try {
            const res = await fetch(`/api/sessions/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Failed to delete");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to delete session");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleDelete}
            disabled={loading}
            variant="outline"
            className="border-zinc-700 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50"
            size="icon"
        >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 size={14} />}
        </Button>
    );
}
