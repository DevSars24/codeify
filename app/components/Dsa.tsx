"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Zap, Layers, ListOrdered, GraduationCap, ArrowRight, Play } from "lucide-react";

const TOPICS = ["Arrays", "Strings", "Stack", "Queue", "LinkedList", "BinarySearch", "Recursion", "DP"];

export default function DsaPracticeArena() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState({
    topic: "Arrays",
    level: "Basic",
    count: 5,
    language: "C++"
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#0B0A1E]" />;
  }

  return (
    <div className="relative min-h-screen bg-[#0B0A1E] text-white overflow-hidden font-sans" suppressHydrationWarning>
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto pt-24 pb-20 px-4 md:px-6">
        
        {/* Split Layout Container */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            
            {/* Left Column: Hero Text */}
            <div className="space-y-6 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-2 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                    <Zap size={16} className="text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">DSA Arena</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                    Algorithm arenas are <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">waiting to enrich</span> your coding skills.
                </h1>
                
                <p className="text-indigo-300/80 text-lg md:text-xl max-w-lg">
                    Configure your practice session. Select domains, intensity, and jump straight into the terminal.
                </p>
            </div>

            {/* Right Column: Abstract CSS Graphic (Inspired by the Reference Illustration) */}
            <div className="hidden lg:flex justify-center relative [perspective:1000px] animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="relative w-[400px] h-[400px] [transform-style:preserve-3d]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/40 to-cyan-500/40 rounded-[32px] rotate-12 blur-xl animate-pulse" />
                    <div className="absolute inset-0 bg-[#16133A]/80 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-2xl flex flex-col items-center justify-center p-8 transform hover:rotate-y-12 transition-transform duration-700">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(168,85,247,0.5)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                            <GraduationCap size={64} className="text-white relative z-10 animate-bounce" style={{animationDuration: '3s'}} />
                        </div>
                        <h3 className="text-2xl font-black text-white text-center">Master The Logic</h3>
                        <p className="text-cyan-400 font-mono text-sm mt-2 text-center">System_Operational_V2</p>
                        
                        {/* Decorative cards floating */}
                        <div className="absolute -left-12 top-20 bg-[#1A1744] p-4 rounded-2xl border border-white/5 shadow-xl animate-pulse" style={{animationDelay: '1s'}}>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full" />
                                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                                <div className="w-3 h-3 bg-green-500 rounded-full" />
                            </div>
                        </div>
                        <div className="absolute -right-8 bottom-20 bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-2xl shadow-xl animate-pulse" style={{animationDelay: '2s'}}>
                            <CodeIcon />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Configuration Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          
          {/* Section 01: Topic Selection */}
          <section className="lg:col-span-8 bg-[#16133A]/60 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-8 flex items-center gap-2">
              <Layers size={16} /> 01 // Select Domain
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setConfig({ ...config, topic: t })}
                  className={`py-6 rounded-2xl text-sm font-bold border transition-all duration-300 relative overflow-hidden group ${config.topic === t
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-transparent shadow-[0_10px_20px_rgba(168,85,247,0.3)] scale-105"
                      : "bg-black/40 border-white/5 text-zinc-400 hover:border-purple-500/50 hover:bg-[#1a1744]"
                    }`}
                >
                  {config.topic === t && <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />}
                  <span className="relative z-10">{t}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Section 02 & 03: Controls */}
          <section className="lg:col-span-4 space-y-6 flex flex-col">
            <div className="bg-[#16133A]/60 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-2">
                <ListOrdered size={16} /> 02 // Quantity: <span className="text-white">{config.count}</span>
              </h3>
              <input
                type="range"
                min="1"
                max="10"
                value={config.count}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfig({ ...config, count: parseInt(e.target.value) })}
                className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between mt-4 text-[10px] font-mono text-zinc-500">
                <span>01</span><span>10</span>
              </div>
            </div>

            <div className="bg-[#16133A]/60 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-2">
                <Cpu size={16} /> 03 // Intensity
              </h3>
              <div className="flex bg-black/40 p-2 rounded-2xl border border-white/5 gap-2">
                {["Basic", "Medium", "Hard"].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setConfig({ ...config, level: l })}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all duration-300 ${config.level === l
                        ? "bg-white text-black shadow-lg scale-105"
                        : "text-zinc-500 hover:text-white hover:bg-white/5"
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
                  language: config.language
                }).toString();
                router.push(`/contestdsa?${query}`);
              }}
              className="mt-auto w-full py-6 rounded-[32px] bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(168,85,247,0.4)] flex items-center justify-center gap-3 group"
            >
              Initiate Sequence
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Play size={14} className="fill-white" />
              </div>
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

// Simple code icon for decorative purposes
function CodeIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
    )
}