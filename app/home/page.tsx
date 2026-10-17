"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Home from "@/components/Home";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col">
      <Navbar />
      <div className="pt-18 flex-1 min-h-0 flex flex-col">
        {isLoaded && !isSignedIn && (
          <div className="bg-white/[0.04] backdrop-blur-md border-b border-white/[0.1] px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-white">Instant Playground Mode:</span>
              <span>You can pick any of the 11 languages and run AI simulations without logging in.</span>
            </div>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
            >
              <span>Sign up / Log in to save contests</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        )}
        <Home />
      </div>
    </div>
  );
}
