"use client";
import { useState, useEffect } from "react";

export default function Dsa() {
  const challenges = [
    {
      id: "beginner",
      level: "Beginner",
      title: "Strings & Arrays (Foundation + Optimization)",
      desc: "Master core array/string ops with optimization techniques for efficient problem-solving.",
      topics: [
        "Array Traversal & In-place Updates",
        "Frequency Arrays / Hash Counting",
        "String Manipulation (substring, reverse, rotate)",
        "Palindrome Checking (odd/even length)",
        "Anagram Detection (sorting vs hashing)",
        "Two Pointers (start–end, slow–fast)",
        "Sliding Window (fixed & variable)",
        "Prefix Sum",
        "Difference Array",
        "Subarray Sum Equals K",
        "Longest / Shortest Subarray Problems",
        "Kadane’s Algorithm (max subarray)",
        "Majority Element (Moore’s Voting)",
        "Sorting-based Problems (merge intervals, count pairs)",
        "Binary Search on Arrays",
        "Binary Search on Answer",
        "Matrix Traversal (row/column, spiral)",
        "Rotate / Transpose Matrix",
        "Character Encoding (ASCII tricks)",
        "Edge Cases (empty, single element, overflow)",
      ],
      patterns: [
        "Two Pointers",
        "Sliding Window",
        "Prefix Sum",
        "Binary Search",
      ],
      gradient: "from-green-500 to-teal-500",
      glow: "shadow-green-500/30",
    },
    {
      id: "intermediate",
      level: "Intermediate",
      title: "Linear Structures & Logic (Stacks, Queues, Linked List, Hashing)",
      desc: "Build dynamic data flows and recognize recurring patterns in linear DS.",
      topics: [
        "Hash Maps & Sets (lookup mindset)",
        "Collision handling (conceptual)",
        "Stack Basics (LIFO)",
        "Valid Parentheses",
        "Monotonic Stack (next greater/smaller)",
        "Largest Rectangle in Histogram",
        "Queue Basics (FIFO)",
        "Deque (sliding window max/min)",
        "Linked List Traversal",
        "Reverse Linked List (iterative & recursive)",
        "Fast & Slow Pointer Technique",
        "Detect & Remove Cycle",
        "Merge Sorted Lists",
        "Intersection of Linked Lists",
        "LRU Cache (HashMap + DLL concept)",
        "Stack using Queue / Queue using Stack",
        "Expression Evaluation (postfix/infix)",
        "Implementation-heavy Problems",
        "Time vs Space Tradeoffs",
        "Dummy Node & Sentinel Techniques",
      ],
      patterns: [
        "Monotonic Stack",
        "Two-Pointer Logic",
        "Hash + Structure Combos",
      ],
      gradient: "from-blue-500 to-indigo-500",
      glow: "shadow-blue-500/30",
    },
    {
      id: "advanced",
      level: "Advanced",
      title: "Trees & Graphs (Recursion + Traversal)",
      desc: "Conquer hierarchical/networked data with recursive traversals and graph algorithms.",
      topics: [
        "Recursion Fundamentals (base case, stack)",
        "Binary Tree Structure",
        "Tree Traversals (Inorder, Preorder, Postorder)",
        "Level Order Traversal (BFS)",
        "Height & Depth of Tree",
        "Diameter of Binary Tree",
        "Balanced Binary Tree",
        "Lowest Common Ancestor (LCA)",
        "Path Sum Problems",
        "Binary Search Tree (BST) Properties",
        "Insert / Delete in BST",
        "Graph Representation (list vs matrix)",
        "BFS in Graphs",
        "DFS in Graphs",
        "Connected Components",
        "Cycle Detection (directed & undirected)",
        "Topological Sorting",
        "Shortest Path (unweighted BFS)",
        "Union-Find (Disjoint Set)",
        "Tree ↔ Graph Thinking (convert mindset)",
      ],
      patterns: [
        "DFS/BFS Templates",
        "Recursion Tree",
        "Visited Logic",
      ],
      gradient: "from-purple-500 to-violet-500",
      glow: "shadow-purple-500/30",
    },
    {
      id: "expert",
      level: "Expert",
      title: "Competitive Edge & Interview Mastery",
      desc: "Optimize complex problems with DP, greedy, and advanced techniques for contests/interviews.",
      topics: [
        "Dynamic Programming Mindset",
        "DP States & Transitions",
        "Memoization vs Tabulation",
        "1D DP (Fibonacci, House Robber)",
        "2D DP (Grid paths, LCS)",
        "Knapsack Variants",
        "Longest Increasing Subsequence",
        "DP on Strings",
        "DP on Trees",
        "Space Optimization (rolling arrays)",
        "Greedy Algorithm Principles",
        "Interval Scheduling",
        "Activity Selection",
        "Heap / Priority Queue Basics",
        "Top-K Problems",
        "Bit Manipulation Basics",
        "XOR Tricks",
        "Bitmasking",
        "Meet-in-the-Middle",
        "Time Complexity Optimization Tricks",
      ],
      patterns: [
        "DP State Design",
        "Greedy Proof",
        "Heap Usage",
        "Bit Tricks",
      ],
      gradient: "from-orange-500 to-red-500",
      glow: "shadow-orange-500/30",
    },
  ];

  const masterPatterns = [
    { pattern: "Two Pointers", appears: "Arrays, Strings, Linked List" },
    { pattern: "Sliding Window", appears: "Arrays, Strings" },
    { pattern: "Hashing", appears: "Everywhere" },
    { pattern: "Monotonic Stack", appears: "Arrays, Graphs" },
    { pattern: "DFS/BFS", appears: "Trees, Graphs" },
    { pattern: "DP", appears: "Hard problems" },
    { pattern: "Greedy", appears: "Optimization" },
    { pattern: "Binary Search", appears: "Arrays, Answers" },
  ];

  const insights = [
    {
      title: "Patterns > Problems",
      text: "DSA is not about solving 1000 questions. It is about identifying around 50–60 core patterns and reusing them across problems with confidence.",
    },
    {
      title: "Think Before You Code",
      text: "Strong developers spend more time thinking than typing. A clear approach beats fast coding every single time.",
    },
    {
      title: "DSA Trains the Brain",
      text: "DSA sharpens logical thinking, problem decomposition, and patience. These skills transfer directly to system design and real-world engineering.",
    },
    {
      title: "Struggle Is a Feature",
      text: "If a problem feels uncomfortable, it means your brain is learning. Growth happens exactly at the edge of confusion.",
    },
    {
      title: "Brute Force Is Not Bad",
      text: "Start with brute force. Understand it. Then optimize it. Every optimal solution is born from a clear brute-force idea.",
    },
    {
      title: "Consistency Beats Talent",
      text: "Thirty focused minutes daily will outperform random long sessions. DSA rewards discipline, not shortcuts.",
    },
    {
      title: "Platforms Are Just Tools",
      text: "LeetCode, GFG, Codeforces, CodeChef — platforms don’t matter. Your thinking process does.",
    },
    {
      title: "Interviews Test Thinking",
      text: "Interviewers don’t expect perfection. They look for clarity, communication, and structured problem-solving.",
    },
  ];

  const [currentInsight, setCurrentInsight] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 5000); // 5 second gap

    return () => clearInterval(interval);
  }, []);

  const comingSoon = () => {
    alert(
      "🚧 Feature Under Development\n\n" +
        "AI-powered DSA challenges with auto-evaluation & hints are coming soon.\n\n" +
        "For now, please practice using the Coding Playground.\n\n" +
        "Thanks for your patience 🙏"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 pt-24 pb-16">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
          DSA Practice Arena
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          Learn Data Structures & Algorithms through structured levels,
          pattern recognition, and interview-focused practice.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
        {challenges.map((c) => (
          <div
            key={c.id}
            className={`rounded-2xl p-6 border border-zinc-700/50 bg-zinc-900/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${c.glow}`}
          >
            {/* LEVEL */}
            <span
              className={`inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${c.gradient} text-white shadow-md`}
            >
              {c.level}
            </span>
            <h3
              className={`text-xl font-bold mb-2 bg-gradient-to-r ${c.gradient} bg-clip-text text-transparent`}
            >
              {c.title}
            </h3>
            <p className="text-zinc-400 mb-4 text-sm leading-relaxed">{c.desc}</p>
            {/* TOPICS - Compact List */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wide mb-2 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${c.gradient}`}></span>
                Core Topics (15–20)
              </h4>
              <ul className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-900 pr-1 text-xs text-zinc-300">
                {c.topics.map((t, idx) => (
                  <li key={idx} className="flex items-center gap-2 leading-tight">
                    <span className="text-zinc-500">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* PATTERNS */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wide mb-2 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${c.gradient}`}></span>
                Key Patterns
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {c.patterns.map((p, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded-md bg-zinc-700/40 text-zinc-300 border border-zinc-600/30"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            {/* CTA */}
            <button
              onClick={comingSoon}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${c.gradient} hover:opacity-90 transition-all shadow-lg hover:shadow-xl`}
            >
              Start {c.level} Challenges
            </button>
          </div>
        ))}
      </div>

      {/* MASTER PATTERN MAP */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🧠 Final Master Pattern Map
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs bg-zinc-800/50 rounded-xl border border-zinc-700/50">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="p-3 text-left font-semibold text-zinc-300">Pattern</th>
                <th className="p-3 text-left font-semibold text-zinc-300">Appears In</th>
              </tr>
            </thead>
            <tbody>
              {masterPatterns.map((pat, idx) => (
                <tr key={idx} className="border-b border-zinc-700/50 hover:bg-zinc-700/20">
                  <td className="p-3 text-zinc-200">{pat.pattern}</td>
                  <td className="p-3 text-zinc-400">{pat.appears}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REAL TALK SECTION - Animated Single Card */}
      <div className="max-w-2xl mx-auto mb-16">
        <h2 className="text-xl font-bold mb-8 text-center text-purple-400">🔥 Real Talk: DSA Wisdom</h2>
        <div className="relative">
          <div className="p-8 bg-zinc-900/50 rounded-2xl border border-zinc-700/50 backdrop-blur-md shadow-2xl transition-all duration-1000 ease-in-out">
            <h3 className="text-lg font-semibold mb-4 text-zinc-200 animate-fade-in">
              {insights[currentInsight].title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed italic animate-slide-up">
              {insights[currentInsight].text}
            </p>
            <div className="mt-6 flex justify-center space-x-2 text-xs text-zinc-500">
              {insights.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    idx === currentInsight ? "bg-purple-400 scale-125" : "bg-zinc-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-zinc-500 text-sm mt-16">
        Adaptive difficulty, AI hints & instant feedback coming soon 🚀
      </p>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar { height: 4px; width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background-color: theme('colors.zinc.600'); border-radius: 9999px; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
}