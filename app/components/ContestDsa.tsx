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

/* ================= COMPONENT ================= */
export default function ContestDsa() {
  const params = useSearchParams();

  const topic = params.get("topic") || "Arrays";
  const count = Number(params.get("count") || 1);
  const initialLang = params.get("language") || "C++";
  const editorLang = initialLang === "C++" ? "cpp" : initialLang.toLowerCase();

  /* ================= STATE ================= */
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState<string>("");
  const [verdict, setVerdict] = useState<string>("");
  const [scores, setScores] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

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

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err?.message || "Question generation failed");
        }

        const data = await res.json();
        if (!Array.isArray(data.questions) || data.questions.length === 0) {
          throw new Error("No questions received");
        }

        setQuestions(data.questions);
        setScores(new Array(data.questions.length).fill(0));
        setCurrentIndex(0);
      } catch (err: any) {
        setError(err.message || "Unable to load contest");
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
      setVerdict("❌ Please write code before submitting.");
      return;
    }

    try {
      setVerdict("⏳ Evaluating your solution...");
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
      if (!res.ok) throw new Error(data?.error || "Evaluation failed");

      setVerdict(`${data.verdict}\n\n${data.feedback}`);
      setScores((prev) => {
        const updated = [...prev];
        updated[currentIndex] = data.score === 1 ? 1 : 0;
        return updated;
      });
    } catch (err: any) {
      setVerdict(err.message || "⚠️ Evaluation failed.");
    }
  }

  /* ================= SCREENS ================= */
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">Preparing contest...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-red-400 p-6 text-center">❌ {error}</div>;

  if (finished) {
    const total = questions.length;
    const correct = scores.reduce((a, b) => a + b, 0);
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-bold text-purple-400 mb-6">Contest Completed!</h1>
          <div className="grid grid-cols-2 gap-4 text-left mb-6">
            <div className="bg-zinc-800/50 p-3 rounded-lg"><p className="text-xs text-zinc-400">Total</p><p className="font-bold">{total}</p></div>
            <div className="bg-zinc-800/50 p-3 rounded-lg"><p className="text-xs text-zinc-400">Correct</p><p className="font-bold text-green-400">{correct}</p></div>
            <div className="bg-zinc-800/50 p-3 rounded-lg"><p className="text-xs text-zinc-400">Accuracy</p><p className="font-bold">{accuracy}%</p></div>
            <div className="bg-zinc-800/50 p-3 rounded-lg"><p className="text-xs text-zinc-400">Language</p><p className="font-bold">{initialLang}</p></div>
          </div>
          <button onClick={() => window.location.href = '/'} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold transition-all">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-bold text-sm md:text-base text-purple-400">{topic} Contest</h1>
            <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest">
              Question {currentIndex + 1} of {questions.length} • {initialLang}
            </p>
          </div>
          <div className="flex gap-2">
             <div className="h-1.5 w-24 bg-zinc-800 rounded-full overflow-hidden mt-2 hidden md:block">
                <div 
                  className="h-full bg-purple-500 transition-all duration-500" 
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        
        {/* LEFT COLUMN: QUESTION & EDITOR */}
        <div className="flex-1 flex flex-col border-r border-zinc-800">
          
          {/* QUESTION DESCRIPTION */}
          <section className="p-4 md:p-6 bg-zinc-900/30">
            <h2 className="text-lg md:text-xl font-bold mb-3">{currentQuestion.title}</h2>
            <div className="text-sm text-zinc-300 leading-relaxed prose prose-invert max-w-none">
              {currentQuestion.description}
            </div>
          </section>

          {/* EDITOR SECTION */}
          <section className="border-t border-zinc-800 relative group">
            <div className="bg-zinc-900 px-4 py-2 text-[10px] uppercase font-bold text-zinc-500 flex justify-between">
              <span>Editor ({initialLang})</span>
              <span className="text-purple-500">Auto-saving Enabled</span>
            </div>
            <div className="h-[400px] md:h-[500px] lg:h-[600px]">
              <Editor
                theme="vs-dark"
                language={editorLang}
                value={code}
           onChange={(v: string | undefined) => setCode(v ?? "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 20 },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: CONTROLS & RESPONSE */}
        <aside className="md:w-[400px] flex flex-col bg-zinc-950">
          <div className="sticky top-[73px] p-4 md:p-6 space-y-4 bg-zinc-950 border-b md:border-b-0 border-zinc-800">
            <button
              onClick={submitSolution}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98]"
            >
              Submit Solution
            </button>

            <div className="flex gap-3">
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentIndex((i) => i + 1);
                      setCode("");
                      setVerdict("");
                      window.scrollTo(0,0);
                    }}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl font-semibold transition-all"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={() => setFinished(true)}
                    className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-xl font-semibold transition-all"
                  >
                    Finish Contest
                  </button>
                )}
            </div>
          </div>

          {/* VERDICT AREA */}
          <div className="p-4 md:p-6 flex-1">
            <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-4 min-h-[200px]">
              <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3">Feedback & Verdict</h3>
              <pre className="text-sm whitespace-pre-wrap text-zinc-300 font-sans italic">
                {verdict || "Your results will appear here after submission..."}
              </pre>
            </div>
          </div>
        </aside>
      </main>

      {/* MOBILE SPACING (to ensure content isn't hidden by bottom bars) */}
      <div className="h-10 md:hidden" />
    </div>
  );
}