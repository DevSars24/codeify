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
      setMobileView("response"); // Switch to response view immediately on mobile
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
    } catch (err: any) {
      setVerdict(err.message || "⚠️ Evaluation failed.");
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

  /* ================= RESPONSE PANEL ================= */
  const ResponsePanel = () => (
    <div className="flex flex-col h-full min-h-0 bg-zinc-900">
      <div className="shrink-0 p-4 border-b border-zinc-800 space-y-3 sticky top-0 bg-zinc-900 z-10">
        <button
          onClick={submitSolution}
          disabled={!code.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 py-2 rounded font-semibold transition-colors disabled:cursor-not-allowed"
        >
          Submit Code
        </button>
        <button
          onClick={() => setFinished(true)}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold transition-colors"
        >
          Finish Contest
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="font-semibold mb-3 text-sm text-zinc-200">
          Kautilya Saarthi
        </h3>
        <div className="text-xs whitespace-pre-wrap text-zinc-300 leading-relaxed">
          {verdict || (
            <span className="text-zinc-500 italic">
              Write and submit your code to get instant feedback and guidance.
            </span>
          )}
        </div>
      </div>
    </div>
  );

  /* ================= FINAL RESULT SCREEN ================= */
  if (finished) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-zinc-950 text-white px-4 py-8">
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
      <div className="min-h-dvh flex items-center justify-center bg-zinc-950 text-white px-4">
        Preparing contest...
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-zinc-950 text-red-400 px-4 text-center">
        ❌ {error || "No question available."}
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="min-h-dvh bg-zinc-950 text-white flex flex-col">
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
      <div className="md:hidden flex border-b border-zinc-800 bg-zinc-900/50">
        {(["editor", "response"] as MobileView[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileView(tab)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              mobileView === tab
                ? "text-purple-400 border-b-2 border-purple-500 bg-zinc-900"
                : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            {tab === "editor" ? "Code" : "Response"}
          </button>
        ))}
      </div>

      {/* QUESTION */}
      <div className="shrink-0 border-b border-zinc-800 bg-zinc-900/40 p-3 max-h-48 overflow-y-auto">
        <h2 className="font-semibold text-sm mb-2">{question.title}</h2>
        <p className="text-xs text-zinc-300 leading-relaxed">
          {question.description}
        </p>
      </div>

      {/* BODY */}
      <div className="flex-1 relative flex md:flex-row overflow-hidden min-h-0">
        {/* Mobile Editor View */}
        <div
          className={`absolute inset-0 z-10 md:hidden transition-opacity duration-300 border border-zinc-800
            ${mobileView === "editor" ? "opacity-100" : "opacity-0 pointer-events-none"}
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
              wordWrap: "on",
            }}
          />
        </div>

        {/* Mobile Response View */}
        <div
          className={`absolute inset-0 z-10 md:hidden transition-opacity duration-300
            ${mobileView === "response" ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <ResponsePanel />
        </div>

        {/* Desktop Editor */}
        <div className="flex-1 border-r border-zinc-800 hidden md:flex min-h-0">
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
              wordWrap: "on",
            }}
          />
        </div>

        {/* Desktop Response */}
        <div className="w-96 hidden md:flex">
          <ResponsePanel />
        </div>
      </div>
    </div>
  );
}