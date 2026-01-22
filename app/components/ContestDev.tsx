"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

/* ================= TYPES ================= */
type Task = {
  title: string;
  description: string;
};

type MobileView = "editor" | "response";

/* ================= COMPONENT ================= */
export default function ContestDev() {
  const params = useSearchParams();

  const category = params.get("category") || "web";
  const level = params.get("level") || "Basic";
  const title = params.get("title") || "Development Practice";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [index, setIndex] = useState(0);
  const [code, setCode] = useState("");
  const [verdict, setVerdict] = useState("");
  const [scores, setScores] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileView, setMobileView] =
    useState<MobileView>("editor");

  const currentTask =
    tasks.length > 0 && index < tasks.length ? tasks[index] : null;

  /* ================= FETCH ================= */
  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        const res = await fetch("/api/dev/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            level,
            title,
            count: 5,
          }),
        });

        const data = await res.json();

        if (!res.ok || !Array.isArray(data.tasks)) {
          throw new Error("Failed to load tasks");
        }

        setTasks(data.tasks);
        setScores(new Array(data.tasks.length).fill(0));
        setIndex(0);
      } catch (e: any) {
        setError(e.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [category, level, title]);

  /* ================= SUBMIT ================= */
  async function submit() {
    if (!currentTask) return;

    if (!code.trim()) {
      setVerdict("❌ Write some code first.");
      setMobileView("response");
      return;
    }

    try {
      setVerdict("⏳ Evaluating...");
      const res = await fetch("/api/dev/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: currentTask.description,
          code,
        }),
      });

      const data = await res.json();

      setVerdict(`${data.verdict}\n\n${data.feedback}`);
      setScores((prev: number[]) => {
        const next = [...prev];
        next[index] = data.score === 1 ? 1 : 0;
        return next;
      });

      setMobileView("response");
    } catch {
      setVerdict("⚠️ Evaluation failed.");
      setMobileView("response");
    }
  }

  /* ================= FINAL RESULT ================= */
  if (finished) {
    const total = tasks.length;
    const correct = scores.reduce((a: number, b: number) => a + b, 0);
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <div className="h-[100dvh] bg-black text-white flex flex-col items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 opacity-[0.05]" />

        {/* Infinite Scroll Text */}
        <div className="absolute inset-0 flex flex-col gap-8 opacity-20 pointer-events-none select-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="whitespace-nowrap flex gap-8 animate-marquee text-6xl font-black uppercase text-zinc-800">
              <span>Mission Complete</span>
              <span>System Updated</span>
              <span>Protocol Secured</span>
              <span>Code Validated</span>
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-md w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
            PRACTICE COMPLETE
          </h2>

          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Performance Metrics</p>
            <div className="text-5xl font-black text-white">{accuracy}%</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-black/40 rounded-xl border border-zinc-800">
              <div className="text-xs text-zinc-500 uppercase">Tasks</div>
              <div className="text-xl font-bold">{total}</div>
            </div>
            <div className="p-4 bg-black/40 rounded-xl border border-zinc-800">
              <div className="text-xs text-zinc-500 uppercase">Correct</div>
              <div className="text-xl font-bold text-green-400">{correct}</div>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
          >
            Restart Protocol
          </button>
        </div>
      </div>
    );
  }

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-black text-white font-mono uppercase tracking-widest animate-pulse">
        Initializing Dev Environment...
      </div>
    );
  }

  if (error || !currentTask) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-black text-red-500 font-mono">
        ❌ {error || "No tasks available"}
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="h-[100dvh] bg-black text-white flex flex-col overflow-hidden">

      <div className="shrink-0 p-3 border-b border-zinc-800 bg-black/50 backdrop-blur z-20 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-sm">{title}</h1>
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider">
            {category} • {level} • {index + 1}/{tasks.length}
          </p>
        </div>

        {/* Mobile View Toggles */}
        <div className="flex md:hidden bg-zinc-900 rounded-lg p-1 border border-zinc-800">
          <button onClick={() => setMobileView("editor")} className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${mobileView === 'editor' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>CODE</button>
          <button onClick={() => setMobileView("response")} className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${mobileView === 'response' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>RESULT</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">

        {/* TASK DESCRIPTION (Desktop: Left, Mobile: Overlay/Hidden based on logic, but here we can keep it simple or split) */}
        {/* For this specific requirement, sticking to standard split but making it responsive */}

        <div className={`md:w-1/2 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-900/20 flex flex-col ${mobileView === 'response' ? 'hidden md:flex' : 'hidden md:flex'}`}>
          {/* Note: In mobile 'editor' view, we might want to see description briefly? 
               Lets make a collapsible or small header. For now, sticking to standard desktop split.
               Mobile behavior: Editor takes full screen. Task description is in a modal or top? 
               Let's put Task Description ABOVE editor in mobile if space permits or toggle.
               Simplification: Mobile View 'Editor' shows Editor. 'Response' shows feedback. 
               Where is the question? Let's add it to Top or a separate tab.
           */}
          <div className="p-6 overflow-y-auto">
            <h2 className="font-bold text-lg mb-4 text-purple-400">{currentTask.title}</h2>
            <div className="prose prose-invert prose-sm text-zinc-300">
              {currentTask.description}
            </div>
          </div>
        </div>

        {/* Mobile Question Overlay (only visible in mobile editor mode if needed, or simple top block) */}
        <div className={`md:hidden p-4 bg-zinc-900 border-b border-zinc-800 ${mobileView === 'editor' ? 'block' : 'hidden'} max-h-[30vh] overflow-y-auto shrink-0`}>
          <h2 className="font-bold text-sm text-purple-400 mb-1">{currentTask.title}</h2>
          <p className="text-xs text-zinc-300">{currentTask.description}</p>
        </div>

        <div className="flex-1 flex flex-col min-h-0 relative">

          <div className={`flex-1 relative ${mobileView === 'editor' ? 'block' : 'hidden md:block'}`}>
            <Editor
              theme="vs-dark"
              language="javascript"
              value={code}
              onChange={(v: string | undefined) => setCode(v ?? "")}
              options={{
                minimap: { enabled: false },
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                fontSize: 14,
                fontFamily: "JetBrains Mono"
              }}
            />
          </div>

          {/* Feedback / Result View (Mobile) */}
          <div className={`flex-1 p-6 bg-zinc-900 ${mobileView === 'response' ? 'block' : 'hidden md:hidden'}`}>
            <div className="h-full flex flex-col justify-center items-center text-center">
              <div className="text-4xl mb-4">{verdict.includes("❌") ? "❌" : verdict.includes("⚠️") ? "⚠️" : "⚡"}</div>
              <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono bg-black p-4 rounded-xl border border-zinc-800 w-full">
                {verdict || "Ready to evaluate."}
              </pre>
              <button onClick={() => setMobileView("editor")} className="mt-6 text-xs font-bold uppercase tracking-widest text-zinc-500">Back to Code</button>
            </div>
          </div>

          <div className="bg-black border-t border-zinc-800 p-3 md:p-4 shrink-0 flex gap-3 z-50">
            <button
              onClick={submit}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              Run Code
            </button>

            {index < tasks.length - 1 ? (
              <button
                onClick={() => {
                  setIndex((i: number) => i + 1);
                  setCode("");
                  setVerdict("");
                  setMobileView("editor");
                }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                Next Task
              </button>
            ) : (
              <button
                onClick={() => setFinished(true)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                Finish
              </button>
            )}
          </div>

          {/* Desktop Feedback Area (Toast styled or bottom overlay) */}
          <div className={`hidden md:block absolute bottom-20 right-4 w-80 bg-zinc-900/90 backdrop-blur border border-zinc-700 p-4 rounded-xl shadow-2xl transition-all ${verdict ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <h3 className="text-xs font-bold uppercase text-zinc-500 mb-2">System Output</h3>
            <pre className="text-xs font-mono text-zinc-200 whitespace-pre-wrap">{verdict}</pre>
          </div>

        </div>
      </div>
    </div>
  );
}
