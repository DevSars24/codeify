"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewSessionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        scheduledAt: "",
        duration: 60,
        maxParticipants: 50
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to create session");

            router.push("/admin/sessions");
        } catch (error) {
            console.error(error);
            alert("Failed to create session");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-2xl mx-auto px-4 py-12">
                <Link href="/admin/sessions" className="text-zinc-500 hover:text-white mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back to Sessions
                </Link>

                <h1 className="text-3xl md:text-4xl font-black mb-2">Schedule New Session</h1>
                <p className="text-zinc-500 mb-8">Create a live session for students to join</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">
                            Session Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. DSA Masterclass - Arrays"
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="What will you cover in this session?"
                            rows={4}
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Date and Time */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">
                            <Calendar className="inline w-4 h-4 mr-2" />
                            Scheduled Date & Time *
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.scheduledAt}
                            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Duration & Max Participants */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                <Clock className="inline w-4 h-4 mr-2" />
                                Duration (mins)
                            </label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                min={15}
                                max={300}
                                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                <Users className="inline w-4 h-4 mr-2" />
                                Max Participants
                            </label>
                            <input
                                type="number"
                                value={formData.maxParticipants}
                                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                                min={5}
                                max={500}
                                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Schedule Session"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
