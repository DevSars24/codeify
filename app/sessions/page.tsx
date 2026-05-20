import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Radio, Calendar, Clock, Users, ArrowRight, Plus, Settings, Video } from "lucide-react";
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
                <span className="flex items-center gap-2 px-4 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold uppercase shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-ping absolute"></span>
                    <span className="w-2 h-2 bg-green-400 rounded-full relative"></span>
                    Live Now
                </span>
            );
        }
        return (
            <span className="px-4 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-bold uppercase">
                Upcoming
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[#0B0A1E] text-white selection:bg-purple-500/30 overflow-hidden relative">
            <Navbar />

            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

            <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 md:pt-40 pb-20 relative z-10">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-2 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                        <Radio size={16} className="text-purple-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Live Connect</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                        Live sessions are <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">waiting to enrich</span> your coding skills.
                    </h1>
                    
                    <p className="text-zinc-400 text-lg md:text-xl">
                        Join interactive live sessions with your instructor. Ask questions, learn in real-time, and level up your architecture.
                    </p>

                    {/* Admin Controls */}
                    {isAdmin && (
                        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                            <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-full px-8 py-6 shadow-xl shadow-purple-500/20 transition-all hover:scale-105">
                                <Link href="/admin/sessions/new">
                                    <Plus className="mr-2 w-5 h-5" /> Schedule New Session
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="bg-[#16133A]/60 border-white/10 text-white hover:bg-white/5 rounded-full px-8 py-6 backdrop-blur-xl">
                                <Link href="/admin/sessions">
                                    <Settings className="mr-2 w-5 h-5" /> Manage Broadcasts
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Sessions Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    {sessions.map((session: any) => (
                        <Link
                            key={session.id}
                            href={session.status === 'live' ? `/sessions/${session.id}/room` : `/sessions/${session.id}`}
                            className="group block h-full"
                        >
                            <article className="bg-[#16133A]/60 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(168,85,247,0.1)] flex flex-col h-full relative overflow-hidden">
                                
                                {/* Card Internal Glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] group-hover:bg-purple-500/20 transition-colors" />

                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                        <Video size={24} />
                                    </div>
                                    {getStatusBadge(session.status)}
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300 leading-tight">
                                    {session.title}
                                </h3>

                                {session.description && (
                                    <p className="text-zinc-400/80 text-sm mb-8 line-clamp-2 leading-relaxed">
                                        {session.description}
                                    </p>
                                )}

                                <div className="mt-auto space-y-4 mb-8">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
                                        <Calendar size={16} className="text-cyan-400" />
                                        <span className="text-xs font-bold text-zinc-300">{formatDate(session.scheduledAt)}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
                                            <Clock size={16} className="text-purple-400" />
                                            <span className="text-xs font-bold text-zinc-300">{session.duration}m</span>
                                        </div>
                                        <div className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
                                            <Users size={16} className="text-pink-400" />
                                            <span className="text-xs font-bold text-zinc-300">{session.maxParticipants} Max</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                    <div className="flex items-center gap-2 text-sm font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                                        {session.status === 'live' ? 'Join Broadcast' : 'View Details'}
                                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors ml-1">
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}

                    {sessions.length === 0 && (
                        <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-[32px] bg-[#16133A]/30 backdrop-blur-xl">
                            <Radio className="w-16 h-16 text-indigo-500/30 mx-auto mb-4" />
                            <p className="text-indigo-300 font-bold text-lg mb-2">No upcoming broadcasts.</p>
                            <p className="text-zinc-500 text-sm">Check back later for live sessions!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
