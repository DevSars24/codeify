"use client";

import { useState, useEffect } from "react";
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

  const [topic, setTopic] = useState("Arrays");
  const [level, setLevel] = useState("Basic"); // future use
  const [count, setCount] = useState(5);
  const [language, setLanguage] = useState("C++");
  const [typedText, setTypedText] = useState("");

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

  return (
    <div className="relative min-h-screen px-4 pt-24 pb-16 text-white overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-black via-[#0b1020] to-black" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/60 to-black" />

      {/* AURORA */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[180px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[180px]" />

      {/* HERO */}
      <div className="max-w-xl mx-auto text-center mb-10 animate-fade">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            DSA Practice Arena
          </span>
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base">
          <span className="font-semibold text-white">SARS </span>
          {typedText}
          <span className="ml-1 animate-blink">|</span>
        </p>
      </div>

      {/* PRACTICE CARD */}
      <div className="max-w-sm mx-auto mb-14 animate-slide-up">
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-3xl p-5 space-y-5">

          {/* TOPIC */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1 uppercase">
              Topic
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-sm"
            >
              {TOPICS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* LEVEL */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1 uppercase">
              Level
            </label>
            <div className="flex gap-3">
              {["Basic", "Medium", "Advanced"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold ${
                    level === l
                      ? "bg-white text-black"
                      : "bg-white/10 text-zinc-300"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* QUESTIONS */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1 uppercase">
              Questions
            </label>
            <div className="flex gap-3">
              {[5, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold ${
                    count === n
                      ? "bg-white text-black"
                      : "bg-white/10 text-zinc-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* LANGUAGE */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1 uppercase">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-sm"
            >
              <option>C++</option>
              <option>Java</option>
              <option>Python</option>
            </select>
          </div>

          {/* START DSA PRACTICE */}
          <button
            onClick={() =>
              router.push(
                `/contestdsa?topic=${topic}&count=${count}&language=${encodeURIComponent(
                  language
                )}`
              )
            }
            className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm"
          >
            🚀 Start DSA Practice
          </button>
        </div>
      </div>

      {/* WHY SECTION */}
      <div className="max-w-md mx-auto mb-8 animate-fade-delayed">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
          <h3 className="font-semibold mb-2">Why DSA Practice?</h3>
          <p className="text-zinc-400 text-sm">
            Build problem-solving depth with topic-focused contests and instant feedback.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade { animation: fade 0.9s ease-out; }
        .animate-slide-up { animation: slideUp 0.9s ease-out; }
        .animate-blink { animation: blink 1s infinite; }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
