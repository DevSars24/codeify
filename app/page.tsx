"use client";

import { useRouter } from "next/navigation";
import { useUser, SignedIn } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white pt-28 px-6 overflow-hidden">
        {/* ================= HERO ================= */}
        <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="space-y-6">
            <h1 className="reveal reveal-1 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Code Saarthi
            </h1>

            <p className="reveal reveal-2 text-zinc-400 text-lg md:text-xl max-w-xl">
              Your AI-powered coding companion — learn, practice, and build
              projects directly from your browser.
            </p>

            <div className="reveal reveal-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
              <p className="text-zinc-300 text-base md:text-lg">
                Hi, I’m{" "}
                <span className="text-purple-400 font-semibold">
                  Saurabh Singh Rajput
                </span>
                , a sophomore at{" "}
                <span className="text-purple-400">IIIT Bhagalpur</span>.
              </p>

              <p className="text-zinc-400 leading-relaxed">
                Code Saarthi was built for students who struggle to code without
                laptops.
              </p>

              <ul className="text-zinc-400 text-sm md:text-base space-y-1 list-disc pl-5">
                <li>AI-assisted coding playground</li>
                <li>DSA pattern-based practice</li>
                <li>Web, App, Blockchain & AI tracks</li>
                <li>No heavy setup, works in browser</li>
              </ul>
            </div>

            <SignedIn>
              <Button
                size="lg"
                className="reveal reveal-4 mt-2 px-10 py-5 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg hover:shadow-purple-500/40 hover:scale-105"
                onClick={() => router.push("/welcome")}
              >
                Start Coding Playground →
              </Button>
            </SignedIn>
          </div>

          {/* RIGHT IMAGE */}
          <div className="reveal reveal-5 flex justify-center md:justify-end">
            <div className="relative group">
              <Image
                src="/assets/photo.png"   
                alt="Saurabh Singh Rajput"
                width={320}
                height={320}
                priority
                className="rounded-full border-4 border-zinc-800 shadow-2xl"
              />
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </section>

        <div className="reveal reveal-10">
          <HeroSection />
        </div>

        <footer className="reveal reveal-11 border-t border-zinc-800/50 mt-24 pt-10 pb-8 text-center text-zinc-500 text-sm">
          <p>Designed & Developed by Saurabh Singh Rajput · IIIT Bhagalpur</p>
          <p className="mt-1">
            Code Saarthi © 2025 — Learn, build & grow with AI
          </p>
        </footer>
      </div>
    </>
  );
}
