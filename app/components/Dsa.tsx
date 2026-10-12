"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Zap, Layers, ListOrdered, Play, Code2, Sparkles } from "lucide-react";
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
      <div className="min-h-screen bg-background text-foreground">
        <main className="max-w-6xl mx-auto pt-28 pb-20 px-4 md:px-6">
          <div className="mb-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted border border-border text-xs font-medium text-muted-foreground mb-4">
              <Zap size={14} className="text-primary" /> DSA Arena
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Configure your practice session</h1>
            <p className="text-muted-foreground">
              Select topic, programming language, difficulty, and problem count to launch your AI practice contest.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-8 surface-card p-6 md:p-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
                <Layers size={14} /> Topic
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setConfig({ ...config, topic: t })}
                    className={`py-4 rounded-md text-sm font-medium border transition-colors cursor-pointer ${
                      config.topic === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Language Selector */}
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Code2 size={14} /> Language
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Python", "C++", "JavaScript", "Java"].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setConfig({ ...config, language: lang })}
                    className={`py-3 rounded-md text-xs font-mono font-medium border transition-colors cursor-pointer ${
                      config.language === lang
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </section>

            <section className="lg:col-span-4 space-y-4">
              <div className="surface-card p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <ListOrdered size={14} /> Questions: {config.count}
                </h3>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={config.count}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setConfig({ ...config, count: parseInt(e.target.value) })
                  }
                  className="w-full accent-primary"
                />
              </div>

              <div className="surface-card p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <Cpu size={14} /> Difficulty
                </h3>
                <div className="flex gap-2">
                  {["Basic", "Medium", "Hard"].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setConfig({ ...config, level: l })}
                      className={`flex-1 py-2 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                        config.level === l
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

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
                className="btn-primary w-full cursor-pointer flex items-center justify-center gap-2"
              >
                Start Practice Contest <Play size={14} />
              </button>

              <div className="surface-card p-5 overflow-hidden rounded-xl border border-border mt-4 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles size={12} className="text-primary" /> AI Evaluation Mode
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Submissions receive AI-estimated assessments and edge-case feedback powered by ultra-low latency Groq AI with Gemini fallback.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
