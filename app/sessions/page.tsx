import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Radio, Calendar, Clock, Users, ArrowRight, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

export default async function SessionsPage() {
    const now = new Date();
    const user = await currentUser();
    const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL;

    const sessions = await prisma.liveSession.findMany({
        where: {
            OR: [
                { status: 'scheduled' },
                { status: 'live' }
            ]
        },
        orderBy: { scheduledAt: 'asc' }
    });

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(new Date(date));
    };

    const getStatusBadge = (status: string) => {
        if (status === 'live') {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold uppercase">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Live Now
                </span>
            );
        }
        return (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-bold uppercase">
                Upcoming
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 text-purple-400 mb-4">
                        <Radio size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest">Live Sessions</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4">
                        Join <span className="text-purple-400">Live</span> Sessions
                    </h1>
                    <p className="text-zinc-500 max-w-xl mx-auto mb-6">
                        Interactive live sessions with your instructor. Ask questions, learn in real-time, and level up your skills.
                    </p>

                    {/* Admin Controls */}
                    {isAdmin && (
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full px-6">
                                <Link href="/admin/sessions/new">
                                    <Plus className="mr-2 w-4 h-4" /> Create Session
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white rounded-full px-6">
                                <Link href="/admin/sessions">
                                    <Settings className="mr-2 w-4 h-4" /> Manage All
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>


                {/* Sessions Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {sessions.map((session) => (
                        <Link
                            key={session.id}
                            href={session.status === 'live' ? `/sessions/${session.id}/room` : `/sessions/${session.id}`}
                            className="group block"
                        >
                            <article className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 h-full">
                                <div className="flex items-start justify-between mb-4">
                                    {getStatusBadge(session.status)}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                    {session.title}
                                </h3>

                                {session.description && (
                                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{session.description}</p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 mb-6">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={12} />
                                        {formatDate(session.scheduledAt)}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={12} />
                                        {session.duration} mins
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Users size={12} />
                                        Max {session.maxParticipants}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                                    {session.status === 'live' ? 'Join Now' : 'View Details'}
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {sessions.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
                        <Radio className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500 font-mono text-sm uppercase mb-2">No upcoming sessions</p>
                        <p className="text-zinc-600 text-sm">Check back later for live sessions!</p>
                    </div>
                )}
            </main>
        </div>
    );
}
