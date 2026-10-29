"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  Terminal,
  Cpu,
  Zap,
  ArrowRight,
  ShieldCheck,
  Command,
  Layers,
  Sparkles,
  ChevronRight,
  Code2,
  Smartphone,
  Trophy,
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
  const showcaseRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.fromTo(
      ".hero-line",
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      }
    );

    gsap.fromTo(
      ".hero-visual",
      { opacity: 0, scale: 0.96, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        delay: 0.2,
        ease: "power3.out",
      }
    );

    if (featuresRef.current) {
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 24 },
        {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            once: true,
          },
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: "power2.out",
        }
      );
    }
  }, { scope: heroRef });

  return (
    <>
      <Navbar />
      <main ref={heroRef} className="min-h-screen bg-black text-foreground overflow-x-hidden relative">

        {/* ─── Hero Section ─────────────────────────────────────────── */}
        <section className="pt-32 pb-20 md:pt-44 md:pb-28 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-7">
              {/* Badge */}
              <div className="hero-line badge-pill inline-flex items-center gap-2.5 px-3.5 py-1.5 border-white/[0.15]">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-white/90 font-mono">A workspace for the long game</span>
                <span className="text-white/20">|</span>
                <span className="text-[#c9d0be] font-mono">Learn by building</span>
                <ChevronRight size={13} className="text-muted-foreground/60" />
              </div>

              {/* Main Headline */}
              <h1 className="hero-line max-w-2xl font-serif text-4xl font-normal leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl lg:text-[4.15rem]">
                Get better at the parts of code that{" "}
                <span className="text-[#c5ceb9]">take practice.</span>
              </h1>

              {/* Subtitle */}
              <p className="hero-line text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                A calm place to work through problems, try ideas in code, and see how far you&apos;ve come. Pick a challenge, open the editor, and start where you are.
              </p>

              {/* CTA Buttons */}
              <div className="hero-line flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => router.push("/welcome")}
                  className="btn-cyber cursor-pointer text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <span>Find your next challenge</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => router.push("/home")}
                  className="btn-secondary cursor-pointer text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Code2 size={16} className="text-violet-400" />
                  <span>Open the coding studio</span>
                </button>
              </div>

              {/* Trust Metrics */}
              <div className="hero-line pt-2 flex flex-wrap items-center gap-6 text-xs text-muted-foreground font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-emerald-400" />
                  <span>Practice with instant feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>11 languages to explore</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone size={14} className="text-violet-400" />
                  <span>Pick up on any screen</span>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase: Anime Coder Hero Artwork & Floating Matrix */}
            <div className="lg:col-span-6 hero-visual">
              <div className="relative group rounded-2xl overflow-hidden glass-card border border-white/[0.12] p-1.5">
                {/* Visual Image */}
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black">
                  <Image
                    src="/assets/anime_mobile_coder.jpg"
                    alt="Anime student solving coding rounds on mobile with floating holographic AI execution cards"
                    fill
                    priority
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Floating Top Hologram Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-black/90 border border-white/20 text-[11px] font-mono text-white">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Mobile Round · Active</span>
                  </div>

                  {/* Floating Right Pill */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/90 border border-white/20 text-[10px] font-mono text-white">
                    <Zap size={11} className="text-yellow-400" />
                    <span>15/15 Passed</span>
                  </div>

                  {/* Bottom Interactive Code Terminal Bar */}
                  <div className="absolute bottom-3 inset-x-3 p-3.5 rounded-xl bg-black/85 backdrop-blur-xl border border-white/[0.12] text-xs font-mono shadow-2xl">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pb-2 border-b border-white/[0.08] mb-2">
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <Terminal size={12} /> mobile_contest_eval.py
                      </span>
                      <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                        Groq LPU 18ms
                      </span>
                    </div>

                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span className="text-violet-400">def</span>
                      <span className="text-cyan-400">verify_contest_solution</span>(code, testcases):
                    </div>
                    <div className="pl-3 text-emerald-300 text-xs">
                      <TypingText
                        text={[
                          "return ai_simulate_execution(code)",
                          "optimize_time_complexity(O(N))",
                          "detect_hidden_edge_cases(testcases)",
                          "stream_instant_mentor_feedback()",
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Platform Capabilities Grid ────────────────────────────── */}
        <section ref={featuresRef} id="features" className="py-24 px-4 sm:px-6 border-t border-white/[0.06] relative">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[#b8c5a6] mb-3 font-mono text-xs uppercase tracking-wider">
                <Layers size={13} /> Made for learning by doing
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-frost mb-3">
                A little structure goes a long way.
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Practice, experiment, and learn from useful feedback—without turning every session into a race.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: Terminal,
                  title: "Simulated Execution",
                  desc: "Test custom inputs without waiting for heavy sandbox containers. AI predicts exact console output in sub-200ms.",
                  tag: "Try your own inputs",
                  border: "hover:border-white/30",
                  iconColor: "text-white",
                },
                {
                  icon: Cpu,
                  title: "Algorithmic Review",
                  desc: "Submissions receive instant asymptotic complexity analysis (O(N) time/space) and concrete edge-case diagnostics.",
                  tag: "Reason about tradeoffs",
                  border: "hover:border-white/30",
                  iconColor: "text-white",
                },
                {
                  icon: Zap,
                  title: "11-Language Playground",
                  desc: "Instant code review, auto-fix, and logic explanations across Python, Java, C++, JS, TS, Go, Rust, and more.",
                  tag: "Room to experiment",
                  border: "hover:border-white/30",
                  iconColor: "text-white",
                },
              ].map(({ icon: Icon, title, desc, tag, border, iconColor }) => (
                <div
                  key={title}
                  className={`feature-card glass-card p-6 flex flex-col justify-between group transition-all duration-300 ${border} hover:-translate-y-1`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-11 h-11 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-white/[0.2]">
                        <Icon size={20} className={iconColor} />
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-muted-foreground">
                        {tag}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-white transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Visual Feature Showcase (Anime & Real Workspace Assets) ─ */}
        <section ref={showcaseRef} className="py-24 px-4 sm:px-6 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14 text-center max-w-2xl mx-auto space-y-3">
              <div className="badge-pill inline-flex mx-auto border-violet-500/30 text-violet-300">
                <Sparkles size={12} className="text-violet-400" /> Feature Visual Tour
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-frost">
                The Platform in Action
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Take a look at the developer workspace designed for deep focus, crisp dark aesthetics, and zero distractions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Card 1: Anime Mobile Coder (Mobile & Desktop Round) */}
              <div className="group glass-card overflow-hidden hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                  <Image
                    src="/assets/anime_mobile_coder.jpg"
                    alt="Anime student solving coding interview round on mobile with floating holograms"
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/90 border border-white/20 text-white">
                    01 / Mobile Coding Rounds
                  </span>
                </div>
                <div className="p-6 bg-transparent">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">
                    Solve Coding Rounds Anywhere
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Practice core algorithmic rounds with instant AI execution feedback from your phone or laptop. Responsive editor layout with quick testcase passes (15/15).
                  </p>
                </div>
              </div>

              {/* Card 2: Anime Coding Contest (Tournaments & Peer Battles) */}
              <div className="group glass-card overflow-hidden hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                  <Image
                    src="/assets/anime_coding_contest.jpg"
                    alt="Futuristic competitive coding tournament and leaderboard"
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/90 border border-white/20 text-white">
                    02 / Competitive Battles
                  </span>
                </div>
                <div className="p-6 bg-transparent">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">
                    Live Tournament & Leaderboard
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Compete in live algorithmic contests, test against hidden edge cases, and climb global tiers from Knight to Grandmaster with verified attempt saves.
                  </p>
                </div>
              </div>

              {/* Card 3: 11-Language Playground & Anime Coder Hero */}
              <div className="group glass-card overflow-hidden hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                  <Image
                    src="/assets/anime_coder_hero.jpg"
                    alt="11 Language playground with AI code simulation and auto fix"
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/90 border border-white/20 text-white">
                    03 / 11-Language Studio
                  </span>
                </div>
                <div className="p-6 bg-transparent">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">
                    Multi-Language AI Code Studio
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Instant execution, auto-fix, and logic explanations across Python, Java, C++, TypeScript, Go, Rust, Ruby, PHP, and more.
                  </p>
                </div>
              </div>

              {/* Card 4: DSA Arena Curriculum */}
              <div className="group glass-card overflow-hidden hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                  <Image
                    src="/assets/DSA-arena.jpg"
                    alt="Real-world development challenges and algorithmic practice"
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/90 border border-white/20 text-white">
                    04 / Algorithmic Arena
                  </span>
                </div>
                <div className="p-6 bg-transparent">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">
                    Structured Topic Tracks
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Over 50 curated problem sets covering Arrays, DP, Trees, Graphs, and Greedy techniques with AI asymptotic complexity analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Bottom CTA ───────────────────────────────────────────── */}
        <section className="py-24 px-4 sm:px-6 border-t border-white/[0.06] relative bg-black">
          <div className="max-w-xl mx-auto text-center relative z-10 space-y-5">
            <div className="badge-pill inline-flex mx-auto border-white/20 text-white">
              <Trophy size={13} /> Join Thousands of Developers
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-white">
              Make a little progress today.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Choose a problem, make a small attempt, and leave with something new to think about.
            </p>
            <div className="pt-2">
              <button
                onClick={() => router.push("/welcome")}
                className="btn-cyber cursor-pointer px-8 h-12 text-sm font-semibold"
              >
                <span>Open your workspace</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* ─── Footer ──────────────────────────────────────────────── */}
        <footer className="py-12 px-4 sm:px-6 border-t border-white/[0.06] bg-black">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg border border-white/[0.1] bg-white/[0.03] flex items-center justify-center">
                <Command size={14} className="text-foreground" />
              </div>
              <span className="font-semibold text-foreground tracking-tight">CodeSaarthi</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] border border-white/[0.08]">v2</span>
            </div>
            <div className="flex gap-6">
              <Link href="/welcome" className="hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/home" className="hover:text-foreground transition-colors">Playground</Link>
              <Link href="/dsa" className="hover:text-foreground transition-colors">DSA Arena</Link>
              <Link href="/blogs" className="hover:text-foreground transition-colors">Blog</Link>
              <Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground/60">© 2026 CodeSaarthi · All rights reserved</p>
          </div>
        </footer>
      </main>
    </>
  );
}
