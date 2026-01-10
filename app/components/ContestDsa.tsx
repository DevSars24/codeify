"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

export default function ContestDsa() {
  const params = useSearchParams();
  const router = useRouter();
  
  const topic = params.get("topic") || "Arrays";
  const difficulty = params.get("difficulty") || "Easy";
  const initialLang = params.get("language") || "C++";
  const editorLang = initialLang === "C++" ? "cpp" : initialLang.toLowerCase();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState("");
  const [verdict, setVerdict] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [scores, setScores] = useState<number[]>([]); // To track question scores

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);
        const res = await fetch("/api/dsa/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, difficulty }),
        });
        const data = await res.json();
        const qs = data.questions || [];
        setQuestions(qs);
        setScores(new Array(qs.length).fill(0));
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    }
    fetchQuestions();
  }, [topic, difficulty]);

  async function submitSolution() {
    if (!currentQuestion || !code.trim()) {
      setVerdict(">> System Warning: No source code detected.");
      return;
    }
    try {
      setVerdict(">> [STATUS]: RUNNING TEST CASES...");
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
      setVerdict(`[VERDICT]: ${data.verdict}\n[SCORE]: ${data.score}/1`);
      
      // Update score for current question
      const newScores = [...scores];
      newScores[currentIndex] = data.score || 0;
      setScores(newScores);

    } catch (err) {
      setVerdict(">> [CRITICAL]: JUDGE CONNECTION LOST.");
    }
  }

  async function handleFinish() {
    setIsSaving(true);
    const totalCorrect = scores.reduce((a, b) => a + b, 0);
    const accuracy = Math.round((totalCorrect / questions.length) * 100);

    try {
      await fetch("/api/contest/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          correct: totalCorrect,
          total: questions.length,
          accuracy,
          language: initialLang,
        }),
      });
      router.push("/"); // Redirect after save
    } catch (err) {
      console.error("Finish Error:", err);
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-black gap-4">
      <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      <div className="text-purple-400 font-black tracking-[0.3em] text-xs">INITIALIZING ARENA...</div>
    </div>
  );

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden font-mono">
      <header className="h-14 bg-zinc-900/80 backdrop-blur-md border-b border-white/5 px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="text-xs font-black uppercase text-purple-400">{topic} Contest</h1>
          <p className="text-[9px] text-zinc-500 uppercase font-bold">{difficulty} • {initialLang}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1 flex items-center gap-3">
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`h-1 w-4 rounded-full ${i === currentIndex ? "bg-purple-500" : scores[i] > 0 ? "bg-green-500" : "bg-zinc-800"}`} />
            ))}
          </div>
          <div className="text-[10px] text-white font-black">{currentIndex + 1}/{questions.length}</div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        <div className="flex-1 md:overflow-y-auto p-6 md:p-10 border-r border-white/5 custom-scrollbar">
          <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Problem {currentIndex + 1}</span>
          <h2 className="text-3xl font-black italic uppercase mt-2 mb-6">{currentQuestion?.title}</h2>
          <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap font-sans border-l-2 border-zinc-800 pl-6 mb-10">
            {currentQuestion?.description}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-[#1e1e1e] min-h-0">
          <div className="flex-1 relative">
            <Editor
              theme="vs-dark"
              language={editorLang}
              value={code}
              onChange={(v: string | undefined) => setCode(v ?? "")}

              options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
            />
          </div>

          <div className="bg-zinc-900 p-4 border-t border-white/5 space-y-4">
            <div className="flex gap-4">
              <button onClick={submitSolution} className="flex-[2] py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all">
                EXECUTE KERNEL
              </button>
              
              {currentIndex < questions.length - 1 ? (
                <button 
                  onClick={() => { setCurrentIndex(prev => prev + 1); setCode(""); setVerdict(""); }}
                  className="flex-1 py-4 bg-zinc-800 text-white font-black text-xs uppercase tracking-widest rounded-xl border border-white/5"
                >
                  NEXT
                </button>
              ) : (
                <button 
                  onClick={handleFinish}
                  disabled={isSaving}
                  className="flex-1 py-4 bg-purple-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-purple-500 disabled:opacity-50"
                >
                  {isSaving ? "SAVING..." : "FINISH"}
                </button>
              )}
            </div>

            {verdict && (
              <div className="bg-black/50 border border-white/10 rounded-xl p-4 h-24 overflow-y-auto">
                <pre className="text-[10px] text-green-400 leading-relaxed">{verdict}</pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}