"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

export default function ContestDsa() {
  const params = useSearchParams();

  const topic = params.get("topic") || "Arrays";
  const count = Number(params.get("count") || 1);
  const initialLang = params.get("language") || "C++";

  const language =
    initialLang === "C++" ? "cpp" : initialLang.toLowerCase();

  /* ---------------- STATE ---------------- */
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState("");
  const [verdict, setVerdict] = useState("");
  const [scores, setScores] = useState([]);
  const [contestFinished, setContestFinished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentQuestion = questions[currentIndex];

  /* ---------------- FETCH QUESTIONS ---------------- */
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
        if (!res.ok) throw new Error(data.error || "Failed");

        setQuestions(data.questions || []);
        setScores(Array(data.questions?.length || 0).fill(0));
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [topic, count]);

  /* ---------------- SUBMIT ---------------- */
  async function submitSolution() {
    if (!code.trim()) {
      setVerdict("❌ Please write some code before submitting.");
      return;
    }

    try {
      setVerdict("⏳ Evaluating...");
      setError("");

      const res = await fetch("/api/dsa/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion?.description,
          code,
          language: initialLang,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Evaluation failed");

      setVerdict(`${data.verdict}\n\n🧠 Feedback:\n${data.feedback}`);

      setScores((prev) => {
        const updated = [...prev];
        updated[currentIndex] = data.score || 0;
        return updated;
      });
    } catch (err) {
      setVerdict("");
      setError(err.message || "Submission failed");
    }
  }

  /* ---------------- FINAL RESULT ---------------- */
  if (contestFinished) {
    const total = questions.length;
    const score = scores.reduce((a, b) => a + b, 0);
    const accuracy = Math.round((score / total) * 100);

    return (
      <div className="h-dvh bg-zinc-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 text-center">
          <h1 className="text-xl font-bold text-green-400">
            🎉 Contest Completed
          </h1>

          <p className="text-sm text-zinc-300">
            Thanks for giving this quiz. Hope you enjoyed it!
          </p>

          <div className="text-left text-sm space-y-2 mt-4">
            <p>📊 <b>Total Questions:</b> {total}</p>
            <p>✅ <b>Correct Answers:</b> {score}</p>
            <p>🎯 <b>Accuracy:</b> {accuracy}%</p>
          </div>

          <div className="text-sm text-zinc-400 mt-3">
            <b>Improvement Scope:</b>{" "}
            {accuracy < 50 && "Focus on fundamentals and problem understanding."}
            {accuracy >= 50 && accuracy < 80 && "Improve consistency and edge cases."}
            {accuracy >= 80 && "Excellent work! Keep pushing harder."}
          </div>

          <p className="text-xs text-zinc-500 mt-4">
            See you in the next contest 🚀
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- LOADING / ERROR ---------------- */
  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-zinc-950 text-white">
        Generating contest questions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh flex items-center justify-center bg-zinc-950 text-red-400 px-6 text-center">
        ❌ {error}
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="h-dvh bg-zinc-950 text-white flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="shrink-0 p-3 border-b border-zinc-800">
        <h1 className="font-bold text-base">
          {topic} Contest • {count} Question(s)
        </h1>
        <p className="text-xs text-zinc-400">
          Q {currentIndex + 1}/{questions.length} • {initialLang}
        </p>
      </div>

      {/* QUESTION */}
      {currentQuestion && (
        <div className="shrink-0 border-b border-zinc-800 bg-zinc-900/40">
          <div className="max-h-40 overflow-y-auto p-3 space-y-2">
            <h2 className="font-semibold text-sm">
              {currentQuestion.title}
            </h2>
            <p className="text-xs text-zinc-300">
              {currentQuestion.description}
            </p>

            {/* ✅ SAFE EXAMPLE RENDERING */}
            {currentQuestion.examples?.map((ex, i) => (
              <pre
                key={i}
                className="text-[11px] bg-zinc-900 p-2 rounded border border-zinc-800 text-zinc-400 overflow-x-auto"
              >
{typeof ex === "string"
  ? ex
  : `Input: ${ex.input ?? "N/A"}
Output: ${ex.output ?? "N/A"}
${ex.explanation ? `Explanation: ${ex.explanation}` : ""}`}
              </pre>
            ))}
          </div>
        </div>
      )}

      {/* BODY */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">

        {/* EDITOR */}
        <div className="shrink-0 md:flex-1 border-b md:border-b-0 md:border-r border-zinc-800">
          <div className="h-[45vh] md:h-full">
            <Editor
              theme="vs-dark"
              language={language}
              value={code}
              onChange={(v) => setCode(v || "")}
              height="100%"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                },
              }}
            />
          </div>
        </div>

        {/* RESULT */}
        <div className="flex-1 md:w-96 flex flex-col min-h-0">
          <div className="shrink-0 p-3 border-b border-zinc-800 space-y-2">
            <button
              onClick={submitSolution}
              className="w-full py-2 rounded bg-purple-600 hover:bg-purple-500 font-semibold text-sm"
            >
              Submit
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => {
                  setCurrentIndex((i) => i + 1);
                  setCode("");
                  setVerdict("");
                }}
                className="w-full py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs"
              >
                Next Question →
              </button>
            ) : (
              <button
                onClick={() => setContestFinished(true)}
                className="w-full py-2 rounded bg-green-600 hover:bg-green-500 text-xs font-semibold"
              >
                Finish Contest
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <h3 className="font-semibold mb-2 text-sm">Result</h3>

            {verdict ? (
              <pre className="text-xs whitespace-pre-wrap text-zinc-300">
                {verdict}
              </pre>
            ) : (
              <p className="text-xs text-zinc-500">
                Submit your code to see result.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
