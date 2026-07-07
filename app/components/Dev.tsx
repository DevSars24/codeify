"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Layers, ListOrdered, Target, Play } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function DevPracticePlatform() {
  const router = useRouter();
  const [category, setCategory] = useState("web");
  const [level, setLevel] = useState("Basic");
  const [count, setCount] = useState(5);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  const tracks = [
    { id: "web", label: "Web Development" },
    { id: "app", label: "App Development" },
    { id: "blockchain", label: "Blockchain" },
    { id: "ai", label: "Agentic AI" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-foreground">
        <main className="max-w-6xl mx-auto pt-28 pb-20 px-4 md:px-6">
          <div className="mb-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted border border-border text-xs font-medium text-muted-foreground mb-4">
              <Target size={14} className="text-primary" /> Dev Arena
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Configure your dev challenge</h1>
            <p className="text-muted-foreground">Pick a track, difficulty, and task count to start practicing.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-8 surface-card p-6 md:p-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
                <Layers size={14} /> Track
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {tracks.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setCategory(t.id)}
                    className={`py-6 rounded-md text-sm font-medium border transition-colors cursor-pointer ${
                      category === t.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="lg:col-span-4 space-y-4">
              <div className="surface-card p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <ListOrdered size={14} /> Tasks
                </h3>
                <div className="flex gap-2">
                  {[5, 10].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCount(n)}
                      className={`flex-1 py-2 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                        count === n ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {n} tasks
                    </button>
                  ))}
                </div>
              </div>

              <div className="surface-card p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <Cpu size={14} /> Difficulty
                </h3>
                <div className="flex gap-2">
                  {["Basic", "Medium", "Advanced"].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLevel(l)}
                      className={`flex-1 py-2 rounded-md text-[10px] font-medium border transition-colors cursor-pointer ${
                        level === l ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/contestdev?category=${category}&level=${level}&count=${count}&title=${encodeURIComponent(`${category.toUpperCase()} ${level} Practice`)}`
                  )
                }
                className="btn-primary w-full cursor-pointer"
              >
                Start practice <Play size={14} />
              </button>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
