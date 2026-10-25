"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
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
        <section className="pt-28 pb-16 sm:pt-36 sm:pb-20 md:pt-40 md:pb-24 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5">
              {/* Welcome Introduction Header */}
              <div className="hero-line inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D] animate-pulse" />
                <span className="text-[#EDEAE3] font-semibold tracking-wide text-xs">
                  Welcome to CodeSaarthi
                </span>
                <span className="text-white/20">·</span>
                <span className="text-[#7C786F] text-[11px]">The AI Developer Arena</span>
              </div>

              {/* Intro Mobile Coding Visual (Compact Preview First) */}
              <div className="hero-line relative w-full max-w-sm aspect-[16/9] rounded-2xl overflow-hidden border border-white/[0.12] shadow-xl bg-black/60 group">
                <Image
                  src="/assets/mobile_coder_intro.jpg"
                  alt="Developer coding on mobile with CodeSaarthi"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                
                {/* Top Badge Overlay */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-medium text-[#EDEAE3] flex items-center gap-1.5 pointer-events-none">
                  <Sparkles size={11} className="text-[#E8A33D]" />
                  <span>Welcome to CodeSaarthi</span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/10 font-mono text-[10px] text-[#EDEAE3]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D] animate-pulse" />
                    CodeSaarthi Mobile
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[#7C786F] text-[10px]">
                    Touch-Optimized
                  </span>
                </div>
              </div>

              {/* Clean Minimal Badge */}
              <div className="hero-line badge-luminous inline-flex items-center gap-2 px-3 py-1.5 border-white/[0.08] bg-white/[0.03]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
                <span className="text-[#EDEAE3] font-medium text-xs">CodeSaarthi v2</span>
                <span className="text-white/20">·</span>
                <span className="text-[#7C786F] text-xs font-mono">Groq LPU</span>
                <ChevronRight size={13} className="text-[#7C786F]" />
              </div>

              {/* Main Headline */}
              <h1 className="hero-line text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-semibold tracking-[-0.02em] leading-[1.12] text-[#EDEAE3]">
                Practice, compete, and{" "}
                <span className="text-[#E8A33D] underline decoration-[#E8A33D] underline-offset-4 decoration-1 font-semibold">
                  master code
                </span>{" "}
                without noise.
              </h1>

              {/* Short, Left-Aligned Copy */}
              <p className="hero-line text-sm sm:text-base text-[#A8A49B] max-w-lg leading-[1.6] font-normal">
                An ultra-fast developer arena built for deep algorithmic flow with instant sub-200ms AI simulation across 11 languages.
              </p>

              {/* Action Buttons (Mobile Responsive: Full-width on phone, inline on desktop) */}
              <div className="hero-line flex flex-col sm:flex-row gap-3 pt-1 w-full sm:w-auto">
                <button
                  onClick={() => router.push("/welcome")}
                  className="btn-primary w-full sm:w-auto text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start Practicing Free</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={() => router.push("/home")}
                  className="btn-secondary w-full sm:w-auto text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Code2 size={15} className="text-[#7C786F]" />
                  <span>11-Language Playground</span>
                </button>
              </div>

              {/* Trust Metrics (Clean sans & secondary color #7C786F) */}
              <div className="hero-line pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#7C786F]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#7C786F]" />
                  <span>Sub-200ms AI simulation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C786F]" />
                  <span>11 Languages</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Smartphone size={14} className="text-[#7C786F]" />
                  <span>Mobile & Desktop ready</span>
                </div>
              </div>
            </div>

            {/* Right Hero: Real Interactive Developer Workbench (Mobile overflow protected) */}
            <div className="lg:col-span-6 hero-workbench w-full max-w-full min-w-0">
              <div className="relative rounded-2xl glass-card-glow border border-white/[0.1] overflow-hidden shadow-2xl shadow-black/80">
                
                {/* Window Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-black/40 backdrop-blur-md">
                  {/* Traffic Light Buttons */}
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5E5B54]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5E5B54]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5E5B54]" />
                    <span className="ml-2 text-[11px] font-mono text-[#7C786F] flex items-center gap-1.5">
                      <Terminal size={12} className="text-[#7C786F]" />
                      {snippet.filename}
                    </span>
                  </div>

                  {/* LPU Status Pill (Muted without neon glow) */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.03] text-[#7C786F] border border-white/[0.08] flex items-center gap-1">
                      <span>LPU {snippet.latency}</span>
                    </span>
                  </div>
                </div>

                {/* Language Switcher Tabs inside Workbench (Horizontal touch-scrollable on mobile) */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.06] bg-white/[0.02] overflow-x-auto scrollbar-none flex-nowrap">
                  {Object.keys(HERO_SNIPPETS).map((key) => {
                    const item = HERO_SNIPPETS[key];
                    const isActive = activeTab === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono shrink-0 transition-colors cursor-pointer ${
                          isActive
                            ? "bg-white/10 text-[#EDEAE3] border border-white/20"
                            : "text-[#7C786F] hover:text-[#EDEAE3] hover:bg-white/[0.04]"
                        }`}
                      >
                        {item.lang}
                      </button>
                    );
                  })}
                </div>

                {/* Editor Code Canvas with Muted Syntax Colors (30% toned down saturation) */}
                <div className="p-4 bg-[#05070d]/92 border-y border-white/[0.06] font-mono text-xs overflow-x-auto max-w-full">
                  <pre className="text-[#EDEAE3] leading-relaxed">
                    <code>
                      {snippet.code.split("\n").map((line, idx) => (
                        <div key={idx} className="table-row">
                          <span className="table-cell pr-4 select-none text-[#5E5B54] text-[11px] text-right">
                            {idx + 1}
                          </span>
                          <span className="table-cell whitespace-pre">
                            {line.startsWith("#") || line.startsWith("//") ? (
                              <span className="text-[#5E5B54] italic">{line}</span>
                            ) : line.includes("def ") || line.includes("function ") || line.includes("pub fn ") ? (
                              <span className="text-[#D6D2C8] font-semibold">{line}</span>
                            ) : line.includes("return") || line.includes("assert") ? (
                              <span className="text-[#C9A66B]">{line}</span>
                            ) : line.includes('"') || line.includes("'") ? (
                              <span className="text-[#8FAF9A]">{line}</span>
                            ) : (
                              <span className="text-[#EDEAE3]">{line}</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>

                {/* Simulated Execution Console Bar */}
                <div className="p-3.5 border-t border-white/[0.08] bg-black/80 backdrop-blur-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSimulateRun}
                        disabled={isRunning}
                        className="btn-primary h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Play size={11} className={isRunning ? "animate-spin" : "fill-current"} />
                        <span>{isRunning ? "Simulating..." : "Run Simulation"}</span>
                      </button>
                      <span className="text-[11px] text-[#7C786F]">
                        {isRunning ? "Evaluating on LPU..." : "Sub-200ms Instant Sandbox"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      {/* Success state: muted sage #7FB08A */}
                      <span className="px-2 py-0.5 rounded bg-[#7FB08A]/10 text-[#7FB08A] border border-[#7FB08A]/20">
                        ✓ 15/15 Passed
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[#A8A49B] border border-white/[0.08]">
                        {snippet.complexity}
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Result Drawer */}
                  {hasRun && (
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1 text-[10px] sm:text-[11px] font-mono">
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-center">
                        <span className="text-[#7C786F] block text-[9px]">LPU LATENCY</span>
                        <span className="text-[#EDEAE3] font-semibold">{snippet.latency}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-center">
                        <span className="text-[#7C786F] block text-[9px]">PEAK MEMORY</span>
                        <span className="text-[#EDEAE3] font-semibold">{snippet.memory}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-center">
                        <span className="text-[#7C786F] block text-[9px]">AST REVIEW</span>
                        <span className="text-[#7FB08A] font-semibold">Optimal O(N)</span>
                      </div>
                    </div>
                  )}

                  {/* Mentor Feedback Bar */}
                  <div className="pt-1 flex items-center gap-2 text-xs text-[#7C786F]">
                    <Sparkles size={13} className="text-[#7C786F] shrink-0" />
                    <span className="text-[#7C786F]">Mentor:</span>
                    <div className="text-[#A8A49B] text-[11px] truncate">
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
        <section ref={featuresRef} id="features" className="py-20 sm:py-24 px-4 sm:px-6 border-t border-white/[0.08] relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[#7C786F] mb-3 text-xs uppercase tracking-wider">
                <Layers size={13} /> Platform Capabilities
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-[#EDEAE3] mb-3">
                Engineered for deliberate practice
              </h2>
              <p className="text-sm sm:text-base text-[#A8A49B] leading-[1.6]">
                Contests, complexity diagnostics, and mentor explanations built for developers who take their craft seriously.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: Terminal,
                  title: "Simulated Execution",
                  desc: "Test custom inputs without waiting for heavy sandbox containers. AI predicts exact console output in sub-200ms.",
                  tag: "Groq Powered",
                  stat: "18ms Latency",
                },
                {
                  icon: Cpu,
                  title: "Algorithmic Review",
                  desc: "Submissions receive instant asymptotic complexity analysis (O(N) time/space) and concrete edge-case diagnostics.",
                  tag: "Smart Review",
                  stat: "AST Analysis",
                },
                {
                  icon: Zap,
                  title: "11-Language Playground",
                  desc: "Instant code review, auto-fix, and logic explanations across Python, Java, C++, JS, TS, Go, Rust, and more.",
                  tag: "11 Runtimes",
                  stat: "Zero Setup",
                },
              ].map(({ icon: Icon, title, desc, tag, stat }) => (
                <div
                  key={title}
                  className="feature-card glass-card p-6 flex flex-col justify-between group transition-all duration-200 hover:border-white/20"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-[#7C786F] group-hover:text-[#EDEAE3] transition-colors">
                        <Icon size={18} />
                      </div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-[#7C786F]">
                        {tag}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-[#EDEAE3]">
                      {title}
                    </h3>
                    <p className="text-xs text-[#A8A49B] leading-[1.6]">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#7C786F]">
                    <span>Performance tier:</span>
                    <span className="text-[#EDEAE3] font-medium font-mono">{stat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Feature Showcase (Real Developer Workbenches) ─────────── */}
        <section ref={showcaseRef} className="py-20 sm:py-24 px-4 sm:px-6 border-t border-white/[0.08] relative z-10">
          <div className="max-w-6xl mx-auto space-y-14">
            <div className="text-left sm:text-center max-w-2xl sm:mx-auto space-y-3">
              <div className="badge-luminous inline-flex sm:mx-auto border-white/[0.08] text-[#7C786F]">
                <Sparkles size={12} className="text-[#E8A33D]" /> Platform Architecture Tour
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-[#EDEAE3]">
                Built for Elite Problem Solvers
              </h2>
              <p className="text-sm text-[#A8A49B] leading-[1.6]">
                Developer workspace designed for deep focus, quiet contrast, and zero distractions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
              
              {/* Showcase Card 1: Sub-200ms Execution Pipeline */}
              <div className="glass-card-glow p-5 sm:p-7 flex flex-col justify-between group transition-colors">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.03] text-[#7C786F] border border-white/[0.08]">
                      01 / SIMULATION
                    </span>
                    <span className="text-xs text-[#7C786F] flex items-center gap-1.5">
                      <span>Sub-200ms In-Memory</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#EDEAE3] mb-2">
                      Sub-200ms Simulated Execution
                    </h3>
                    <p className="text-xs text-[#A8A49B] leading-[1.6]">
                      Instead of spinning up slow containers, our fine-tuned LPU engine evaluates logic in memory, streaming verified test output in milliseconds.
                    </p>
                  </div>

                  {/* Interactive Visual AST Diagram */}
                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs space-y-3 max-w-full overflow-hidden">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[11px] text-[#7C786F]">
                      <span>EXECUTION PIPELINE</span>
                      <span className="text-[#7FB08A]">STATUS: VERIFIED</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="p-2 rounded bg-white/[0.02] border border-white/[0.06]">
                        <span className="text-[#7C786F] block">PARSER</span>
                        <span className="text-[#EDEAE3]">Tree-sitter</span>
                      </div>
                      <div className="p-2 rounded bg-white/[0.04] border border-white/[0.1] text-[#EDEAE3]">
                        <span className="text-[#7C786F] block">SIMULATOR</span>
                        <span>LPU (18ms)</span>
                      </div>
                      <div className="p-2 rounded bg-white/[0.02] border border-white/[0.06]">
                        <span className="text-[#7C786F] block">TESTS</span>
                        <span className="text-[#7FB08A]">15/15 Passed</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-black/80 text-[11px] text-[#7FB08A] flex items-center justify-between border border-white/[0.06]">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-[#7FB08A]" />
                        All assertions validated.
                      </span>
                      <span className="text-[10px] text-[#7C786F]">0.018s</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href="/home"
                    className="btn-secondary w-full text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <span>Test Instant Execution</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Showcase Card 2: Asymptotic Complexity Engine */}
              <div className="glass-card-glow p-5 sm:p-7 flex flex-col justify-between group transition-colors">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.03] text-[#7C786F] border border-white/[0.08]">
                      02 / DIAGNOSTICS
                    </span>
                    <span className="text-xs text-[#7C786F] flex items-center gap-1.5">
                      <Gauge size={12} className="text-[#7C786F]" /> Big-O Profiler
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#EDEAE3] mb-2">
                      Deep Asymptotic Review
                    </h3>
                    <p className="text-xs text-[#A8A49B] leading-[1.6]">
                      Beyond test pass/fail checks, understand whether your algorithm scales. Automatic asymptotic analysis gives precise Big-O guarantees.
                    </p>
                  </div>

                  {/* Visual Big-O Scale (Scrollable on small mobile) */}
                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs space-y-3 max-w-full overflow-hidden">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[11px] text-[#7C786F]">
                      <span>TIME COMPLEXITY SPECTRUM</span>
                      <span className="text-[#E8A33D]">O(N) DETECTED</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] overflow-x-auto">
                      <div className="flex-1 min-w-[44px] p-1.5 rounded bg-white/[0.02] border border-white/[0.06] text-[#7C786F] text-center">
                        O(1)
                      </div>
                      <div className="flex-1 min-w-[44px] p-1.5 rounded bg-white/[0.02] border border-white/[0.06] text-[#7C786F] text-center">
                        O(log N)
                      </div>
                      <div className="flex-1 min-w-[44px] p-1.5 rounded bg-white/10 border border-[#E8A33D]/60 text-[#EDEAE3] font-semibold text-center">
                        O(N) ★
                      </div>
                      <div className="flex-1 min-w-[44px] p-1.5 rounded bg-white/[0.02] border border-white/[0.06] text-[#7C786F] text-center">
                        O(N log N)
                      </div>
                      <div className="flex-1 min-w-[44px] p-1.5 rounded bg-white/[0.02] border border-white/[0.06] text-[#7C786F] text-center">
                        O(N²)
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-white/[0.02] text-[11px] text-[#A8A49B] flex items-center justify-between border border-white/[0.06]">
                      <span>Space: O(1) Auxiliary heap</span>
                      <span className="text-[#7FB08A] font-semibold">Optimal</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href="/dsa"
                    className="btn-secondary w-full text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <span>Explore DSA Arena</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Showcase Card 3: Live Tournament Leaderboards */}
              <div className="glass-card-glow p-5 sm:p-7 flex flex-col justify-between group transition-colors">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.03] text-[#7C786F] border border-white/[0.08]">
                      03 / COMPETITIVE
                    </span>
                    <span className="text-xs text-[#7C786F] flex items-center gap-1.5">
                      <Trophy size={12} className="text-[#E8A33D]" /> Global Rankings
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#EDEAE3] mb-2">
                      Live Tournament Arena
                    </h3>
                    <p className="text-xs text-[#A8A49B] leading-[1.6]">
                      Battle against peers in timed algorithmic rounds. Test against randomized hidden stress cases and climb global tiers.
                    </p>
                  </div>

                  {/* Leaderboard Mockup Card */}
                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs space-y-2.5 max-w-full overflow-hidden">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[11px] text-[#7C786F]">
                      <span>WEEKLY ARENA #42</span>
                      <span className="text-[#EDEAE3] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" /> LIVE
                      </span>
                    </div>

                    {[
                      { rank: "#1", name: "Saurabh", score: "2,840 pts", time: "04:12", tier: "Grandmaster" },
                      { rank: "#2", name: "Elena_K", score: "2,710 pts", time: "05:40", tier: "Master" },
                      { rank: "#3", name: "Alex_Code", score: "2,590 pts", time: "06:15", tier: "Knight" },
                    ].map((user) => (
                      <div key={user.name} className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.06] text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#EDEAE3]">{user.rank}</span>
                          <span className="text-[#EDEAE3] font-medium">{user.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/[0.04] text-[#7C786F]">{user.tier}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[#7FB08A] font-medium">{user.score}</span>
                          <span className="text-[#7C786F] text-[10px]">{user.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href="/leaderboard"
                    className="btn-secondary w-full text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <span>View Global Leaderboard</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Showcase Card 4: Mobile & Desktop Algorithmic Studio */}
              <div className="glass-card-glow p-5 sm:p-7 flex flex-col justify-between group transition-colors">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.03] text-[#7C786F] border border-white/[0.08]">
                      04 / DUAL-DEVICE
                    </span>
                    <span className="text-xs text-[#7C786F] flex items-center gap-1.5">
                      <Smartphone size={12} className="text-[#7C786F]" /> Touch Optimized
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-[#EDEAE3] mb-2">
                      Mobile & Desktop Algorithmic Flow
                    </h3>
                    <p className="text-xs text-[#A8A49B] leading-[1.6]">
                      Practice coding rounds anywhere. Custom mobile code keyboard ribbons, fast gesture bracket injection, and instant test evaluation.
                    </p>
                  </div>

                  {/* Mobile Preview UI Mockup */}
                  <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs space-y-3 max-w-full overflow-hidden">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[11px] text-[#7C786F]">
                      <span>MOBILE QUICK-ACTION BAR</span>
                      <span className="text-[#EDEAE3]">TOUCH READY</span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
                      {["tab", "( )", "{ }", "[ ]", "=>", ":", ";", "=="].map((symbol) => (
                        <div key={symbol} className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-[#A8A49B] shrink-0">
                          {symbol}
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-[11px] text-[#A8A49B]">
                      <span className="flex items-center gap-1.5">
                        <Check size={13} className="text-[#7FB08A]" />
                        Synced to cloud profile.
                      </span>
                      <span className="text-[10px] text-[#7C786F]">Auto-saved</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href="/welcome"
                    className="btn-secondary w-full text-xs font-semibold flex items-center justify-center gap-2"
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

        {/* ─── Bottom CTA ───────────────────────────────────────────── */}
        <section className="py-24 sm:py-28 px-4 sm:px-6 border-t border-white/[0.08] relative overflow-hidden z-10">
          <div className="max-w-xl mx-auto text-center relative z-10 space-y-5">
            <div className="badge-luminous inline-flex mx-auto border-white/[0.08] text-[#7C786F]">
              <Trophy size={13} className="text-[#E8A33D]" /> Join Thousands of Developers
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-[#EDEAE3]">
              Ready to elevate your code?
            </h2>
            <p className="text-sm sm:text-base text-[#A8A49B] leading-[1.6]">
              Step into the arena, solve challenges across 11 languages, and track your engineering progress on your personal dashboard.
            </p>
            <div className="pt-2">
              <button
                onClick={() => router.push("/welcome")}
                className="btn-primary cursor-pointer px-8 h-11 text-sm font-semibold flex items-center justify-center gap-2 mx-auto w-full sm:w-auto"
              >
                <span>Launch Developer Workspace</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* ─── Footer ──────────────────────────────────────────────── */}
        <footer className="py-12 px-4 sm:px-6 border-t border-white/[0.08] bg-black/60 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#7C786F]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg border border-white/[0.1] bg-white/[0.03] flex items-center justify-center">
                <Command size={14} className="text-[#EDEAE3]" />
              </div>
              <span className="font-semibold text-[#EDEAE3] tracking-tight">CodeSaarthi</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.04] border border-white/[0.08] text-[#7C786F]">
                v2
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
              <Link href="/home" className="hover:text-[#EDEAE3] transition-colors">11-Lang Playground</Link>
              <Link href="/#pricing" className="hover:text-[#EDEAE3] transition-colors">Pricing</Link>
              <Link href="/#developer" className="hover:text-[#EDEAE3] transition-colors">Developer</Link>
              <Link href="/dsa" className="hover:text-[#EDEAE3] transition-colors">DSA Arena</Link>
              <Link href="/blogs" className="hover:text-[#EDEAE3] transition-colors">Blog</Link>
              <Link href="/leaderboard" className="hover:text-[#EDEAE3] transition-colors">Leaderboard</Link>
            </div>
            <p className="text-[11px] text-[#7C786F]">
              © 2026 CodeSaarthi · Built by Saurabh Singh Rajput
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
