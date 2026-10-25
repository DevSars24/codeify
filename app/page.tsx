"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
  Play,
  CheckCircle2,
  Timer,
  GitBranch,
  Gauge,
  Flame,
  Award,
  Binary,
  Activity,
  Check,
} from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";
import TypingText from "@/components/TypingText";
import PlaygroundPreviewSection from "@/components/PlaygroundPreviewSection";
import MeetDeveloperSection from "@/components/MeetDeveloperSection";
import PricingSection from "@/components/PricingSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroCodeSnippet {
  lang: string;
  filename: string;
  code: string;
  complexity: string;
  latency: string;
  memory: string;
}

const HERO_SNIPPETS: Record<string, HeroCodeSnippet> = {
  python: {
    lang: "Python",
    filename: "solution.py",
    code: `def two_sum(nums: list[int], target: int) -> list[int]:
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []

# Groq LPU Instant Asymptotic Simulation
assert two_sum([2, 7, 11, 15], 9) == [0, 1]`,
    complexity: "O(N) Time · O(N) Space",
    latency: "18ms",
    memory: "12.4 MB",
  },
  typescript: {
    lang: "TypeScript",
    filename: "solution.ts",
    code: `function maxSubArray(nums: number[]): number {
  let curSum = 0, maxSum = nums[0];
  for (const n of nums) {
    curSum = Math.max(n, curSum + n);
    maxSum = Math.max(maxSum, curSum);
  }
  return maxSum;
}

// Sub-200ms AST Simulation Verified
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6`,
    complexity: "O(N) Time · O(1) Space",
    latency: "22ms",
    memory: "18.1 MB",
  },
  rust: {
    lang: "Rust",
    filename: "solution.rs",
    code: `pub fn longest_consecutive(nums: Vec<i32>) -> i32 {
    use std::collections::HashSet;
    let set: HashSet<i32> = nums.into_iter().collect();
    let mut longest = 0;
    for &num in &set {
        if !set.contains(&(num - 1)) {
            let mut cur = num;
            while set.contains(&(cur + 1)) { cur += 1; }
            longest = longest.max(cur - num + 1);
        }
    }
    longest
}`,
    complexity: "O(N) Time · O(N) Space",
    latency: "14ms",
    memory: "8.2 MB",
  },
  cpp: {
    lang: "C++",
    filename: "solution.cpp",
    code: `#include <vector>
#include <algorithm>

int trapRainWater(std::vector<int>& height) {
    int l = 0, r = height.size() - 1, l_max = 0, r_max = 0, res = 0;
    while (l < r) {
        if (height[l] < height[r]) {
            height[l] >= l_max ? l_max = height[l] : res += l_max - height[l];
            l++;
        } else {
            height[r] >= r_max ? r_max = height[r] : res += r_max - height[r];
            r--;
        }
    }
    return res;
}`,
    complexity: "O(N) Time · O(1) Space",
    latency: "12ms",
    memory: "6.9 MB",
  },
  go: {
    lang: "Go",
    filename: "solution.go",
    code: `package main

func mergeIntervals(intervals [][]int) [][]int {
    // Sort intervals by start time
    // Groq AI evaluates slice bounds & pointers
    var merged [][]int
    for _, interval := range intervals {
        if len(merged) == 0 || merged[len(merged)-1][1] < interval[0] {
            merged = append(merged, interval)
        } else if interval[1] > merged[len(merged)-1][1] {
            merged[len(merged)-1][1] = interval[1]
        }
    }
    return merged
}`,
    complexity: "O(N log N) Time · O(N) Space",
    latency: "16ms",
    memory: "9.8 MB",
  },
};

export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLElement>(null);

  const [activeTab, setActiveTab] = useState<string>("python");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(true);

  const snippet = HERO_SNIPPETS[activeTab] || HERO_SNIPPETS.python;

  const handleSimulateRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 450);
  };

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
      ".hero-workbench",
      { opacity: 0, scale: 0.96, y: 24 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
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
      <main
        ref={heroRef}
        className="min-h-screen bg-natural-dark text-foreground overflow-x-hidden relative selection:bg-emerald-500/20 selection:text-emerald-300"
      >
        {/* Subtle Ambient Dot-Grid Mask */}
        <div
          className="absolute inset-0 bg-dot-grid opacity-35 pointer-events-none"
          style={{
            maskImage: "radial-gradient(ellipse 70% 50% at 50% 20%, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 20%, black 30%, transparent 80%)",
          }}
        />

        {/* ─── Hero Section ─────────────────────────────────────────── */}
        <section className="pt-32 pb-20 md:pt-44 md:pb-28 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-7">
              {/* Badge with Specular Edge Light */}
              <div className="hero-line badge-luminous inline-flex items-center gap-2.5 px-3.5 py-1.5 border-white/[0.16] shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </span>
                <span className="text-white font-mono font-medium">CodeSaarthi v2</span>
                <span className="text-white/25">|</span>
                <span className="text-emerald-300 font-mono">Multi-Model Groq LPU</span>
                <ChevronRight size={13} className="text-zinc-400" />
              </div>

              {/* Main Headline */}
              <h1 className="hero-line text-4xl sm:text-5xl lg:text-[3.6rem] font-bold tracking-tight leading-[1.08] text-white">
                Practice, compete, and{" "}
                <span className="gradient-text-cyber underline decoration-emerald-500/40 underline-offset-8">
                  master code
                </span>{" "}
                without noise.
              </h1>

              {/* Subtitle */}
              <p className="hero-line text-base sm:text-lg text-zinc-300/90 max-w-xl leading-relaxed font-normal">
                An ultra-fast developer arena built for deep algorithmic flow. Real-time sub-200ms AI code simulation across 11 languages, mobile-optimized practice rounds, and live tournament leaderboards.
              </p>

              {/* Luminous Call-to-Action Buttons */}
              <div className="hero-line flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => router.push("/welcome")}
                  className="btn-luminous-primary cursor-pointer text-sm font-semibold flex items-center justify-center gap-2.5 group"
                >
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-950 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-900" />
                  </span>
                  <span>Start Practicing Free</span>
                  <ArrowRight size={16} className="text-emerald-950 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => router.push("/home")}
                  className="btn-luminous-glass group cursor-pointer text-sm font-medium flex items-center justify-center gap-2.5"
                >
                  <Code2 size={16} className="text-violet-400 group-hover:scale-110 transition-transform" />
                  <span>11-Language Playground</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Free · No Login
                  </span>
                </button>
              </div>

              {/* Trust Metrics */}
              <div className="hero-line pt-2 flex flex-wrap items-center gap-6 text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-emerald-400" />
                  <span>Sub-200ms AI simulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                  <span>11 Languages supported</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone size={14} className="text-violet-400" />
                  <span>Mobile & Desktop ready</span>
                </div>
              </div>
            </div>

            {/* Right Hero: Real Interactive Glassmorphic Developer Workbench */}
            <div className="lg:col-span-6 hero-workbench">
              <div className="relative group rounded-2xl glass-card-glow border border-white/[0.14] overflow-hidden shadow-[0_0_60px_-15px_rgba(99,102,241,0.2)]">
                
                {/* Window Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-black/40 backdrop-blur-md">
                  {/* Traffic Light Buttons */}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/90 shadow-[0_0_6px_rgba(239,68,68,0.4)]" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500/90 shadow-[0_0_6px_rgba(234,179,8,0.4)]" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-500/90 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
                    <span className="ml-2 text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                      <Terminal size={12} className="text-violet-400" />
                      {snippet.filename}
                    </span>
                  </div>

                  {/* LPU Status Pill */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                      <Zap size={10} className="text-yellow-400" />
                      <span>Groq LPU {snippet.latency}</span>
                    </span>
                  </div>
                </div>

                {/* Language Switcher Tabs inside Workbench */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.06] bg-white/[0.02] overflow-x-auto scrollbar-none">
                  {Object.keys(HERO_SNIPPETS).map((key) => {
                    const item = HERO_SNIPPETS[key];
                    const isActive = activeTab === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-white/15 text-white border border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.1)]"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                        }`}
                      >
                        {item.lang}
                      </button>
                    );
                  })}
                </div>

                {/* Editor Code Canvas */}
                <div className="p-4 bg-black/60 font-mono text-xs overflow-x-auto">
                  <pre className="text-zinc-200 leading-relaxed">
                    <code>
                      {snippet.code.split("\n").map((line, idx) => (
                        <div key={idx} className="table-row">
                          <span className="table-cell pr-4 select-none text-zinc-600 text-[11px] text-right">
                            {idx + 1}
                          </span>
                          <span className="table-cell whitespace-pre">
                            {line.startsWith("#") || line.startsWith("//") ? (
                              <span className="text-zinc-500 italic">{line}</span>
                            ) : line.includes("def ") || line.includes("function ") || line.includes("pub fn ") ? (
                              <span className="text-violet-300 font-semibold">{line}</span>
                            ) : line.includes("return") || line.includes("assert") ? (
                              <span className="text-cyan-300">{line}</span>
                            ) : (
                              <span>{line}</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>

                {/* Interactive Simulated Execution Console Bar */}
                <div className="p-3.5 border-t border-white/[0.08] bg-black/80 backdrop-blur-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSimulateRun}
                        disabled={isRunning}
                        className="btn-luminous-primary h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Play size={12} className={isRunning ? "animate-spin" : "fill-current"} />
                        <span>{isRunning ? "Simulating..." : "Run Simulation"}</span>
                      </button>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {isRunning ? "Executing on Groq LPUs..." : "Sub-200ms Instant Sandbox"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        ✓ 15/15 Passed
                      </span>
                      <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        {snippet.complexity}
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Result Drawer */}
                  {hasRun && (
                    <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
                      <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-center">
                        <span className="text-zinc-500 block text-[9px]">LPU LATENCY</span>
                        <span className="text-emerald-300 font-semibold">{snippet.latency}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-center">
                        <span className="text-zinc-500 block text-[9px]">PEAK MEMORY</span>
                        <span className="text-cyan-300 font-semibold">{snippet.memory}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-center">
                        <span className="text-zinc-500 block text-[9px]">AST REVIEW</span>
                        <span className="text-violet-300 font-semibold">Optimal O(N)</span>
                      </div>
                    </div>
                  )}

                  {/* Mentor Feedback Bar */}
                  <div className="pt-1 flex items-center gap-2 text-xs font-mono text-zinc-300">
                    <Sparkles size={13} className="text-emerald-400 shrink-0" />
                    <span className="text-zinc-500">Mentor:</span>
                    <div className="text-emerald-300 text-[11px] truncate">
                      <TypingText
                        text={[
                          "Zero auxiliary allocations detected. Benchmark optimal.",
                          "Complexity bounds match standard LC 1 hard constraint.",
                          "Safe pointer boundary check verified without panic.",
                        ]}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ─── Pinned 11-Language Playground (No Signup Needed) ─────── */}
        <PlaygroundPreviewSection />

        {/* ─── Platform Capabilities Grid ────────────────────────────── */}
        <section ref={featuresRef} id="features" className="py-24 px-4 sm:px-6 border-t border-white/[0.08] relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-violet-400 mb-3 font-mono text-xs uppercase tracking-wider">
                <Layers size={13} /> Platform Capabilities
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
                Engineered for deliberate practice
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Contests, complexity diagnostics, and mentor explanations built for developers who take their craft seriously.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: Terminal,
                  title: "Simulated Execution",
                  desc: "Test custom inputs without waiting for heavy sandbox containers. AI predicts exact console output in sub-200ms.",
                  tag: "Groq Powered",
                  iconColor: "text-emerald-400",
                  stat: "18ms Latency",
                },
                {
                  icon: Cpu,
                  title: "Algorithmic Review",
                  desc: "Submissions receive instant asymptotic complexity analysis (O(N) time/space) and concrete edge-case diagnostics.",
                  tag: "Smart Review",
                  iconColor: "text-violet-400",
                  stat: "AST Analysis",
                },
                {
                  icon: Zap,
                  title: "11-Language Playground",
                  desc: "Instant code review, auto-fix, and logic explanations across Python, Java, C++, JS, TS, Go, Rust, and more.",
                  tag: "11 Runtimes",
                  iconColor: "text-cyan-400",
                  stat: "Zero Setup",
                },
              ].map(({ icon: Icon, title, desc, tag, iconColor, stat }) => (
                <div
                  key={title}
                  className="feature-card glass-card p-6 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:border-white/25"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-11 h-11 rounded-xl border border-white/[0.1] bg-white/[0.04] flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-white/[0.25] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]">
                        <Icon size={20} className={iconColor} />
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-white/[0.1] bg-white/[0.03] text-zinc-300">
                        {tag}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-emerald-300 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>Performance tier:</span>
                    <span className="text-white font-medium">{stat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Handcrafted Bespoke Feature Showcase (Real Developer Workbenches) ─ */}
        <section ref={showcaseRef} className="py-24 px-4 sm:px-6 border-t border-white/[0.08] relative z-10">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="badge-luminous inline-flex mx-auto border-violet-500/30 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <Sparkles size={12} className="text-violet-400" /> Platform Architecture Tour
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Built for Elite Problem Solvers
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Take a look at the developer workspace designed for deep focus, rich obsidian dark aesthetics, and zero distractions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-7">
              
              {/* Showcase Card 1: Sub-200ms Execution Pipeline */}
              <div className="glass-card-glow p-6 sm:p-7 flex flex-col justify-between group hover:border-emerald-500/40 transition-all duration-300">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                      01 / REAL-TIME SIMULATION
                    </span>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                      <Zap size={12} className="text-yellow-400" /> 130x Faster than Docker
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                      Sub-200ms Simulated Execution
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Instead of spinning up 2-second Linux containers, our fine-tuned Groq LPU engine compiles and evaluates your logic in memory, streaming verified test output in milliseconds.
                    </p>
                  </div>

                  {/* Interactive Visual AST Diagram */}
                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[11px] text-zinc-400">
                      <span>EXECUTION PIPELINE</span>
                      <span className="text-emerald-400">STATUS: ZERO LATENCY</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="p-2 rounded bg-white/[0.03] border border-white/[0.08]">
                        <span className="text-zinc-500 block">PARSER</span>
                        <span className="text-white">Tree-sitter AST</span>
                      </div>
                      <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                        <span className="text-emerald-400/70 block">SIMULATOR</span>
                        <span>Groq LPUs (18ms)</span>
                      </div>
                      <div className="p-2 rounded bg-white/[0.03] border border-white/[0.08]">
                        <span className="text-zinc-500 block">TESTS</span>
                        <span className="text-white">15/15 Passed</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-black/80 text-[11px] text-emerald-300 flex items-center justify-between border border-emerald-500/20">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        All hidden edge-case assertions validated.
                      </span>
                      <span className="text-[10px] text-zinc-400">0.018s</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href="/home"
                    className="btn-luminous-glass w-full text-xs font-semibold flex items-center justify-center gap-2 group-hover:border-emerald-500/40"
                  >
                    <span>Test Instant Execution</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Showcase Card 2: Asymptotic Complexity Engine */}
              <div className="glass-card-glow p-6 sm:p-7 flex flex-col justify-between group hover:border-violet-500/40 transition-all duration-300">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/25">
                      02 / ASYMPTOTIC DIAGNOSTICS
                    </span>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                      <Gauge size={12} className="text-violet-400" /> Big-O Profiler
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                      Deep Asymptotic Review
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Beyond simple test pass/fail checks, understand whether your algorithm scales. Automatic asymptotic complexity analysis gives precise Big-O guarantees and hints on sub-optimal loops.
                    </p>
                  </div>

                  {/* Visual Big-O Scale */}
                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[11px] text-zinc-400">
                      <span>TIME COMPLEXITY SPECTRUM</span>
                      <span className="text-violet-300">O(N) DETECTED</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px]">
                      <div className="flex-1 p-1.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center">
                        O(1)
                      </div>
                      <div className="flex-1 p-1.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center">
                        O(log N)
                      </div>
                      <div className="flex-1 p-1.5 rounded bg-violet-500/30 border border-violet-400 text-white font-bold text-center shadow-[0_0_10px_rgba(167,139,250,0.3)]">
                        O(N) ★
                      </div>
                      <div className="flex-1 p-1.5 rounded bg-white/[0.03] border border-white/[0.08] text-zinc-500 text-center">
                        O(N log N)
                      </div>
                      <div className="flex-1 p-1.5 rounded bg-white/[0.03] border border-white/[0.08] text-zinc-600 text-center">
                        O(N²)
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-white/[0.02] text-[11px] text-zinc-300 flex items-center justify-between border border-white/[0.08]">
                      <span>Space: O(1) Auxiliary heap</span>
                      <span className="text-emerald-400 font-semibold">Optimal</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href="/dsa"
                    className="btn-luminous-glass w-full text-xs font-semibold flex items-center justify-center gap-2 group-hover:border-violet-500/40"
                  >
                    <span>Explore DSA Arena</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Showcase Card 3: Live Tournament Leaderboards */}
              <div className="glass-card-glow p-6 sm:p-7 flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                      03 / COMPETITIVE BATTLES
                    </span>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                      <Trophy size={12} className="text-yellow-400" /> Global Rankings
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      Live Tournament Arena
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Battle against peers in timed algorithmic rounds. Test against randomized hidden stress cases and climb global tiers from Knight to Grandmaster with verified telemetry.
                    </p>
                  </div>

                  {/* Leaderboard Mockup Card */}
                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[11px] text-zinc-400">
                      <span>WEEKLY ARENA #42</span>
                      <span className="text-cyan-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> LIVE
                      </span>
                    </div>

                    {[
                      { rank: "#1", name: "Saurabh (Maintainer)", score: "2,840 pts", time: "04:12", tier: "Grandmaster", color: "text-yellow-400" },
                      { rank: "#2", name: "Elena_K", score: "2,710 pts", time: "05:40", tier: "Master", color: "text-violet-300" },
                      { rank: "#3", name: "Alex_Code", score: "2,590 pts", time: "06:15", tier: "Knight", color: "text-cyan-300" },
                    ].map((user) => (
                      <div key={user.name} className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.06] text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${user.color}`}>{user.rank}</span>
                          <span className="text-white font-medium">{user.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-400">{user.tier}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-400 font-semibold">{user.score}</span>
                          <span className="text-zinc-500 text-[10px]">{user.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href="/leaderboard"
                    className="btn-luminous-glass w-full text-xs font-semibold flex items-center justify-center gap-2 group-hover:border-cyan-500/40"
                  >
                    <span>View Global Leaderboard</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Showcase Card 4: Mobile & Desktop Algorithmic Studio */}
              <div className="glass-card-glow p-6 sm:p-7 flex flex-col justify-between group hover:border-white/35 transition-all duration-300">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/[0.08] text-white border border-white/20">
                      04 / DUAL-DEVICE WORKSPACE
                    </span>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                      <Smartphone size={12} className="text-emerald-400" /> Touch Optimized
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                      Mobile & Desktop Algorithmic Flow
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Practice coding rounds anywhere. Custom mobile code keyboard ribbons, fast gesture bracket injection, and instant test evaluation tailored for on-the-go practice.
                    </p>
                  </div>

                  {/* Mobile Preview UI Mockup */}
                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[11px] text-zinc-400">
                      <span>MOBILE QUICK-ACTION BAR</span>
                      <span className="text-emerald-400">TOUCH READY</span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
                      {["tab", "( )", "{ }", "[ ]", "=>", ":", ";", "=="].map((symbol) => (
                        <div key={symbol} className="px-2.5 py-1 rounded bg-white/[0.05] border border-white/[0.1] text-zinc-300 hover:text-white hover:bg-white/10 transition-colors">
                          {symbol}
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-[11px] text-emerald-300">
                      <span className="flex items-center gap-1.5">
                        <Check size={13} className="text-emerald-400" />
                        Synced to cloud profile.
                      </span>
                      <span className="text-[10px] text-zinc-400">Auto-saved</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href="/welcome"
                    className="btn-luminous-glass w-full text-xs font-semibold flex items-center justify-center gap-2 group-hover:border-white/35"
                  >
                    <span>Launch Mobile Workspace</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── Explore Paid Services & Future Planning ───────────────── */}
        <PricingSection />

        {/* ─── Meet the Developer Behind CodeSaarthi ─────────────────── */}
        <MeetDeveloperSection />

        {/* ─── Bottom CTA with Luminous Halo ────────────────────────── */}
        <section className="py-28 px-4 sm:px-6 border-t border-white/[0.08] relative bg-natural-dark overflow-hidden z-10">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"
          />

          <div className="max-w-xl mx-auto text-center relative z-10 space-y-6">
            <div className="badge-luminous inline-flex mx-auto border-emerald-500/30 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Trophy size={13} /> Join Thousands of Developers
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Ready to elevate your code?
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Step into the arena, solve challenges across 11 languages, and track your engineering progress on your personal dashboard.
            </p>
            <div className="pt-3">
              <button
                onClick={() => router.push("/welcome")}
                className="btn-luminous-primary cursor-pointer px-9 h-13 text-sm font-semibold flex items-center justify-center gap-2.5 mx-auto"
              >
                <span>Launch Developer Workspace</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* ─── Footer ──────────────────────────────────────────────── */}
        <footer className="py-12 px-4 sm:px-6 border-t border-white/[0.08] bg-black/60 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg border border-white/[0.12] bg-white/[0.04] flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.06)]">
                <Command size={14} className="text-white" />
              </div>
              <span className="font-semibold text-white tracking-tight">CodeSaarthi</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-400">
                v2
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/home" className="hover:text-white transition-colors">11-Lang Playground</Link>
              <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/#developer" className="hover:text-white transition-colors">Developer</Link>
              <Link href="/dsa" className="hover:text-white transition-colors">DSA Arena</Link>
              <Link href="/blogs" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
            </div>
            <p className="font-mono text-[11px] text-zinc-500">
              © 2026 CodeSaarthi · Built by Saurabh Singh Rajput
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
