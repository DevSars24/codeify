"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Layers, ListOrdered, Target, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function DevPracticePlatform() {
  const router = useRouter();
  const [category, setCategory] = useState("web");
  const [level, setLevel] = useState("Basic");
  const [count, setCount] = useState(5);
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
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.045] px-3.5 py-1.5 text-xs font-medium text-muted-foreground mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
              <Target size={14} className="text-[#c9d0be]" /> Project practice
            </div>
            <h1 className="font-serif text-3xl font-normal tracking-tight mb-4 md:text-4xl">Learn by making something.</h1>
            <p className="text-muted-foreground">Choose a track, set a comfortable pace, and work through a practical build.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-8 glass-card p-6 md:p-8">
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
              <div className="glass-card p-6">
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

              <div className="glass-card p-6">
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

              <div className="glass-card p-5 overflow-hidden rounded-xl border border-white/[0.08] mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Play size={12} className="text-violet-400" /> Lab Preview
                </h4>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-white/[0.08] bg-black/60">
                  <Image
                    src="/assets/webdev.jpeg"
                    alt="Dev Lab Workspace Preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover opacity-80"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-2.5 leading-relaxed">
                  Real-world sandbox environment featuring custom test suites, server consoles, and side-by-side spec panels.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
