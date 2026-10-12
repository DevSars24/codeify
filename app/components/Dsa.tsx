"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Zap, Layers, ListOrdered, Play, Code2, Sparkles, Sliders } from "lucide-react";
import Navbar from "@/components/Navbar";

const TOPICS = ["Arrays", "Strings", "Stack", "Queue", "LinkedList", "BinarySearch", "Recursion", "DP"];

export default function DsaPracticeArena() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState({
    topic: "Arrays",
    level: "Basic",
    count: 5,
    language: "Python",
  });

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-ambient-mesh text-foreground pt-28 pb-20 px-4 md:px-6">
        <main className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-muted-foreground shadow-xs">
              <Zap size={13} className="text-primary" />
              <span>DSA Practice Arena</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-frost">
              Configure your practice round
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Select topic, programming language, difficulty, and problem count to launch your AI practice contest.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Selection Area */}
            <section className="lg:col-span-8 glass-card p-6 md:p-8 space-y-8">
              {/* Topics Grid */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <Layers size={14} className="text-primary" /> Select Topic
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {TOPICS.map((t) => {
                    const isSelected = config.topic === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setConfig({ ...config, topic: t })}
                        className={`py-3.5 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer text-center ${
                          isSelected
                            ? "bg-foreground text-background border-white shadow-md font-semibold"
                            : "bg-white/[0.02] border-white/[0.07] text-muted-foreground hover:border-white/[0.18] hover:text-foreground hover:bg-white/[0.04]"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Language Selection */}
              <div className="pt-2 border-t border-white/[0.06]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <Code2 size={14} className="text-primary" /> Target Language
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {["Python", "C++", "JavaScript", "Java"].map((lang) => {
                    const isSelected = config.language === lang;
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setConfig({ ...config, language: lang })}
                        className={`py-3 px-3 rounded-xl text-xs font-mono transition-all cursor-pointer text-center border ${
                          isSelected
                            ? "bg-white/[0.1] border-white/[0.3] text-foreground font-semibold shadow-xs"
                            : "bg-white/[0.02] border-white/[0.07] text-muted-foreground hover:border-white/[0.18] hover:text-foreground"
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Right Sidebar Config */}
            <section className="lg:col-span-4 space-y-4">
              {/* Question Count Slider */}
              <div className="glass-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <ListOrdered size={14} className="text-primary" /> Questions
                  </h3>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {config.count}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={config.count}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setConfig({ ...config, count: parseInt(e.target.value) })
                  }
                  className="w-full accent-primary h-1.5 rounded-lg cursor-pointer bg-white/[0.1]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground/60 font-mono">
                  <span>1 Question</span>
                  <span>10 Questions</span>
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="glass-card p-5 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Cpu size={14} className="text-primary" /> Difficulty Level
                </h3>
                <div className="flex gap-2">
                  {["Basic", "Medium", "Hard"].map((l) => {
                    const isSelected = config.level === l;
                    return (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setConfig({ ...config, level: l })}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white/[0.12] border-white/[0.25] text-foreground font-semibold"
                            : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05]"
                        }`}
                      >
                        {l}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Launch Contest Button */}
              <button
                type="button"
                onClick={() => {
                  const query = new URLSearchParams({
                    topic: config.topic,
                    difficulty: config.level,
                    count: config.count.toString(),
                    language: config.language,
                  }).toString();
                  router.push(`/contestdsa?${query}`);
                }}
                className="btn-primary w-full cursor-pointer h-12 flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Launch Practice Contest</span>
                <Play size={14} />
              </button>

              {/* Information Pill */}
              <div className="glass-card p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Sparkles size={13} className="text-emerald-400" />
                  <span>AI Simulation & Review</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Fast output prediction and algorithmic complexity assessment powered by ultra-low latency Groq with Gemini fallback.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
