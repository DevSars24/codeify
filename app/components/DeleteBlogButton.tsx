"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteBlogButton({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this protocol?")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/blogs/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                router.push("/blogs");
                router.refresh();
            } else {
                alert("Failed to delete");
            }
        } catch (e) {
            alert("Error deleting");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1.5 rounded bg-red-900/30 text-red-400 text-xs font-bold uppercase hover:bg-red-900/50 flex items-center gap-2 transition-colors disabled:opacity-50"
        >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            Delete
        </button>
    );
}
