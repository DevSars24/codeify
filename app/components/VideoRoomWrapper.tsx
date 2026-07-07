"use client";

import dynamic from "next/dynamic";

const VideoRoom = dynamic(() => import("@/components/VideoRoom"), { ssr: false });

interface VideoRoomWrapperProps {
  roomName: string;
  sessionId: string;
  participantName: string;
}

export default function VideoRoomWrapper(props: VideoRoomWrapperProps) {
  return <VideoRoom {...props} />;
}
