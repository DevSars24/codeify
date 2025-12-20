"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

/* ================= TYPES ================= */
type Task = {
  title: string;
  description: string;
};

export default function ContestDev() {
  const params = useSearchParams();

  const category = params.get("category") || "web";
  const level = params.get("level") || "Basic";
  const title = params.get("title") || "Development Practice";

  /* ================= STATE ================= */
  const [tasks, setTasks] = useState<Task[]>([]);
  const [index, setIndex] = useState(0);
  const [code, setCode] = useState("");
  const [verdict, setVerdict] = useState("");
  const [scores, setScores] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH TASKS ================= */
  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        setError("");

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
          throw new Error("Failed to load practice tasks");
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

  /* ================= SAFE CURRENT TASK ================= */
  const currentTask =
    tasks.length > 0 && index < tasks.length ? tasks[index] : null;

  /* ================= SUBMIT ================= */
  async function submit() {
    if (!currentTask) return;

    if (!code.trim()) {
      setVerdict("❌ Write some code first.");
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

      setVerdict(`${data.verdict}\n\n🧠 ${data.feedback}`);

      setScores((prev) => {
        const next = [...prev];
        next[index] = data.score || 0;
        return next;
      });
    } catch {
      setVerdict("⚠️ Evaluation failed.");
    }
  }

  /* ================= FINAL RESULT ================= */
  if (finished) {
    const total = tasks.length;
    const score = scores.reduce((a, b) => a + b, 0);
    const accuracy = Math.round((score / total) * 100);

    return (
      <div className="h-dvh bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center space-y-4">
          <h2 className="text-xl font-bold text-green-400">
            🎉 Practice Completed
          </h2>
          <p className="text-sm text-zinc-400">{title}</p>
          <p>✅ Score: {score}/{total}</p>
          <p>🎯 Accuracy: {accuracy}%</p>
          <p className="text-xs text-zinc-500">
            Keep practicing — consistency beats talent 🚀
          </p>
        </div>
      </div>
    );
  }

  /* ================= LOADING / ERROR ================= */
  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-black text-white">
        Preparing practice session...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh flex items-center justify-center bg-black text-red-400 px-6 text-center">
        ❌ {error}
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="h-dvh flex items-center justify-center bg-black text-zinc-400">
        No tasks available. Please try again later.
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="h-dvh bg-black text-white flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="shrink-0 p-3 border-b border-zinc-800">
        <h1 className="font-bold">{title}</h1>
        <p className="text-xs text-zinc-400">
          {category.toUpperCase()} • {level} • Task {index + 1}/{tasks.length}
        </p>
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">

        {/* QUESTION PANEL */}
        <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-zinc-800 overflow-y-auto p-3">
          <h2 className="font-semibold mb-2">{currentTask.title}</h2>
          <p className="text-sm text-zinc-400 whitespace-pre-wrap">
            {currentTask.description}
          </p>
        </div>

        {/* EDITOR + RESULT */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* EDITOR */}
          <div className="h-[45vh] md:flex-1 border-b border-zinc-800">
          <Editor
  theme="vs-dark"
  language="javascript"
  value={code}
  onChange={(v: string | undefined) => setCode(v ?? "")}
  height="100%"
  options={{
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    scrollbar: {
      vertical: "visible",
      horizontal: "visible",
    },
  }}
/>

          </div>

          {/* RESULT PANEL */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <button
              onClick={submit}
              className="w-full bg-purple-600 py-2 rounded"
            >
              Submit
            </button>

            {index < tasks.length - 1 ? (
              <button
                onClick={() => {
                  setIndex((i) => i + 1);
                  setCode("");
                  setVerdict("");
                }}
                className="w-full bg-zinc-800 py-2 rounded"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => setFinished(true)}
                className="w-full bg-green-600 py-2 rounded"
              >
                Finish Practice
              </button>
            )}

            <pre className="text-xs whitespace-pre-wrap text-zinc-300">
              {verdict || "Submit your code to see feedback."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
