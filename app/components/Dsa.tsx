"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TOPICS = [
  "Arrays",
  "Strings",
  "Stack",
  "Queue",
  "LinkedList",
  "BinarySearch",
  "Recursion",
  "DP",
];

export default function DsaPracticeArena() {
  const router = useRouter();

  const [topic, setTopic] = useState<string>("Arrays");
  const [level, setLevel] = useState<string>("Basic");
  const [count, setCount] = useState<number>(5);
  const [language, setLanguage] = useState<string>("C++");
  const [typedText, setTypedText] = useState<string>("");

  /* ---------------- TYPEWRITER EFFECT ---------------- */

  useEffect(() => {
    const full =
      "turns DSA practice into a structured, competitive and interview-ready experience.";
    let i = 0;

    const id = setInterval(() => {
      setTypedText(full.slice(0, i));
      i++;
      if (i > full.length) clearInterval(id);
    }, 28);

    return () => clearInterval(id);
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="relative min-h-screen px-6 pt-32 pb-20 text-white bg-[#050505] selection:bg-purple-500/30">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_2px_2px,#111_1px,transparent_0)] bg-[size:40px_40px] opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-block px-3 py-1 mb-6 rounded-full border border-white/5 bg-white/5 text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">
          Neural System V2.0
        </div>

        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic leading-none">
          DSA{" "}
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "1px white" }}
          >
            ARENA
          </span>
        </h1>

        <p className="text-zinc-500 text-sm md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
          <span className="text-white font-black tracking-widest mr-2">
            SARS
          </span>
          {typedText}
          <span className="inline-block w-1.5 h-5 bg-purple-500 ml-1 animate-pulse align-middle" />
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-2xl mx-auto">
        <div className="relative p-[1px] rounded-[32px] bg-gradient-to-b from-white/10 to-transparent">
          <div className="bg-[#0a0a0a] rounded-[31px] p-8 md:p-12 space-y-10">

            {/* TOPIC SELECT */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                  Select Domain
                </label>
                <span className="text-[10px] font-mono text-purple-500/50">
                  ID: {topic.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className={`py-3 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      topic === t
                        ? "bg-white text-black border-white"
                        : "border-white/5 text-zinc-500 hover:border-white/20"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* COUNT SLIDER */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                  Quantity
                </label>
                <span className="text-[10px] font-mono text-purple-500">
                  {count} Questions
                </span>
              </div>

              <input
                type="range"
                min={1}
                max={10}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer accent-purple-500"
              />
            </div>

            {/* LEVEL & LANGUAGE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                  Intensity
                </label>
                <div className="flex bg-black p-1 rounded-2xl border border-white/5">
                  {["Basic", "Medium", "Hard"].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase ${
                        level === l
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-600 hover:text-zinc-400"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                  Environment
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-2xl px-4 py-2 text-xs font-bold outline-none cursor-pointer"
                >
                  <option>C++</option>
                  <option>Java</option>
                  <option>Python</option>
                </select>
              </div>
            </div>

            {/* START */}
            <button
              onClick={() =>
                router.push(
                  `/contestdsa?topic=${topic}&count=${count}&difficulty=${level}&language=${encodeURIComponent(
                    language
                  )}`
                )
              }
              className="w-full py-5 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.4em] transition-all hover:scale-[1.01] active:scale-95"
            >
              Initialize Sequence
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
