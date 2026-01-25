import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import VideoRoom from "@/components/VideoRoom";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function RoomPage({ params }: PageProps) {
    const { id } = await params;

    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const session = await prisma.liveSession.findUnique({
        where: { id }
    });

    if (!session) return notFound();

    // Only allow joining if session is live
    if (session.status !== 'live') {
        redirect(`/sessions/${id}`);
    }

    const participantName = user.firstName || user.emailAddresses[0]?.emailAddress || "Participant";

    return (
        <VideoRoom
            roomName={session.roomName}
            sessionId={session.id}
            participantName={participantName}
        />
    );
}
