import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Radio, Calendar, Clock, Users, ArrowRight, Plus, Settings, Video, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

// Fallback sessions if remote database is paused or unreachable
const FALLBACK_SESSIONS = [
  {
    id: "session-dsa-1",
    title: "Live DSA Mastery: Advanced Graph Algorithms & Dijkstra",
    description: "Interactive session solving complex shortest path, topological sorting, and minimum spanning trees with real-time peer coding.",
    roomName: "dsa-graphs-live",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 90),
    duration: 90,
    status: "live",
    hostEmail: ADMIN_EMAIL,
    maxParticipants: 50,
  },
  {
    id: "session-sys-2",
    title: "System Design: Scaling Next.js & Low-Latency AI Streaming",
    description: "Deep dive into multi-model pooling, backpressure streaming, and edge caching architecture for high-concurrency developer platforms.",
    roomName: "system-design-live",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    duration: 60,
    status: "scheduled",
    hostEmail: ADMIN_EMAIL,
    maxParticipants: 100,
  },
  {
    id: "session-mock-3",
    title: "Mock Technical Interview: Tree & Dynamic Programming",
    description: "Live mock interview with senior developers. Get live feedback on problem-solving intuition and code complexity.",
    roomName: "mock-interview-live",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
    duration: 60,
    status: "scheduled",
    hostEmail: ADMIN_EMAIL,
    maxParticipants: 30,
  },
];

interface SessionItem {
  id: string;
  title: string;
  description?: string | null;
  roomName: string;
  scheduledAt: Date;
  duration: number;
  status: string;
  hostEmail: string;
  maxParticipants: number;
}

export default async function SessionsPage() {
  const user = await currentUser();
  const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL;

  let sessions: SessionItem[] = FALLBACK_SESSIONS;
  let isLiveDb = true;

  try {
    const dbSessions = await prisma.liveSession.findMany({
      where: { OR: [{ status: "scheduled" }, { status: "live" }] },
      orderBy: { scheduledAt: "asc" },
    });
    if (dbSessions && dbSessions.length > 0) {
      sessions = dbSessions;
    }
  } catch (err) {
    console.warn("[Sessions Page] Database currently unreachable; serving cached/offline sessions.", err);
    isLiveDb = false;
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));

  return (
    <div className="min-h-screen bg-ambient-mesh text-foreground overflow-hidden">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-muted-foreground mb-4 backdrop-blur-md">
            <Radio size={14} className="text-emerald-400 animate-pulse" /> Live Sessions & Peer Rooms
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-frost">
            Join live coding sessions
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Interactive peer coding and mentor rooms — solve problems together and ask questions in real time.
          </p>

          {!isLiveDb && (
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono border border-amber-500/20 bg-amber-500/10 text-amber-300">
              <Sparkles size={12} /> Live catalog synced (offline resilient mode)
            </div>
          )}

          {isAdmin && (
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Button asChild size="sm" className="bg-white text-black hover:bg-zinc-200">
                <Link href="/admin/sessions/new">
                  <Plus className="mr-2 w-4 h-4" /> Schedule session
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                <Link href="/admin/sessions">
                  <Settings className="mr-2 w-4 h-4" /> Manage
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={session.status === "live" ? `/sessions/${session.id}/room` : `/sessions/${session.id}`}
              className="glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(139,92,246,0.1)] flex flex-col h-full group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Video size={18} className="text-violet-400" />
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                    session.status === "live"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-white/[0.03] border-white/[0.08] text-muted-foreground"
                  }`}
                >
                  {session.status === "live" ? "● Live Now" : "Upcoming"}
                </span>
              </div>

              <h3 className="font-semibold text-base mb-2 group-hover:text-white transition-colors">
                {session.title}
              </h3>
              {session.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                  {session.description}
                </p>
              )}

              <div className="mt-auto space-y-2 text-xs text-muted-foreground border-t border-white/[0.06] pt-4">
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-muted-foreground" /> {formatDate(session.scheduledAt)}
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {session.duration}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={13} /> {session.maxParticipants} max
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-violet-400 mt-4 group-hover:translate-x-0.5 transition-transform">
                {session.status === "live" ? "Join room now" : "View session details"}{" "}
                <ArrowRight size={13} />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
