"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

/* ================= TYPES ================= */
type MobileView = "editor" | "response";

type Question = {
  id: number;
  title: string;
  description: string;
};

/* ================= COMPONENT ================= */
export default function ContestDsa() {
  const params = useSearchParams();

  const topic = params.get("topic") || "Arrays";
  const count = Number(params.get("count") || 1);
  const initialLang = params.get("language") || "C++";
  const language =
    initialLang === "C++" ? "cpp" : initialLang.toLowerCase();

  /* ================= STATE ================= */
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState("");
  const [verdict, setVerdict] = useState("");
  const [scores, setScores] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileView, setMobileView] =
    useState<MobileView>("editor");

  const currentQuestion = questions[currentIndex];

  /* ================= FETCH QUESTIONS ================= */
  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/dsa/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, count }),
        });

        const data = await res.json();

        if (!res.ok || !Array.isArray(data.questions)) {
          throw new Error(
            data?.message || data?.error || "Failed to load questions"
          );
        }

        setQuestions(data.questions);
        setScores(new Array(data.questions.length).fill(0));
        setCurrentIndex(0);
      } catch (err: any) {
        setError(err.message || "Unable to load contest.");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [topic, count]);

  /* ================= SUBMIT ================= */
  async function submitSolution() {
    if (!currentQuestion) return;

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
          question: currentQuestion.description,
          code,
          language: initialLang,
        }),
      });

      const data = await res.json();

      setVerdict(`${data.verdict}\n\n${data.feedback}`);

      setScores((prev) => {
        const updated = [...prev];
        updated[currentIndex] = data.score === 1 ? 1 : 0;
        return updated;
      });

      setMobileView("response");
    } catch {
      setVerdict("⚠️ Evaluation failed.");
      setMobileView("response");
    }
  }

  /* ================= FINAL RESULT ================= */
  if (finished) {
    const total = questions.length;
    const correct = scores.reduce((a, b) => a + b, 0);
    const wrong = total - correct;
    const accuracy =
      total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <div className="h-dvh bg-zinc-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 text-center">
          <h1 className="text-xl font-bold text-green-400">
            🎉 Contest Completed
          </h1>

          <div className="text-sm text-zinc-300 space-y-2 text-left">
            <p>📘 Total Questions: <b>{total}</b></p>
            <p>✅ Correct Answers: <b>{correct}</b></p>
            <p>❌ Wrong Answers: <b>{wrong}</b></p>
            <p>🎯 Accuracy: <b>{accuracy}%</b></p>
          </div>

          <p className="text-xs text-zinc-500 mt-4">
            Keep practicing — consistency wins 🚀
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

  if (error) {
    return (
      <div className="h-dvh flex items-center justify-center bg-zinc-950 text-red-400 text-center px-6">
        ❌ {error}
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="h-dvh flex items-center justify-center bg-zinc-950 text-zinc-400">
        No questions available.
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="h-dvh bg-zinc-950 text-white flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="shrink-0 p-3 border-b border-zinc-800">
        <h1 className="font-bold text-sm">
          {topic} Contest • {questions.length} Questions
        </h1>
        <p className="text-xs text-zinc-400">
          Q {currentIndex + 1}/{questions.length} • {initialLang}
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
        <h2 className="font-semibold text-sm">
          {currentQuestion.title}
        </h2>
        <p className="text-xs text-zinc-300 mt-1">
          {currentQuestion.description}
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
          <div className="w-full h-[calc(100dvh-260px)] md:h-full">
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

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => {
                  setCurrentIndex((i) => i + 1);
                  setCode("");
                  setVerdict("");
                  setMobileView("editor");
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
                Finish Contest
              </button>
            )}
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
