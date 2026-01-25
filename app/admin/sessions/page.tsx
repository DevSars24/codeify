import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Calendar, Clock, Users, Radio, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SessionStatusButton from "@/components/SessionStatusButton";
import DeleteSessionButton from "@/components/DeleteSessionButton";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

export default async function AdminSessionsPage() {
    const user = await currentUser();

    if (!user || user.emailAddresses[0]?.emailAddress !== ADMIN_EMAIL) {
        redirect("/");
    }

    const sessions = await prisma.liveSession.findMany({
        orderBy: { scheduledAt: 'desc' }
    });

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(new Date(date));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'live': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'ended': return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
            default: return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-purple-400 mb-2">
                            <Radio size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Admin Panel</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black">Live Sessions</h1>
                    </div>

                    <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full px-6">
                        <Link href="/admin/sessions/new">
                            <Plus className="mr-2 w-4 h-4" /> New Session
                        </Link>
                    </Button>
                </div>

                {/* Sessions List */}
                <div className="space-y-4">
                    {sessions.map((session) => (
                        <div key={session.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${getStatusColor(session.status)}`}>
                                            {session.status}
                                        </span>
                                        {session.status === 'live' && (
                                            <span className="flex items-center gap-1 text-green-400 text-xs animate-pulse">
                                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                                Live Now
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2">{session.title}</h3>

                                    {session.description && (
                                        <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{session.description}</p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {formatDate(session.scheduledAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {session.duration} mins
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users size={12} />
                                            Max {session.maxParticipants}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {session.status === 'scheduled' && (
                                        <SessionStatusButton sessionId={session.id} currentStatus={session.status} />
                                    )}
                                    {session.status === 'live' && (
                                        <>
                                            <Link href={`/sessions/${session.id}/room`}>
                                                <Button className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs">
                                                    <Play size={14} className="mr-1" /> Join Room
                                                </Button>
                                            </Link>
                                            <SessionStatusButton sessionId={session.id} currentStatus={session.status} />
                                        </>
                                    )}
                                    <DeleteSessionButton id={session.id} />
                                </div>
                            </div>
                        </div>
                    ))}

                    {sessions.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                            <Radio className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500 font-mono text-sm uppercase">No sessions scheduled yet</p>
                            <Link href="/admin/sessions/new" className="text-purple-400 hover:underline text-sm mt-2 inline-block">
                                Schedule your first session →
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
