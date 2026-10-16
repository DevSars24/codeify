"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { EditorProps } from "@monaco-editor/react";
import Select from "react-select";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore - style modules are shipped without complete named typings.
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import RingLoader from "react-spinners/RingLoader";
import { Sparkles, Code2, Play, Cpu, CheckCircle2, RefreshCw } from "lucide-react";

const Editor = dynamic<EditorProps>(() => import("@monaco-editor/react"), { ssr: false });

/* -------------------- 11 MAJOR PROGRAMMING LANGUAGES -------------------- */
const options = [
  { value: "javascript", label: "JavaScript (Node.js)" },
  { value: "python", label: "Python 3" },
  { value: "java", label: "Java 21" },
  { value: "cpp", label: "C++ (g++ 14)" },
  { value: "c", label: "C (gcc 11)" },
  { value: "typescript", label: "TypeScript" },
  { value: "csharp", label: "C# (.NET)" },
  { value: "go", label: "Go 1.22" },
  { value: "rust", label: "Rust (cargo)" },
  { value: "php", label: "PHP 8.3" },
  { value: "bash", label: "Bash / Shell" },
];

/* -------------------- STARTER TEMPLATES (11 LANGUAGES) -------------------- */
const STARTER_CODES: Record<string, string> = {
  javascript: `// JavaScript Playground (Groq + Gemini AI Review)
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

console.log(twoSum([2, 7, 11, 15], 9));`,

  python: `# Python 3 Playground (Groq + Gemini AI Review)
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))`,

  java: `// Java 21 Playground (Groq + Gemini AI Review)
import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9)));
    }
}`,

  cpp: `// C++ Playground (Groq + Gemini AI Review)
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(const vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    auto res = twoSum({2, 7, 11, 15}, 9);
    for (int idx : res) cout << idx << " ";
    return 0;
}`,

  c: `// C Playground (Groq + Gemini AI Review)
#include <stdio.h>

void solve() {
    int arr[] = {2, 7, 11, 15};
    int target = 9;
    int size = sizeof(arr) / sizeof(arr[0]);

    for (int i = 0; i < size; i++) {
        for (int j = i + 1; j < size; j++) {
            if (arr[i] + arr[j] == target) {
                printf("Indices: %d, %d\\n", i, j);
                return;
            }
        }
    }
}

int main() {
    solve();
    return 0;
}`,

  typescript: `// TypeScript Playground (Groq + Gemini AI Review)
interface SolutionResult {
  indices: [number, number] | [];
  iterations: number;
}

function findPair(numbers: number[], target: number): SolutionResult {
  const map = new Map<number, number>();
  for (let i = 0; i < numbers.length; i++) {
    const diff = target - numbers[i];
    if (map.has(diff)) {
      return { indices: [map.get(diff)!, i], iterations: i + 1 };
    }
    map.set(numbers[i], i);
  }
  return { indices: [], iterations: numbers.length };
}

console.log(findPair([2, 7, 11, 15], 9));`,

  csharp: `// C# (.NET) Playground (Groq + Gemini AI Review)
using System;
using System.Collections.Generic;

public class Solution {
    public static int[] TwoSum(int[] nums, int target) {
        var map = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++) {
            int complement = target - nums[i];
            if (map.ContainsKey(complement)) {
                return new int[] { map[complement], i };
            }
            map[nums[i]] = i;
        }
        return Array.Empty<int>();
    }

    public static void Main() {
        var res = TwoSum(new int[] { 2, 7, 11, 15 }, 9);
        Console.WriteLine(string.Join(", ", res));
    }
}`,

  go: `// Go Playground (Groq + Gemini AI Review)
package main

import "fmt"

func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if idx, ok := seen[complement]; ok {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return nil
}

func main() {
    fmt.Println(twoSum([]int{2, 7, 11, 15}, 9))
}`,

  rust: `// Rust Playground (Groq + Gemini AI Review)
use std::collections::HashMap;

fn two_sum(nums: &[i32], target: i32) -> Option<(usize, usize)> {
    let mut map = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        let complement = target - num;
        if let Some(&prev_idx) = map.get(&complement) {
            return Some((prev_idx, i));
        }
        map.insert(num, i);
    }
    None
}

fn main() {
    let result = two_sum(&[2, 7, 11, 15], 9);
    println!("Indices: {:?}", result);
}`,

  php: `<?php
// PHP 8.3 Playground (Groq + Gemini AI Review)
function twoSum(array $nums, int $target): array {
    $seen = [];
    foreach ($nums as $i => $num) {
        $complement = $target - $num;
        if (isset($seen[$complement])) {
            return [$seen[$complement], $i];
        }
        $seen[$num] = $i;
    }
    return [];
}

print_r(twoSum([2, 7, 11, 15], 9));
?>`,

  bash: `#!/bin/bash
# Bash / Shell Playground (Groq + Gemini AI Review)
NUMS=(2 7 11 15)
TARGET=9

echo "Array: \${NUMS[*]}"
echo "Target: \$TARGET"

for ((i=0; i<\${#NUMS[@]}; i++)); do
  for ((j=i+1; j<\${#NUMS[@]}; j++)); do
    if (( NUMS[i] + NUMS[j] == TARGET )); then
      echo "Match found at indices: \$i, \$j"
      exit 0
    fi
  done
done`,
};

/* -------------------- SELECT STYLES -------------------- */
const customStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderColor: "rgba(255, 255, 255, 0.08)",
    color: "#eaeaf0",
    borderRadius: 8,
    boxShadow: "none",
    "&:hover": {
      borderColor: "rgba(255, 255, 255, 0.16)",
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#000000",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.9)",
    borderRadius: 8,
    zIndex: 9999,
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#eaeaf0",
    fontSize: "13px",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "rgba(255, 255, 255, 0.08)" : "transparent",
    color: state.isFocused ? "#ffffff" : "#c4c4d4",
    fontSize: "13px",
    cursor: "pointer",
  }),
};

/* -------------------- MARKDOWN RENDERER -------------------- */
const MarkdownRenderer = ({ children }: { children: string }) => (
  <Markdown
    components={{
      code({ inline, className, children }: any) {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            customStyle={{
              borderRadius: 8,
              padding: 14,
              marginBottom: 12,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(0, 0, 0, 0.5)",
              fontSize: "13px",
            }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <code className="bg-white/[0.06] border border-white/[0.1] px-1.5 py-0.5 rounded text-xs font-mono text-violet-300">
            {children}
          </code>
        );
      },
    }}
  >
    {children}
  </Markdown>
);

/* -------------------- PLAYGROUND COMPONENT -------------------- */
export default function Home() {
  const [language, setLanguage] = useState(options[0]);
  const [code, setCode] = useState(STARTER_CODES["javascript"]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCmd, setActiveCmd] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"editor" | "response">("editor");
  const [providerInfo, setProviderInfo] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleLanguageChange = (selected: any) => {
    if (!selected) return;
    setLanguage(selected);
    const starter = STARTER_CODES[selected.value] || `// ${selected.label} Playground\n`;
    setCode(starter);
  };

  async function runAICommand(cmd: string) {
    if (!code.trim()) {
      alert("Please enter code first");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setActiveCmd(cmd);
    setResponse("");
    setProviderInfo(null);
    setMobileView("response");

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${cmd.toUpperCase()} this ${language.value} code:\n\n${code}`,
          stream: true,
        }),
        signal: controller.signal,
      });

      const provider = res.headers.get("X-Provider") || "Groq Primary";
      const model = res.headers.get("X-Model") || "Qwen 27B";
      setProviderInfo(`${provider.toUpperCase()} (${model})`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "AI Service unavailable");
      }

      if (!res.body) throw new Error("Response body missing");

      setLoading(false);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setResponse((prev) => prev + chunk);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setResponse(`⚠️ **AI Error:** ${err.message}\n\nPlease check your prompt or retry.`);
    } finally {
      setLoading(false);
      setActiveCmd(null);
      abortControllerRef.current = null;
    }
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-4.5rem)] bg-black text-foreground overflow-hidden">
      {/* MOBILE TABS */}
      <div className="md:hidden flex shrink-0 border-b border-white/[0.08] bg-black">
        {["editor", "response"].map((tab) => (
            <button
            key={tab}
            onClick={() => setMobileView(tab as any)}
            className={`flex-1 py-3 text-xs font-mono font-semibold tracking-wider transition-colors ${
              mobileView === tab
                ? "text-white border-b-2 border-white bg-white/[0.05]"
                : "text-muted-foreground"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TOP CONTROLS & COMMANDS */}
      <div className="shrink-0 p-3 sm:p-4 border-b border-white/[0.06] bg-black flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-56 sm:w-64">
            <Select
              value={language}
              onChange={handleLanguageChange}
              options={options}
              styles={customStyles}
              aria-label="Select Programming Language"
            />
          </div>
          <button
            onClick={() => {
              const starter = STARTER_CODES[language.value] || "";
              setCode(starter);
            }}
            title="Reset code template"
            className="p-2 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-muted-foreground hover:text-white transition-all text-xs flex items-center gap-1"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* AI ACTIONS */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: "review", label: "Review Code", icon: <CheckCircle2 size={13} /> },
            { id: "explain", label: "Explain Logic", icon: <Code2 size={13} /> },
            { id: "improve", label: "Optimize (O(N))", icon: <Sparkles size={13} /> },
            { id: "bugs", label: "Detect Bugs", icon: <Cpu size={13} /> },
            { id: "fix", label: "Auto Fix", icon: <Play size={13} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => runAICommand(item.id)}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                activeCmd === item.id
                  ? "border-violet-500 bg-violet-500/20 text-violet-200 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                  : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.15] text-foreground"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN DUAL PANE: EDITOR & AI STREAM */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-3 p-3 sm:p-4 overflow-hidden">
        {/* MONACO CODE EDITOR */}
        <div
          className={`flex-1 min-h-0 ${
            mobileView === "response" ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="flex-1 min-h-0 glass-card overflow-hidden flex flex-col border border-white/[0.07]">
            <div className="px-4 py-2 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                {language.label} Editor
              </span>
              <span className="text-[11px] opacity-70">11 Languages Active</span>
            </div>

            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                theme="vs-dark"
                language={language.value === "csharp" ? "csharp" : language.value}
                value={code}
                onChange={(v: string | undefined) => setCode(v || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 12 },
                  smoothScrolling: true,
                  renderLineHighlight: "all",
                }}
              />
            </div>
          </div>
        </div>

        {/* AI RESPONSE PANE */}
        <div
          className={`flex-1 min-h-0 glass-card flex flex-col border border-white/[0.07] overflow-hidden ${
            mobileView === "editor" ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between font-mono text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-violet-400" />
              <span className="font-semibold text-foreground">AI Output Stream</span>
              {providerInfo && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-300">
                  {providerInfo}
                </span>
              )}
            </div>
            {loading && (
              <span className="text-[11px] text-violet-400 flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                Generating response...
              </span>
            )}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4">
            {loading && !response ? (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center gap-3 text-muted-foreground text-xs font-mono">
                <RingLoader color="rgba(168, 85, 247, 0.8)" size={48} />
                <p>Routing through multi-key Groq pool with Gemini fallback...</p>
              </div>
            ) : response ? (
              <div className="prose prose-invert max-w-none text-sm text-foreground leading-relaxed">
                <MarkdownRenderer>{response}</MarkdownRenderer>
              </div>
            ) : (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                <div className="w-12 h-12 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center mb-3">
                  <Code2 size={24} className="text-muted-foreground/60" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">
                  Ready for AI Code Review
                </h4>
                <p className="text-xs max-w-sm leading-relaxed">
                  Select any of the 11 supported languages, edit your code, and click any action above (Review, Explain, Optimize, Detect Bugs, Fix).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
