"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Code2,
  Sparkles,
  ArrowRight,
  Terminal,
  Copy,
  Check,
  Zap,
  Cpu,
  Layers,
} from "lucide-react";

interface LanguageInfo {
  id: string;
  name: string;
  badge: string;
  tag: string;
  sampleCode: string;
}

const LANGUAGES: LanguageInfo[] = [
  {
    id: "javascript",
    name: "JavaScript",
    badge: "Node.js 20",
    tag: "High Octane",
    sampleCode: `// JavaScript (Node.js) - Instant AI Simulation
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log("Result:", twoSum([2, 7, 11, 15], 9)); // -> [0, 1]`,
  },
  {
    id: "python",
    name: "Python 3",
    badge: "CPython 3.12",
    tag: "Popular",
    sampleCode: `# Python 3 - Instant AI Simulation & Complexity
def max_subarray(nums: list[int]) -> int:
    cur_sum = max_sum = nums[0]
    for x in nums[1:]:
        cur_sum = max(x, cur_sum + x)
        max_sum = max(max_sum, cur_sum)
    return max_sum

print("Kadane's Result:", max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])) # 6`,
  },
  {
    id: "cpp",
    name: "C++",
    badge: "g++ 14 (C++23)",
    tag: "Competitive",
    sampleCode: `// C++23 - High Performance Algorithmic Sandbox
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::vector<int> arr = {10, 20, 30, 40, 50};
    long long sum = std::accumulate(arr.begin(), arr.end(), 0LL);
    std::cout << "Optimized O(N) Sum: " << sum << std::endl;
    return 0;
}`,
  },
  {
    id: "java",
    name: "Java 21",
    badge: "OpenJDK 21",
    tag: "Enterprise",
    sampleCode: `// Java 21 - Virtual Threads & Pattern Matching
import java.util.*;

public class Main {
    public static void main(String[] args) {
        List<String> list = List.of("Code", "Saarthi", "Playground");
        list.stream()
            .map(String::toUpperCase)
            .forEach(System.out::println);
    }
}`,
  },
  {
    id: "rust",
    name: "Rust",
    badge: "Cargo 1.82",
    tag: "Memory Safe",
    sampleCode: `// Rust - Memory Safe Zero-Cost Abstraction
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    let squares: Vec<i32> = numbers.into_iter().map(|x| x * x).collect();
    println!("Processed vector: {:?}", squares);
}`,
  },
  {
    id: "go",
    name: "Go",
    badge: "Go 1.23",
    tag: "Concurrency",
    sampleCode: `// Go 1.23 - Goroutines & Channels
package main
import "fmt"

func main() {
    ch := make(chan string)
    go func() { ch <- "Simulated Groq LPU response" }()
    fmt.Println("Received:", <-ch)
}`,
  },
  {
    id: "typescript",
    name: "TypeScript",
    badge: "TS 5.6",
    tag: "Type Safe",
    sampleCode: `// TypeScript - Strict Types & Next-Gen JS
interface ProblemSolver<T> {
  solve(input: T[]): T;
}

const findMax: ProblemSolver<number> = {
  solve: (items) => Math.max(...items)
};

console.log("Max item:", findMax.solve([42, 19, 88, 5]));`,
  },
  {
    id: "c",
    name: "C",
    badge: "gcc 13",
    tag: "Low Level",
    sampleCode: `// C (gcc 13) - Bare Metal Memory Efficiency
#include <stdio.h>

int main() {
    int arr[] = {3, 1, 4, 1, 5, 9};
    int len = sizeof(arr) / sizeof(arr[0]);
    printf("Array elements count: %d\\n", len);
    return 0;
}`,
  },
  {
    id: "csharp",
    name: "C#",
    badge: ".NET 9",
    tag: "Modern C#",
    sampleCode: `// C# (.NET 9) - Top-level Statements
var items = new[] { "Dynamic", "Simulation", "AI" };
var result = string.Join(" · ", items.Select(x => x.ToUpper()));
Console.WriteLine($"Result: {result}");`,
  },
  {
    id: "php",
    name: "PHP 8.3",
    badge: "PHP 8.3",
    tag: "Web Core",
    sampleCode: `<?php
// PHP 8.3 Playground
$data = ["Groq", "Gemini", "LPU", "CodeSaarthi"];
$formatted = array_map(fn($item) => "#{$item}", $data);
echo implode(" | ", $formatted) . PHP_EOL;
?>`,
  },
  {
    id: "bash",
    name: "Bash",
    badge: "GNU bash 5.2",
    tag: "DevOps",
    sampleCode: `#!/usr/bin/env bash
# Shell Scripting & Command Simulation
echo "Initializing CodeSaarthi sandbox..."
echo "Groq LPU AI Simulation: ONLINE"
echo "Testcases passed: 15/15"`,
  },
];

export default function PlaygroundPreviewSection() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<LanguageInfo>(LANGUAGES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedLang.sampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="playground" className="py-20 sm:py-24 px-4 sm:px-6 border-t border-white/[0.08] relative bg-black/40">
      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* Header with Free Pinned Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="badge-luminous inline-flex items-center gap-2 px-3 py-1 text-[#7C786F] text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
              <span>PINNED FEATURE · NO SIGNUP NEEDED</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-[#EDEAE3]">
              Try the 11-Language Playground
            </h2>
            <p className="text-sm sm:text-base text-[#A8A49B] leading-[1.6]">
              Test any programming language, preview execution, and launch the interactive coding editor instantly.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => router.push("/home")}
              className="btn-primary w-full sm:w-auto text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Code2 size={16} />
              <span>Launch Full Playground</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Horizontal Language Selection Tabs (Mobile Responsive & Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2 flex-nowrap">
          {LANGUAGES.map((lang) => {
            const isActive = selectedLang.id === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? "bg-white/10 text-[#EDEAE3] border border-[#E8A33D]/60"
                    : "bg-white/[0.02] text-[#7C786F] border border-white/[0.08] hover:bg-white/[0.06] hover:text-[#EDEAE3]"
                }`}
              >
                <span>{lang.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                  isActive ? "bg-white/20 text-[#EDEAE3]" : "bg-white/[0.04] text-[#7C786F]"
                }`}>
                  {lang.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Glassmorphic Code Preview Container */}
        <div className="glass-card-glow overflow-hidden border border-white/[0.1] rounded-2xl bg-black/70 backdrop-blur-2xl shadow-2xl shadow-black/80">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#5E5B54]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#5E5B54]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#5E5B54]" />
              </div>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-2 text-xs font-mono text-[#7C786F]">
                <Terminal size={14} className="text-[#7C786F]" />
                <span>playground.{selectedLang.id === "python" ? "py" : selectedLang.id === "rust" ? "rs" : selectedLang.id === "go" ? "go" : selectedLang.id === "cpp" ? "cpp" : "js"}</span>
                <span className="text-[10px] text-[#7C786F]">({selectedLang.badge})</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.03] text-[#7C786F] border border-white/[0.08] flex items-center gap-1.5">
                <span>Sub-200ms LPU</span>
              </span>
              <button
                onClick={handleCopy}
                className="btn-secondary h-8 px-2.5 py-1 text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                title="Copy code"
              >
                {copied ? <Check size={13} className="text-[#7FB08A]" /> : <Copy size={13} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Code Body with Deep Obsidian Contrast for High Readability */}
          <div className="p-5 overflow-x-auto bg-[#04060b]/92 border-y border-white/[0.06] max-w-full">
            <pre className="font-mono text-xs sm:text-sm text-[#EDEAE3] leading-relaxed">
              <code>{selectedLang.sampleCode}</code>
            </pre>
          </div>

          {/* Bottom Interactive Bar */}
          <div className="px-5 py-4 border-t border-white/[0.08] bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#7C786F]">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#7C786F]" />
                <span>AI Simulation Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu size={13} className="text-[#7C786F]" />
                <span>Zero Environment Setup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers size={13} className="text-[#7C786F]" />
                <span>Monaco Engine</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/home"
                className="btn-primary w-full sm:w-auto text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Open in Playground ({selectedLang.name})</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
