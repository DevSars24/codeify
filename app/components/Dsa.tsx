"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

/* ================= TYPES ================= */
type Question = {
  id: number;
  title: string;
  description: string;
};

type MobileView = "editor" | "response";

/* ================= COMPONENT ================= */
export default function ContestDsa() {
  const params = useSearchParams();

  // 🔒 HARD LOCK — single question contest
  const topic = params.get("topic") || "Arrays";
  const initialLang = params.get("language") || "C++";
  const language =
    initialLang === "C++" ? "cpp" : initialLang.toLowerCase();

  /* ================= STATE ================= */
  const [question, setQuestion] = useState<Question | null>(null);
  const [code, setCode] = useState("");
  const [verdict, setVerdict] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileView, setMobileView] =
    useState<MobileView>("editor");

  /* ================= FETCH SINGLE QUESTION ================= */
  useEffect(() => {
    async function fetchQuestion() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/dsa/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, count: 1 }),
        });

        const data = await res.json();

        if (!res.ok || !Array.isArray(data.questions) || !data.questions[0]) {
          throw new Error("Failed to load question");
        }

        setQuestion(data.questions[0]);
      } catch (err: any) {
        setError(err.message || "Unable to load contest.");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();
  }, [topic]);

  /* ================= SUBMIT SOLUTION ================= */
  async function submitSolution() {
    if (!question) return;

    if (!code.trim()) {
      setVerdict("❌ Please write some code before submitting.");
      setMobileView("response");
      return;
    }

    try {
      setVerdict("⏳ Evaluating...");

      const res = await fetch("/api/dsa/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.description,
          code,
          language: initialLang,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Evaluation failed");
      }

      setVerdict(`${data.verdict}\n\n${data.feedback}`);
      setScore(data.score === 1 ? 1 : 0);
      setMobileView("response");
    } catch (err: any) {
      setVerdict(err.message || "⚠️ Evaluation failed.");
      setMobileView("response");
    }
  }

  /* ================= SAVE RESULT ON FINISH ================= */
  useEffect(() => {
    if (!finished || !question) return;

    async function saveContest() {
      try {
        await fetch("/api/contest/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "temp-user", // 🔁 replace with Clerk later
            topic,
            total: 1,
            correct: score,
            accuracy: score === 1 ? 100 : 0,
            language: initialLang,
          }),
        });
      } catch (err) {
        console.error("Failed to save contest", err);
      }
    }

    saveContest();
  }, [finished, score, topic, initialLang, question]);

  /* ================= FINAL RESULT SCREEN ================= */
  if (finished) {
    return (
      <div className="h-dvh flex items-center justify-center bg-zinc-950 text-white px-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 text-center">
          <h1 className="text-xl font-bold text-green-400">
            🎉 Contest Completed
          </h1>

          <div className="text-sm text-zinc-300 space-y-2 text-left">
            <p>📘 Total Questions: <b>1</b></p>
            <p>✅ Correct Answers: <b>{score}</b></p>
            <p>❌ Wrong Answers: <b>{score === 1 ? 0 : 1}</b></p>
            <p>🎯 Accuracy: <b>{score === 1 ? 100 : 0}%</b></p>
          </div>

          <p className="text-xs text-zinc-500 mt-4">
            Result saved successfully 🚀
          </p>
        </div>
      </div>
    );
  }

  /* ================= LOADING / ERROR ================= */
  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-zinc-950 text-white">
        Preparing contest...
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="h-dvh flex items-center justify-center bg-zinc-950 text-red-400 px-6 text-center">
        ❌ {error || "No question available."}
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="h-dvh bg-zinc-950 text-white flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="shrink-0 p-3 border-b border-zinc-800">
        <h1 className="font-bold text-sm">
          {topic} Contest • 1 Question
        </h1>
        <p className="text-xs text-zinc-400">
          Language • {initialLang}
        </p>
      </div>

      {/* MOBILE TABS */}
      <div className="md:hidden flex border-b border-zinc-800">
        {(["editor", "response"] as MobileView[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileView(tab)}
            className={`flex-1 py-3 text-sm font-semibold ${
              mobileView === tab
                ? "text-purple-400 border-b-2 border-purple-500"
                : "text-zinc-400"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* QUESTION */}
      <div className="shrink-0 border-b border-zinc-800 bg-zinc-900/40 p-3">
        <h2 className="font-semibold text-sm">{question.title}</h2>
        <p className="text-xs text-zinc-300 mt-1">
          {question.description}
        </p>
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">

        {/* EDITOR */}
        <div
          className={`md:flex-1 border-b md:border-b-0 md:border-r border-zinc-800
            ${mobileView === "response" ? "hidden md:flex" : "flex"}
          `}
        >
          <Editor
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(v: string | undefined) => setCode(v ?? "")}

            height="100%"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              automaticLayout: true,
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* RESPONSE */}
        <div
          className={`md:w-96 flex flex-col min-h-0
            ${mobileView === "editor" ? "hidden md:flex" : "flex"}
          `}
        >
          <div className="shrink-0 p-4 border-b border-zinc-800 space-y-2">
            <button
              onClick={submitSolution}
              className="w-full bg-purple-600 py-2 rounded font-semibold"
            >
              Submit
            </button>

            <button
              onClick={() => setFinished(true)}
              className="w-full bg-green-600 py-2 rounded"
            >
              Finish Contest
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="font-semibold mb-2 text-sm">
              Kautilya Saarthi
            </h3>
            <pre className="text-xs whitespace-pre-wrap text-zinc-300">
              {verdict || "Submit your code to receive guidance."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
