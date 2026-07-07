import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Radio, Calendar, Clock, Users, ArrowRight, Plus, Settings, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

export default async function SessionsPage() {
  const user = await currentUser();
  const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL;

  const sessions = await prisma.liveSession.findMany({
    where: { OR: [{ status: "scheduled" }, { status: "live" }] },
    orderBy: { scheduledAt: "asc" },
  });

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-28 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted border border-border text-xs font-medium text-muted-foreground mb-4">
            <Radio size={14} className="text-primary" /> Live sessions
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Join live coding sessions</h1>
          <p className="text-muted-foreground">Interactive sessions with instructors — ask questions in real time.</p>
          {isAdmin && (
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Button asChild size="sm"><Link href="/admin/sessions/new"><Plus className="mr-2 w-4 h-4" /> Schedule session</Link></Button>
              <Button asChild variant="outline" size="sm"><Link href="/admin/sessions"><Settings className="mr-2 w-4 h-4" /> Manage</Link></Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={session.status === "live" ? `/sessions/${session.id}/room` : `/sessions/${session.id}`}
              className="group surface-card p-6 hover:border-primary/30 transition-colors flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <Video size={18} className="text-primary" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${session.status === "live" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                  {session.status === "live" ? "Live" : "Upcoming"}
                </span>
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{session.title}</h3>
              {session.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{session.description}</p>}
              <div className="mt-auto space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Calendar size={14} /> {formatDate(session.scheduledAt)}</div>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><Clock size={14} /> {session.duration}m</span>
                  <span className="flex items-center gap-1"><Users size={14} /> {session.maxParticipants} max</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-primary mt-4 pt-4 border-t border-border">
                {session.status === "live" ? "Join now" : "View details"} <ArrowRight size={14} />
              </div>
            </Link>
          ))}
          {sessions.length === 0 && (
            <div className="col-span-full py-16 text-center surface-card border-dashed">
              <Radio className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">No upcoming sessions</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
