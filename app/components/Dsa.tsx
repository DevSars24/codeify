"use client";

import { useState, useEffect } from "react";

export default function Dsa() {
  /* ================= DATA ================= */

  const challenges = [
    {
      id: "beginner",
      level: "Beginner",
      title: "Strings & Arrays",
      desc:
        "Build a rock-solid foundation in arrays and strings while learning key optimization techniques.",
      topics: [
        "Array traversal & in-place updates",
        "Frequency arrays & hashing",
        "String manipulation techniques",
        "Palindrome & anagram checks",
        "Two pointers",
        "Sliding window (fixed & variable)",
        "Prefix sum & difference array",
        "Subarray sum patterns",
        "Kadane’s algorithm",
        "Binary search on arrays",
        "Binary search on answer",
        "Matrix traversal",
        "Rotate / transpose matrix",
        "Sorting-based logic",
        "Edge case handling",
      ],
      patterns: ["Two Pointers", "Sliding Window", "Prefix Sum", "Binary Search"],
      badge: "bg-emerald-500/15 text-emerald-300",
      glow: "hover:shadow-emerald-500/30",
    },
    {
      id: "intermediate",
      level: "Intermediate",
      title: "Linear Data Structures",
      desc:
        "Understand stacks, queues, linked lists and hashing with real interview-style patterns.",
      topics: [
        "Hash maps & sets",
        "Collision handling (concept)",
        "Stacks (LIFO)",
        "Valid parentheses",
        "Monotonic stack",
        "Histogram problems",
        "Queues & deque",
        "Linked list traversal",
        "Reverse linked list",
        "Fast & slow pointers",
        "Cycle detection & removal",
        "Merge sorted lists",
        "LRU cache concept",
        "Expression evaluation",
        "Dummy node techniques",
      ],
      patterns: ["Monotonic Stack", "Hashing", "Two Pointers"],
      badge: "bg-sky-500/15 text-sky-300",
      glow: "hover:shadow-sky-500/30",
    },
    {
      id: "advanced",
      level: "Advanced",
      title: "Trees & Graphs",
      desc:
        "Master recursion, tree traversals and graph algorithms used in real systems.",
      topics: [
        "Recursion fundamentals",
        "Binary tree basics",
        "Tree traversals (DFS)",
        "Level order (BFS)",
        "Height & diameter",
        "Balanced trees",
        "Lowest common ancestor",
        "Path sum problems",
        "BST properties",
        "Graph representations",
        "BFS & DFS in graphs",
        "Cycle detection",
        "Topological sort",
        "Union-Find",
        "Connected components",
      ],
      patterns: ["DFS/BFS", "Recursion", "Visited logic"],
      badge: "bg-indigo-500/15 text-indigo-300",
      glow: "hover:shadow-indigo-500/30",
    },
    {
      id: "expert",
      level: "Expert",
      title: "DP & Competitive Edge",
      desc:
        "Crack hard problems using DP, greedy strategies and advanced optimizations.",
      topics: [
        "DP mindset",
        "State & transition design",
        "Memoization vs tabulation",
        "1D & 2D DP",
        "Knapsack variants",
        "LIS & LCS",
        "DP on strings",
        "DP on trees",
        "Space optimization",
        "Greedy principles",
        "Interval scheduling",
        "Heaps & priority queues",
        "Top-K problems",
        "Bit manipulation",
        "Meet-in-the-middle",
      ],
      patterns: ["Dynamic Programming", "Greedy", "Heaps", "Bit Tricks"],
      badge: "bg-rose-500/15 text-rose-300",
      glow: "hover:shadow-rose-500/30",
    },
  ];

  const insights = [
    "DSA is about patterns, not question count.",
    "Think first. Code later.",
    "Struggle means growth.",
    "Brute force is the first step to optimization.",
    "Consistency beats talent every time.",
    "Interviewers value clarity over perfection.",
  ];

  const [currentInsight, setCurrentInsight] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentInsight((p) => (p + 1) % insights.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  /* ================= UI ================= */

  return (
    <div className="relative min-h-screen overflow-hidden px-6 pt-24 pb-20 text-white">

      {/* 🌈 WARM AURORA BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617]" />
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-amber-400/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 -right-32 w-[420px] h-[420px] bg-rose-400/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] bg-indigo-400/20 rounded-full blur-[120px]" />

      {/* HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
          DSA Practice Arena
        </h1>
        <p className="text-zinc-300 text-lg">
          Structured levels, core patterns & interview-ready problem solving.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
        {challenges.map((c) => (
          <div
            key={c.id}
            className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 transition-all duration-300 hover:-translate-y-1 ${c.glow}`}
          >
            <span className={`inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold ${c.badge}`}>
              {c.level}
            </span>

            <h3 className="text-xl font-semibold text-white mb-2">
              {c.title}
            </h3>

            <p className="text-zinc-300 text-sm mb-5 leading-relaxed">
              {c.desc}
            </p>

            <div className="mb-5">
              <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
                Core Topics
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-zinc-200 max-h-40 overflow-y-auto pr-1">
                {c.topics.map((t, i) => (
                  <li key={i}>• {t}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
                Patterns
              </p>
              <div className="flex flex-wrap gap-2">
                {c.patterns.map((p) => (
                  <span
                    key={p}
                    className="text-xs px-3 py-1 rounded-full bg-white/10 text-zinc-200"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold text-sm">
              Start {c.level} Practice
            </button>
          </div>
        ))}
      </div>

      {/* REAL TALK */}
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-lg font-semibold text-zinc-100 mb-6">
          Real Talk (Senior Insight)
        </h2>

        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-500">
          <p className="text-zinc-200 italic text-sm leading-relaxed">
            “{insights[currentInsight]}”
          </p>

          <div className="flex justify-center gap-2 mt-5">
            {insights.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentInsight ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
