"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Zap, Layers, ListOrdered, Target, Play } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function DevPracticePlatform() {
  const router = useRouter();

  const [category, setCategory] = useState("web");
  const [level, setLevel] = useState("Basic");
  const [count, setCount] = useState(5);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#040508]" />;
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-[#040508] text-[#F0F0F8] overflow-x-hidden font-sans" suppressHydrationWarning>
        {/* Ambient Background Image */}
        <div
          className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/webdev.jpeg')",
            opacity: 0.40,
            filter: "brightness(0.8) contrast(1.05)",
          }}
        />
        {/* Radial vignette mask - color graded to blend the background image perfectly */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(4,5,8,0.15)_0%,rgba(4,5,8,0.75)_45%,#040508_95%)]" />

        {/* Background Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7C6FE0]/10 blur-[120px] pointer-events-none" />

        <main className="relative z-10 max-w-7xl mx-auto pt-32 pb-20 px-4 md:px-6">
          
          {/* Split Layout Container */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              
              {/* Left Column: Hero Text */}
              <div className="space-y-6 animate-fade-in-up">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C6FE0]/10 border border-[#7C6FE0]/30 text-[#A89FF5] mb-2 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
                      <Target size={16} className="text-[#7C6FE0]" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#A89FF5]">Dev Arena</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-white drop-shadow-[0_4px_24px_rgba(8,10,18,0.85)]">
                      Development tasks are <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C6FE0] via-[#A89FF5] to-[#7C6FE0]">waiting to enrich</span> your coding skills.
                  </h1>
                  
                  <p className="text-[#8B8FA8] text-lg md:text-xl max-w-lg font-medium">
                      Turn practice into a structured, real-world coding experience. Configure your track and launch the environment.
                  </p>
              </div>

              {/* Right Column: Abstract CSS Graphic */}
              <div className="hidden lg:flex justify-center relative [perspective:1000px] animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  <div className="relative w-[400px] h-[400px] [transform-style:preserve-3d]">
                      <div className="absolute inset-0 bg-gradient-to-bl from-cyan-600/40 to-[#7C6FE0]/40 rounded-[32px] -rotate-12 blur-xl animate-pulse" />
                      <div className="absolute inset-0 bg-[#0F1120]/90 backdrop-blur-3xl border border-[#14172B] rounded-[32px] shadow-2xl flex flex-col items-center justify-center p-8 transform hover:-rotate-y-12 transition-transform duration-700 hover:shadow-[0_20px_80px_rgba(124,111,224,0.22)] group">
                          <div className="w-32 h-32 bg-gradient-to-bl from-cyan-400 to-[#7C6FE0] rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(124,111,224,0.5)] relative overflow-hidden">
                              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                              <Layers size={64} className="text-white relative z-10 animate-bounce" style={{animationDuration: '4s'}} />
                          </div>
                          <h3 className="text-2xl font-black text-white text-center">Build Real Systems</h3>
                          <p className="text-[#7C6FE0] font-mono text-sm mt-2 text-center">Architecture_Active</p>
                          
                          {/* Decorative cards floating */}
                          <div className="absolute -right-12 top-20 bg-[#0F1120]/90 p-4 rounded-2xl border border-[#14172B] shadow-xl animate-pulse" style={{animationDelay: '1.5s'}}>
                              <div className="flex gap-2">
                                  <div className="w-4 h-4 bg-purple-500 rounded-sm" />
                                  <div className="w-4 h-4 bg-cyan-500 rounded-sm" />
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Configuration Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            
            {/* Section 01: Category Selection */}
            <section className="lg:col-span-8 bg-[#0F1120]/80 backdrop-blur-xl border border-[#14172B]/80 rounded-[32px] p-8 shadow-2xl flex flex-col justify-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#A89FF5] mb-8 flex items-center gap-2">
                <Layers size={16} className="text-[#7C6FE0]" /> 01 // Select Track
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "web", label: "Web Development" },
                  { id: "app", label: "App Development" },
                  { id: "blockchain", label: "Blockchain" },
                  { id: "ai", label: "Agentic AI" }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setCategory(t.id)}
                    className={`py-8 rounded-2xl text-sm md:text-base font-bold border transition-all duration-300 relative overflow-hidden group cursor-pointer ${category === t.id
                        ? "bg-gradient-to-br from-[#7C6FE0] to-[#8B7FE8] text-white border-transparent shadow-[0_10px_25px_rgba(124,111,224,0.35)] scale-105 z-10"
                        : "bg-black/40 border-[#14172B]/60 text-zinc-400 hover:border-[#7C6FE0]/50 hover:bg-[#12142B]/85"
                      }`}
                  >
                    {category === t.id && <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />}
                    <span className="relative z-10">{t.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Section 02 & 03: Controls */}
            <section className="lg:col-span-4 space-y-6 flex flex-col">
              <div className="bg-[#0F1120]/80 backdrop-blur-xl border border-[#14172B]/80 rounded-[32px] p-8 shadow-2xl">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#A89FF5] mb-6 flex items-center gap-2">
                  <ListOrdered size={16} className="text-[#7C6FE0]" /> 02 // Task Quantity
                </h3>
                <div className="flex bg-black/40 p-2 rounded-2xl border border-[#14172B]/60 gap-2">
                  {[5, 10].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCount(n)}
                      className={`flex-1 py-3 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer ${count === n
                          ? "bg-white text-black shadow-lg scale-105"
                          : "text-zinc-500 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      {n} Tasks
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#0F1120]/80 backdrop-blur-xl border border-[#14172B]/80 rounded-[32px] p-8 shadow-2xl">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#A89FF5] mb-6 flex items-center gap-2">
                  <Cpu size={16} className="text-[#7C6FE0]" /> 03 // Difficulty Level
                </h3>
                <div className="flex bg-black/40 p-2 rounded-2xl border border-[#14172B]/60 gap-2">
                  {["Basic", "Medium", "Advanced"].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLevel(l)}
                      className={`flex-1 py-3 rounded-xl text-[10px] sm:text-xs font-black transition-all duration-300 cursor-pointer ${level === l
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
                onClick={() =>
                  router.push(
                    `/contestdev?category=${category}&level=${level}&count=${count}&title=${encodeURIComponent(
                      `${category.toUpperCase()} ${level} Practice`
                    )}`
                  )
                }
                className="mt-auto w-full py-6 rounded-[32px] bg-gradient-to-r from-[#7C6FE0] to-[#8B7FE8] text-white font-black text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(124,111,224,0.45)] hover:shadow-[0_20px_50px_rgba(124,111,224,0.65)] flex items-center justify-center gap-3 group cursor-pointer"
              >
                Start Practice
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Play size={14} className="fill-white text-white" />
                </div>
              </button>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
