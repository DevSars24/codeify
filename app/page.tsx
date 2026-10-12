"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  Terminal, Cpu, Zap, Globe, ArrowRight, Lock, Users, Command, Layers, Sparkles, ChevronRight, ShieldCheck
} from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";
import TypingText from "@/components/TypingText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.fromTo(".hero-line", 
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.09,
        ease: "power2.out",
      }
    );

    gsap.fromTo(".hero-terminal", 
      { opacity: 0, x: 20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.55,
        delay: 0.2,
        ease: "power3.out",
      }
    );

    if (featuresRef.current) {
      gsap.fromTo(".feature-card",
        { opacity: 0, y: 18 },
        {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            once: true,
          },
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, { scope: heroRef });

  return (
    <>
      <Navbar />
      <main ref={heroRef} className="min-h-screen bg-ambient-mesh text-foreground overflow-x-hidden relative">
        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 inset-x-0 h-96 pointer-events-none overflow-hidden -z-10">
          <div className="absolute left-1/2 -top-40 -translate-x-1/2 w-[650px] h-[350px] bg-indigo-500/[0.07] blur-[120px] rounded-full" />
          <div className="absolute left-1/3 -top-20 w-[400px] h-[250px] bg-cyan-500/[0.04] blur-[100px] rounded-full" />
        </div>

        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-7">
              <div className="hero-line inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-medium text-muted-foreground shadow-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>CodeSaarthi Developer Arena v2</span>
                <ChevronRight size={13} className="text-muted-foreground/60" />
              </div>

              <h1 className="hero-line text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.08] text-frost">
                Practice, compete, and master code without noise.
              </h1>

              <p className="hero-line text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                A focused developer workspace for algorithmic mastery. Real-time AI simulation, edge-case evaluations, and deliberate practice directly in your browser.
              </p>

              <div className="hero-line flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => router.push("/welcome")}
                  className="btn-primary cursor-pointer text-sm font-semibold"
                >
                  Start practicing free <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => router.push("/dsa")}
                  className="btn-secondary cursor-pointer text-sm font-medium"
                >
                  Browse DSA Topics
                </button>
              </div>

              {/* Sub-hero trust metrics */}
              <div className="hero-line pt-4 flex items-center gap-6 text-xs text-muted-foreground/80 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500/80" />
                  <span>Sub-second AI feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span>4 Languages supported</span>
                </div>
              </div>
            </div>

            {/* Right Hero Terminal Mockup */}
            <div className="lg:col-span-5 hero-terminal">
              <div className="glass-card overflow-hidden shadow-2xl shadow-black/80 border border-white/[0.1]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30 border border-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-500/50" />
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">arena.stream.py</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-muted-foreground/70">
                    AI-assessed
                  </span>
                </div>

                <div className="p-5 font-mono text-xs leading-relaxed space-y-3.5 bg-black/40 min-h-[290px]">
                  <div className="text-muted-foreground/60">// Workspace initialized</div>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <span className="text-indigo-400">def</span>
                    <span className="text-emerald-400">solve_problem</span>(arr: List[int]) -&gt; int:
                  </div>
                  <div className="pl-4 text-muted-foreground">
                    <span className="text-purple-400">if</span> not arr: <span className="text-purple-400">return</span> -1
                  </div>
                  <div className="pl-4 text-muted-foreground">
                    <span className="text-cyan-400"># Linear scan with edge-case guard</span>
                  </div>
                  <div className="pl-4 text-emerald-300">
                    <TypingText
                      text={[
                        "return max_consecutive_ones(arr)",
                        "solve_with_two_pointers(arr)",
                        "check_boundary_conditions(arr)",
                        "ship_optimal_solution(arr)",
                      ]}
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-white/[0.06] text-[11px] text-emerald-400 flex items-center gap-2">
                    <Sparkles size={12} className="text-emerald-400 shrink-0" />
                    <span>AI Simulation: Output predicted in 18ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section ref={featuresRef} id="features" className="py-24 px-4 sm:px-6 border-t border-white/[0.06] relative">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-muted-foreground mb-3 font-mono text-xs uppercase tracking-wider">
                <Layers size={13} className="text-foreground" /> Platform Capabilities
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-frost mb-3">
                Engineered for deliberate practice
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Contests, complexity diagnostics, and mentor explanations built for developers who take their craft seriously.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: Terminal,
                  title: "Simulated Execution",
                  desc: "Test custom inputs without waiting for heavy sandbox containers. AI predicts exact console output in milliseconds.",
                  tag: "Low Latency",
                },
                {
                  icon: Cpu,
                  title: "Algorithmic Review",
                  desc: "Submissions receive instant asymptotic complexity analysis (O(N) time/space) and concrete edge-case diagnostics.",
                  tag: "Smart Review",
                },
                {
                  icon: Zap,
                  title: "Mission Logs & XP",
                  desc: "Track solved challenges, accuracy trends, and problem-solving history on your interactive developer dashboard.",
                  tag: "Analytics",
                },
              ].map(({ icon: Icon, title, desc, tag }) => (
                <div
                  key={title}
                  className="feature-card glass-card p-6 flex flex-col justify-between group hover:border-white/[0.2] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-xl border border-white/[0.1] bg-white/[0.03] flex items-center justify-center transition-colors group-hover:border-white/[0.25] group-hover:bg-white/[0.06]">
                        <Icon size={18} className="text-foreground" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-muted-foreground">
                        {tag}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base mb-2 text-foreground">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Showcase */}
        <section className="py-24 px-4 sm:px-6 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14 text-center max-w-2xl mx-auto space-y-3">
              <div className="badge-pill inline-flex mx-auto">
                <Sparkles size={12} className="text-foreground" /> Visual Tour
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-frost">
                The Interface in Action
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Take a look at the developer workspace designed for deep focus, crisp contrast, and zero distractions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="group glass-card overflow-hidden">
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/[0.06] bg-black/50">
                  <img
                    src="/work2.jpg"
                    alt="DSA Practice Arena"
                    className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                </div>
                <div className="p-6">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">01 / Practice</span>
                  <h3 className="text-lg font-semibold mt-1 mb-2">Interactive Coding Arena</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Solve core algorithmic problems with instant AI output simulation, complexity diagnostics, and integrated Monaco Editor.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group glass-card overflow-hidden">
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/[0.06] bg-black/50">
                  <img
                    src="/work3.jpg"
                    alt="Dev Challenges Lab"
                    className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                </div>
                <div className="p-6">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">02 / Development</span>
                  <h3 className="text-lg font-semibold mt-1 mb-2">Real-world Project Environments</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Build practical web and backend features evaluated against rigorous real-world architectural guidelines.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group glass-card overflow-hidden">
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/[0.06] bg-black/50">
                  <img
                    src="/work1.jpg"
                    alt="Mobile Coding Experience"
                    className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                </div>
                <div className="p-6">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">03 / Mobility</span>
                  <h3 className="text-lg font-semibold mt-1 mb-2">Mobile Responsive Workspace</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Review problem statements, inspect code, and read mentor explanations smoothly on mobile browsers.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="group glass-card overflow-hidden">
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/[0.06] bg-black/50">
                  <img
                    src="/work4.jpg"
                    alt="Analytics Dashboard & History"
                    className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                </div>
                <div className="p-6">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">04 / Growth</span>
                  <h3 className="text-lg font-semibold mt-1 mb-2">Mission Logs & Growth Metrics</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Track your solved problems, review past submissions, and climb the developer leaderboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 border-t border-white/[0.06] relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-40" />
          <div className="max-w-xl mx-auto text-center relative z-10 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-frost">
              Ready to elevate your code?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Step into the arena, test your solutions with AI guidance, and track your engineering progress.
            </p>
            <div className="pt-2">
              <button
                onClick={() => router.push("/welcome")}
                className="btn-primary cursor-pointer px-6"
              >
                Launch Workspace <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 border-t border-white/[0.06] bg-black/30">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md border border-white/[0.1] bg-white/[0.03] flex items-center justify-center">
                <Command size={12} className="text-foreground" />
              </div>
              <span className="font-semibold text-foreground">CodeSaarthi</span>
            </div>
            <div className="flex gap-6">
              <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link href="/blogs" className="hover:text-foreground transition-colors">Blog</Link>
              <Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link>
            </div>
            <p className="font-mono text-[11px]">© 2026 CodeSaarthi</p>
          </div>
        </footer>
      </main>
    </>
  );
}
