"use client";

import { useRouter } from "next/navigation";
import { useUser, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard";
import { Code2, Cpu, Rocket, Terminal, Zap, Globe, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#000000] text-white overflow-hidden selection:bg-white/20">

        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
          {/* Subtle Spotlights - Deep Black Theme */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black opacity-50 pointer-events-none" />

          <div className="max-w-7xl mx-auto text-center relative z-10">

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs font-mono tracking-widest text-zinc-400 mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SYSTEM_ONLINE_V2.0
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-white animate-fade-in-up [animation-delay:200ms]">
              MASTER LOGIC. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 animate-gradient-x">
                BUILD THE FUTURE.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-fade-in-up [animation-delay:400ms]">
              The AI-native development environment. <br className="hidden md:block" />
              Zero setup. Infinite scalability. Pure code.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms]">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button size="lg" className="h-14 px-10 text-lg bg-white text-black hover:bg-zinc-200 font-bold transition-all hover:scale-105 rounded-full">
                    Start Coding
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-zinc-800 bg-black hover:bg-zinc-900 text-white font-medium transition-all rounded-full">
                    Explore
                  </Button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Button
                  size="lg"
                  onClick={() => router.push("/welcome")}
                  className="h-14 px-10 text-lg bg-white text-black hover:bg-zinc-200 font-bold shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:scale-105 rounded-full"
                >
                  Launch Terminal <Rocket className="w-5 h-5 ml-2" />
                </Button>
              </SignedIn>
            </div>
          </div>
        </section>


        {/* ================= FEATURES GRID ================= */}
        <section id="features" className="py-32 bg-black relative border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Terminal className="w-6 h-6" />}
                title="Instant Runtime"
                description="Zero latency environments. Boot containers in milliseconds."
              />
              <FeatureCard
                icon={<Cpu className="w-6 h-6" />}
                title="Neural Engine"
                description="Advanced AI pair programming that anticipates your next move."
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="Competitive Arena"
                description="Real-time algorithm battles with global leaderboards."
              />
              <FeatureCard
                icon={<Code2 className="w-6 h-6" />}
                title="Full Stack"
                description="Native support for Next.js, React, and Node.js workflows."
              />
              <FeatureCard
                icon={<Globe className="w-6 h-6" />}
                title="Global Network"
                description="Connect and compete with developers from 100+ countries."
              />
              <FeatureCard
                icon={<CheckCircle2 className="w-6 h-6" />}
                title="Detailed Telemetry"
                description="Granular insights into your coding patterns and growth."
              />
            </div>
          </div>
        </section>

        {/* ================= ABOUT SECTION ================= */}
        <section className="py-32 px-6 border-t border-zinc-900 bg-black">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-2xl blur-2xl group-hover:opacity-100 transition-opacity opacity-0" />
              <div className="relative grayscale hover:grayscale-0 transition-all duration-700">
                <Image
                  src="/assets/work.jpg"
                  alt="Saurabh Singh Rajput"
                  width={500}
                  height={500}
                  className="rounded-xl w-full object-cover border border-zinc-800"
                />
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                BUILT BY STUDENTS. <br />
                <span className="text-zinc-600">FOR THE FUTURE.</span>
              </h2>
              <div className="space-y-6 text-zinc-400 text-lg leading-relaxed font-light">
                <p>
                  <strong className="text-white font-semibold">Code Saarthi</strong> wasn't built in a boardroom.
                  It was built to solve a reality: talent is universal, but resources are not.
                </p>
                <p>
                  Whether you're coding from a library, a chromebook, or a flagship setup,
                  our mission is to give you the most powerful tools in the browser.
                </p>
              </div>

              <Link
                href="https://github.com/Devsars24"
                target="_blank"
                className="inline-flex items-center gap-2 text-white font-bold hover:text-purple-400 transition-colors border-b border-zinc-800 pb-1 hover:border-purple-400"
              >
                View Source Code <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="py-12 px-6 border-t border-zinc-900 bg-black text-center md:text-left">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight">CodeSaarthi</h3>
              <p className="text-zinc-600 text-xs uppercase tracking-widest">System_Online</p>
            </div>

            <div className="flex items-center gap-8 text-sm text-zinc-500 font-medium">
              <Link href="#" className="hover:text-white transition-colors">PRIVACY</Link>
              <Link href="#" className="hover:text-white transition-colors">TERMS</Link>
              <Link href="#" className="hover:text-white transition-colors">TWITTER</Link>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
