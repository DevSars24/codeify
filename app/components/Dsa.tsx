"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Zap, Layers, ListOrdered } from "lucide-react";

const TOPICS = ["Arrays", "Strings", "Stack", "Queue", "LinkedList", "BinarySearch", "Recursion", "DP"];

export default function DsaPracticeArena() {
  const router = useRouter();
  const [config, setConfig] = useState({
    topic: "Arrays",
    level: "Basic",
    count: 5,
    language: "C++"
  });

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-200 overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto pt-24 pb-20 px-6">
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-[0.2em] uppercase text-purple-400">
            <Zap size={12} /> System_Operational_V2
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-white">
            DSA <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">ARENA</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8 bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[32px] p-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-6 flex items-center gap-2">
              <Layers size={14} /> 01 // Select Domain
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => setConfig({ ...config, topic: t })}
                  className={`py-4 rounded-2xl text-xs font-bold border transition-all ${
                    config.topic === t ? "bg-white text-black border-white shadow-lg" : "bg-black/20 border-white/5 text-zinc-500 hover:border-white/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          <section className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[32px] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-6 flex items-center gap-2">
                <ListOrdered size={14} /> 02 // Quantity: {config.count}
              </h3>
              <input 
                type="range" min="1" max="10" value={config.count}
                 onChange={(e: ChangeEvent<HTMLInputElement>) => setConfig({...config, count: parseInt(e.target.value)})}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-500">
                <span>01</span><span>10</span>
              </div>
            </div>

            <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[32px] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-6 flex items-center gap-2">
                <Cpu size={14} /> 03 // Intensity
              </h3>
              <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                {["Basic", "Medium", "Hard"].map((l) => (
                  <button
                    key={l}
                    onClick={() => setConfig({ ...config, level: l })}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${
                      config.level === l ? "bg-zinc-800 text-white shadow-inner" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.push(`/contestdsa?topic=${config.topic}&difficulty=${config.level}&count=${config.count}&language=${config.language}`)}
              className="w-full py-6 rounded-[32px] bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-purple-500/20"
            >
              Initiate_Sequence
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}