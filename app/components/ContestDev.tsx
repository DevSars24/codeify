"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { EditorProps } from "@monaco-editor/react";

const Editor = dynamic<EditorProps>(() => import("@monaco-editor/react"), { ssr: false });

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
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const syncTheme = () => setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

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

      if (!res.ok || data.error) {
        setVerdict(`⚠️ ${data.error || "Evaluation failed."}`);
        setMobileView("response");
        return;
      }

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
      <div className="h-[100dvh] bg-background text-foreground flex flex-col items-center justify-center overflow-hidden relative">
        {/* Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[500px] h-[300px] bg-violet-500/[0.06] blur-[140px] rounded-full" />
          <div className="absolute right-1/3 bottom-1/4 w-[300px] h-[200px] bg-emerald-500/[0.04] blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-md w-full glass-card p-8 text-center space-y-6 shadow-2xl shadow-black/60 mx-4">
          <h2 className="text-3xl font-black text-frost">
            PRACTICE COMPLETE
          </h2>

          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Performance Metrics</p>
            <div className="text-5xl font-black text-foreground">{accuracy}%</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
              <div className="text-xs text-muted-foreground uppercase">Tasks</div>
              <div className="text-xl font-bold">{total}</div>
            </div>
            <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
              <div className="text-xs text-muted-foreground uppercase">Correct</div>
              <div className="text-xl font-bold text-emerald-400">{correct}</div>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full h-12"
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
      <div className="h-[100dvh] flex items-center justify-center bg-background text-foreground font-mono uppercase tracking-widest animate-pulse">
        Initializing Dev Environment...
      </div>
    );
  }

  if (error || !currentTask) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-background text-destructive font-mono">
        ❌ {error || "No tasks available"}
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="h-[100dvh] bg-background text-foreground flex flex-col overflow-hidden">

      <div className="shrink-0 p-3 border-b border-white/[0.06] bg-[#050508]/80 backdrop-blur-2xl z-20 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-sm">{title}</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {category} • {level} • {index + 1}/{tasks.length}
          </p>
        </div>

        {/* Mobile View Toggles */}
        <div className="flex md:hidden bg-white/[0.03] rounded-lg p-1 border border-white/[0.06]">
          <button onClick={() => setMobileView("editor")} className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${mobileView === 'editor' ? 'bg-white/[0.08] text-foreground' : 'text-muted-foreground'}`}>CODE</button>
          <button onClick={() => setMobileView("response")} className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${mobileView === 'response' ? 'bg-white/[0.08] text-foreground' : 'text-muted-foreground'}`}>RESULT</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">

        <div className={`md:w-1/2 border-b md:border-b-0 md:border-r border-white/[0.06] bg-[#050508]/40 flex flex-col ${mobileView === 'response' ? 'hidden md:flex' : 'hidden md:flex'}`}>
          <div className="p-6 overflow-y-auto">
            <h2 className="font-bold text-lg mb-4 text-violet-400">{currentTask.title}</h2>
            <div className="prose prose-sm dark:prose-invert text-muted-foreground">
              {currentTask.description}
            </div>
          </div>
        </div>

        {/* Mobile Question Overlay */}
        <div className={`md:hidden p-4 bg-[#050508] border-b border-white/[0.06] ${mobileView === 'editor' ? 'block' : 'hidden'} max-h-[30vh] overflow-y-auto shrink-0`}>
          <h2 className="font-bold text-sm text-violet-400 mb-1">{currentTask.title}</h2>
          <p className="text-xs text-muted-foreground">{currentTask.description}</p>
        </div>

        <div className="flex-1 flex flex-col min-h-0 relative">

          <div className={`flex-1 relative ${mobileView === 'editor' ? 'block' : 'hidden md:block'}`}>
            <Editor
              theme={theme === "dark" ? "vs-dark" : "vs"}
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
          <div className={`flex-1 p-6 bg-[#050508] ${mobileView === 'response' ? 'block' : 'hidden md:hidden'}`}>
            <div className="h-full flex flex-col justify-center items-center text-center">
              <div className="text-4xl mb-4">{verdict.includes("❌") ? "❌" : verdict.includes("⚠️") ? "⚠️" : "⚡"}</div>
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono bg-white/[0.02] p-4 rounded-xl border border-white/[0.06] w-full">
                {verdict || "Ready to evaluate."}
              </pre>
              <button onClick={() => setMobileView("editor")} className="mt-6 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Back to Code</button>
            </div>
          </div>

          <div className="bg-[#050508] border-t border-white/[0.06] p-3 md:p-4 shrink-0 flex gap-3 z-50">
            <button
              onClick={submit}
              className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
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
                className="flex-1 bg-white/[0.04] hover:bg-white/[0.07] text-foreground py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 border border-white/[0.06]"
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

          {/* Desktop Feedback Area */}
          <div className={`hidden md:block absolute bottom-20 right-4 w-80 glass-card p-4 shadow-2xl shadow-black/60 transition-all ${verdict ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">System Output</h3>
            <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap">{verdict}</pre>
          </div>

        </div>
      </div>
    </div>
  );
}
