"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Zap, Layers, ListOrdered, Play, Code2, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Image from "next/image";

const TOPICS = ["Arrays", "Strings", "Stack", "Queue", "LinkedList", "BinarySearch", "Recursion", "DP"];

export default function DsaPracticeArena() {
  const router = useRouter();
  const [config, setConfig] = useState({
    topic: "Arrays",
    level: "Basic",
    count: 5,
    language: "Python",
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-foreground pt-28 pb-20 px-4 md:px-6">
        <main className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.045] px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
              <Zap size={13} className="text-[#c9d0be]" />
              <span>Data structures & algorithms</span>
            </div>
            <h1 className="font-serif text-3xl font-normal tracking-tight text-frost md:text-4xl">
              Make room to think.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Choose a topic and a pace that feels right. Your next useful problem is a few choices away.
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
                        className={`py-3.5 px-3 rounded-xl text-xs font-medium border transition-all duration-200 cursor-pointer text-center ${
                          isSelected
                            ? "bg-foreground text-background border-white/50 shadow-lg shadow-black/30 font-semibold"
                            : "bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:border-white/[0.14] hover:text-foreground hover:bg-white/[0.04]"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Language Selection */}
              <div className="pt-2 border-t border-white/[0.05]">
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
                        className={`py-3 px-3 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer text-center border ${
                          isSelected
                            ? "bg-white/[0.08] border-white/[0.2] text-foreground font-semibold shadow-md shadow-black/20"
                            : "bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:border-white/[0.14] hover:text-foreground"
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
                  className="w-full accent-primary h-1.5 rounded-lg cursor-pointer bg-white/[0.08]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground/50 font-mono">
                  <span>1 Question</span>
                  <span>10 Questions</span>
                </div>
              </div>

              {/* Visual Arena Preview */}
              <div className="glass-card overflow-hidden p-0 relative aspect-[16/7] rounded-xl border border-white/[0.08] bg-black">
                <Image
                  src="/assets/DSA-arena.jpg"
                  alt="DSA Arena Live Preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover opacity-70"
                />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-semibold flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Cloud Arena Active
                  </span>
                  <span className="text-white text-[10px] bg-black/80 px-2 py-0.5 rounded-full border border-white/20">
                    Groq Engine
                  </span>
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
                        className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-white/[0.1] border-white/[0.2] text-foreground font-semibold"
                            : "border-white/[0.05] bg-white/[0.02] text-muted-foreground hover:bg-white/[0.04]"
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
                className="btn-primary w-full cursor-pointer h-12 flex items-center justify-center gap-2 shadow-lg shadow-black/30"
              >
                <span>Launch Practice Contest</span>
                <Play size={14} />
              </button>

              {/* Information Pill */}
              <div className="glass-card p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Sparkles size={13} className="text-emerald-400" />
                  <span>Multi-Model AI Engine</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Groq-powered simulation with multi-key load balancing. Gemini fallback ensures zero-downtime AI coverage.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
