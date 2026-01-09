"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const TOPICS = ["Arrays", "Strings", "Stack", "Queue", "LinkedList", "BinarySearch", "Recursion", "DP"];

export default function DsaPracticeArena() {
  const router = useRouter();
  const [topic, setTopic] = useState("Arrays");
  const [level, setLevel] = useState("Basic");
  const [count, setCount] = useState(5);
  const [language, setLanguage] = useState("C++");
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const full = "turns DSA practice into a structured, competitive and interview-ready experience.";
    let i = 0;
    const id = setInterval(() => {
      setTypedText(full.slice(0, i));
      i++;
      if (i > full.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-screen px-6 pt-32 pb-20 text-white bg-[#050505] font-sans selection:bg-purple-500/30">
      {/* ARCHITECTURAL BACKGROUND */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_2px_2px,#111_1px,transparent_0)] bg-[size:40px_40px] opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* HEADER SECTION */}
      <div className="max-w-4xl mx-auto text-center mb-16 relative">
        <div className="inline-block px-3 py-1 mb-6 rounded-full border border-white/5 bg-white/5 text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">
          Neural System V2.0
        </div>
        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic leading-none">
          DSA <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '1px white' }}>ARENA</span>
        </h1>
        <p className="text-zinc-500 text-sm md:text-xl font-medium tracking-tight max-w-xl mx-auto leading-relaxed">
          <span className="text-white font-black tracking-widest mr-2">SARS</span>
          {typedText}
          <span className="inline-block w-1.5 h-5 bg-purple-500 ml-1 animate-pulse align-middle" />
        </p>
      </div>

      {/* COMMAND CONSOLE (Cards) */}
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="relative p-[1px] rounded-[32px] bg-gradient-to-b from-white/10 to-transparent group overflow-hidden">
            <div className="relative bg-[#0a0a0a] rounded-[31px] p-8 md:p-12 space-y-10 backdrop-blur-xl">
              
              {/* TOPIC SELECTOR - GRID STYLE */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Select Domain</label>
                  <span className="text-[10px] font-mono text-purple-500/50">ID: {topic.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`py-3 px-2 rounded-xl text-[11px] font-bold border transition-all duration-300 ${
                        topic === t 
                        ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                        : "bg-transparent border-white/5 text-zinc-500 hover:border-white/20"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* LEVEL & LANGUAGE ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Intensity</label>
                  <div className="flex bg-black p-1 rounded-2xl border border-white/5">
                    {["Basic", "Medium", "Hard"].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLevel(l)}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                          level === l ? "bg-zinc-800 text-white shadow-inner" : "text-zinc-600 hover:text-zinc-400"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Environment</label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-black border border-white/5 rounded-2xl px-4 py-2 text-xs font-bold focus:border-purple-500 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option>C++</option>
                    <option>Java</option>
                    <option>Python</option>
                  </select>
                </div>
              </div>

              {/* START ACTION */}
              <div className="pt-4">
                <button
                  onClick={() => router.push(`/contestdsa?topic=${topic}&count=${count}&difficulty=${level}&language=${encodeURIComponent(language)}`)}
                  className="group relative w-full py-5 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.4em] overflow-hidden transition-all hover:scale-[1.01] active:scale-95"
                >
                  <span className="relative z-10">Initialize Sequence</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @font-face {
          font-family: 'Geist';
          src: url('https://cdn.jsdelivr.net/font-geist/1.0.0/Geist-Variable.woff2') format('woff2');
        }
        .stroke-text {
          color: transparent;
        }
      `}</style>
    </div>
  );
}