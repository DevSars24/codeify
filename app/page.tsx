"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard";
import { Code2, Cpu, Rocket, Terminal, Zap, Globe, CheckCircle2, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin);
}

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Typing Animation
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        duration: 2.5,
        text: "MASTER LOGIC. BUILD THE FUTURE.",
        ease: "power2.inOut",
        delay: 0.2
      });
    }

    // GSAP 3D Orb Floating Animation
    if (orbRef.current) {
      gsap.to(orbRef.current, {
        y: -30,
        rotationX: 15,
        rotationY: -15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  return (
    <>
      <Navbar />

      {/* Main Container - Deep Dark Purple/Blue Theme */}
      <main className="min-h-screen bg-[#030014] text-white overflow-hidden selection:bg-purple-500/30">
        
        {/* Background Ambience */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
        </div>

        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Content */}
            <div className="text-left space-y-8 animate-fade-in-up">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest text-purple-300 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                SYSTEM_ONLINE_V2.0
              </div>

              {/* GSAP Typing Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.1] min-h-[140px] md:min-h-[180px] lg:min-h-[200px]">
                <span ref={titleRef} className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-purple-200">
                  {/* Empty initially, filled by GSAP */}
                </span>
                <span className="animate-pulse text-purple-500">_</span>
              </h1>

              <p className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed font-medium">
                The AI-native development environment. Zero setup. Infinite scalability. Pure code.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold transition-all hover:scale-105 rounded-full shadow-[0_0_40px_rgba(168,85,247,0.4)]">
                      Start Coding Now
                    </Button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-all rounded-full backdrop-blur-md">
                      Explore Platform
                    </Button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <Button
                    size="lg"
                    onClick={() => router.push("/welcome")}
                    className="w-full sm:w-auto h-14 px-8 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all hover:scale-105 rounded-full"
                  >
                    Launch Terminal <Rocket className="w-5 h-5 ml-2" />
                  </Button>
                </SignedIn>
              </div>

              {/* Stats/Social Proof (Matching Reference) */}
              <div className="pt-8 flex flex-wrap items-center gap-8 border-t border-white/10 mt-8">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#030014] bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold`} />
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-white">10K+ Active</p>
                    <p className="text-zinc-500">Developers</p>
                  </div>
                </div>
                
                <div className="h-10 w-[1px] bg-white/10 hidden sm:block" />
                
                <div className="text-sm">
                  <p className="font-bold text-white text-xl">4.9/5</p>
                  <p className="text-zinc-500 flex items-center gap-1">Community Rating</p>
                </div>
              </div>
            </div>

            {/* Right Column: 3D CSS Orb Model */}
            <div className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center [perspective:1000px]">
              <div ref={orbRef} className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] [transform-style:preserve-3d]">
                {/* Layer 1: Deep Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl opacity-50 animate-spin [animation-duration:15s]" />
                
                {/* Layer 2: Sharp Core */}
                <div className="absolute inset-4 bg-gradient-to-br from-cyan-400 via-purple-500 to-indigo-600 rounded-[50%_40%_30%_60%/60%_50%_40%_50%] opacity-80 mix-blend-screen animate-spin [animation-duration:10s] [animation-direction:reverse]" />
                
                {/* Layer 3: Surface Highlights */}
                <div className="absolute inset-8 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent_60%)] rounded-full mix-blend-overlay opacity-80" />
                
                {/* Layer 4: Floating Particles / Geometry lines (simulated) */}
                <div className="absolute inset-0 border border-white/20 rounded-full animate-ping [animation-duration:4s] opacity-20" />
                <div className="absolute inset-[-20px] border border-purple-500/30 rounded-full animate-spin [animation-duration:20s] border-dashed" />
              </div>
              
              {/* Play Button overlay mimicking the reference */}
              <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 glass-card p-4 rounded-2xl flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl z-20 hover:scale-105 transition-transform cursor-pointer">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                   <Play className="w-5 h-5 text-white fill-white ml-1" />
                 </div>
                 <div className="hidden sm:block">
                   <p className="text-sm font-bold text-white">Watch How It Works</p>
                   <p className="text-xs text-zinc-400">See the platform in action</p>
                 </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= TRUSTED BY LOGOS (From Reference) ================= */}
        <section className="py-10 border-t border-white/5 bg-white/[0.02]">
           <div className="max-w-7xl mx-auto px-6 flex justify-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center text-xl md:text-2xl font-black tracking-widest text-zinc-500">
                <span>GOOGLE</span>
                <span>TESLA</span>
                <span>AMAZON</span>
                <span>MICROSOFT</span>
                <span>META</span>
             </div>
           </div>
        </section>

        {/* ================= FEATURES GRID ================= */}
        <section id="features" className="py-32 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-6xl font-black mb-6">Unleash Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Potential</span></h2>
               <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Everything you need to build, test, and deploy faster than ever before.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Terminal className="w-6 h-6 text-blue-400" />}
                title="Instant Runtime"
                description="Zero latency environments. Boot containers in milliseconds."
              />
              <FeatureCard
                icon={<Cpu className="w-6 h-6 text-purple-400" />}
                title="Neural Engine"
                description="Advanced AI pair programming that anticipates your next move."
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6 text-pink-400" />}
                title="Competitive Arena"
                description="Real-time algorithm battles with global leaderboards."
              />
              <FeatureCard
                icon={<Code2 className="w-6 h-6 text-cyan-400" />}
                title="Full Stack"
                description="Native support for Next.js, React, and Node.js workflows."
              />
              <FeatureCard
                icon={<Globe className="w-6 h-6 text-emerald-400" />}
                title="Global Network"
                description="Connect and compete with developers from 100+ countries."
              />
              <FeatureCard
                icon={<CheckCircle2 className="w-6 h-6 text-indigo-400" />}
                title="Detailed Telemetry"
                description="Granular insights into your coding patterns and growth."
              />
            </div>
          </div>
        </section>

        {/* ================= ABOUT SECTION ================= */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/10" />
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md">
            <div className="relative group rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/40 to-blue-500/40 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500" />
              <Image
                src="/assets/work.jpg"
                alt="Saurabh Singh Rajput"
                width={600}
                height={600}
                className="w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                BUILT BY STUDENTS. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">FOR THE FUTURE.</span>
              </h2>
              <div className="space-y-6 text-zinc-300 text-lg leading-relaxed font-light">
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
                className="inline-flex items-center gap-2 text-white font-bold hover:text-purple-400 transition-colors bg-white/10 px-6 py-3 rounded-full hover:bg-white/20"
              >
                View Source Code <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="py-12 px-6 border-t border-white/10 bg-black/50 text-center md:text-left relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                 <span className="bg-gradient-to-r from-purple-500 to-blue-500 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white">CS</span>
                 <h3 className="text-lg font-bold text-white tracking-tight">CodeSaarthi</h3>
              </div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mt-2">System_Online_V2.0</p>
            </div>

            <div className="flex items-center gap-8 text-sm text-zinc-500 font-medium justify-center">
              <Link href="#" className="hover:text-purple-400 transition-colors">PRIVACY</Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">TERMS</Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">TWITTER</Link>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
