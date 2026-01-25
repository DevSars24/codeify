import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Calendar, Clock, Users, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import JoinSessionButton from "@/components/JoinSessionButton";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function SessionDetailPage({ params }: PageProps) {
    const { id } = await params;

    const session = await prisma.liveSession.findUnique({
        where: { id }
    });

    if (!session) return notFound();

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'full',
            timeStyle: 'short'
        }).format(new Date(date));
    };

    const isLive = session.status === 'live';
    const isEnded = session.status === 'ended';
    const scheduledTime = new Date(session.scheduledAt);
    const now = new Date();
    const isUpcoming = scheduledTime > now && !isLive;

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20">
                <Link href="/sessions" className="text-zinc-500 hover:text-white mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> All Sessions
                </Link>

                {/* Status Badge */}
                <div className="mb-6">
                    {isLive && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm font-bold uppercase">
                            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                            Live Now
                        </span>
                    )}
                    {isUpcoming && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-sm font-bold uppercase">
                            <Radio size={14} />
                            Upcoming
                        </span>
                    )}
                    {isEnded && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-500/20 text-zinc-400 border border-zinc-500/30 rounded-full text-sm font-bold uppercase">
                            Session Ended
                        </span>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                    {session.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-8 pb-8 border-b border-zinc-800">
                    <span className="flex items-center gap-2">
                        <Calendar size={16} className="text-purple-400" />
                        {formatDate(session.scheduledAt)}
                    </span>
                    <span className="flex items-center gap-2">
                        <Clock size={16} className="text-purple-400" />
                        {session.duration} minutes
                    </span>
                    <span className="flex items-center gap-2">
                        <Users size={16} className="text-purple-400" />
                        Max {session.maxParticipants} participants
                    </span>
                </div>

                {/* Description */}
                {session.description && (
                    <div className="mb-10">
                        <h2 className="text-lg font-bold mb-3 text-zinc-300">About this session</h2>
                        <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{session.description}</p>
                    </div>
                )}

                {/* Action */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-center">
                    {isLive && (
                        <>
                            <div className="flex items-center justify-center gap-2 text-green-400 mb-4">
                                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="font-bold uppercase tracking-wider text-sm">Session is live!</span>
                            </div>
                            <p className="text-zinc-400 mb-6">Join now to participate in the live session</p>
                            <JoinSessionButton sessionId={session.id} roomName={session.roomName} />
                        </>
                    )}

                    {isUpcoming && (
                        <>
                            <Radio className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Session Starting Soon</h3>
                            <p className="text-zinc-400 mb-4">Come back when the session goes live to join</p>
                            <p className="text-purple-400 font-mono text-sm">
                                {formatDate(session.scheduledAt)}
                            </p>
                        </>
                    )}

                    {isEnded && (
                        <>
                            <div className="text-zinc-600 mb-4">
                                <Radio className="w-12 h-12 mx-auto" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-zinc-400">Session Has Ended</h3>
                            <p className="text-zinc-500">This session is no longer available</p>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
