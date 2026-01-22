"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Terminal, ChevronLeft, Play, CheckCircle, Smartphone, BookOpen, Code2, Loader2 } from "lucide-react";

export default function ContestDsa() {
  const params = useSearchParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);

  // Storage for user answers to evaluate at the end
  const [submissions, setSubmissions] = useState<Record<number, string>>({});
  const [mobileTab, setMobileTab] = useState<'problem' | 'editor'>('problem');

  const q = questions[currentIndex];

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/dsa/generate", {
          method: "POST",
          body: JSON.stringify({
            topic: params.get("topic"),
            difficulty: params.get("difficulty"),
            count: params.get("count")
          }),
        });
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchQuestions();
  }, [params]);

  const handleSaveAndNext = () => {
    // Save code for current question index
    setSubmissions((prev: Record<number, string>) => ({ ...prev, [currentIndex]: code }));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev: number) => prev + 1);
      setCode(submissions[currentIndex + 1] || ""); // Load existing or empty
      setMobileTab('problem');
    }
  };

  const handleFinishContest = async () => {
    setIsFinishing(true);
    // Final save of the last question
    const finalSubmissions = { ...submissions, [currentIndex]: code };

    try {
      // Evaluate all at once via AI/Judge
      const res = await fetch("/api/dsa/evaluate-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: params.get("topic"),
          language: params.get("language"),
          questions: questions,
          submissions: finalSubmissions
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Evaluation failed" }));
        throw new Error(errorData.error || `Evaluation failed with status ${res.status}`);
      }

      const data = await res.json();
      const { correct, total, accuracy } = data;

      // Save to History
      const saveRes = await fetch("/api/contest/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: params.get("topic"),
          language: params.get("language"),
          correct, total, accuracy,
          submissions: finalSubmissions
        }),
      });

      if (!saveRes.ok) {
        const errorData = await saveRes.json().catch(() => ({ error: "Save failed" }));
        throw new Error(errorData.error || `Save failed with status ${saveRes.status}`);
      }

      router.push("/history"); // Redirect to history to see result
    } catch (err: any) {
      console.error("Finish Contest Error:", err);
      alert(`Error: ${err.message || "Failed to finish contest. Please try again."}`);
    } finally {
      setIsFinishing(false);
    }
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center font-mono text-purple-500 animate-pulse uppercase tracking-[0.4em]">Syncing_Arena...</div>;

  return (
    <div className="h-screen bg-[#050505] text-zinc-300 flex flex-col overflow-hidden font-sans">
      <nav className="h-14 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-black/80 backdrop-blur-xl z-50 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft size={20} /></button>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-purple-500">{params.get("topic")}</h2>
        </div>

        <div className="flex gap-1">
          {questions.map((_: any, i: number) => (
            <div key={i} className={`h-1 w-6 rounded-full transition-all ${i === currentIndex ? "bg-white" : submissions[i] ? "bg-purple-900" : "bg-zinc-800"}`} />
          ))}
        </div>

        <div className="text-[10px] font-bold text-zinc-500 uppercase">{currentIndex + 1} / {questions.length}</div>
      </nav>

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden bg-zinc-900/50 border-b border-white/5">
        <button onClick={() => setMobileTab('problem')} className={`flex-1 py-3 text-[10px] font-bold tracking-widest ${mobileTab === 'problem' ? 'text-white border-b border-purple-500' : 'text-zinc-500'}`}>PROBLEM</button>
        <button onClick={() => setMobileTab('editor')} className={`flex-1 py-3 text-[10px] font-bold tracking-widest ${mobileTab === 'editor' ? 'text-white border-b border-purple-500' : 'text-zinc-500'}`}>EDITOR</button>
      </div>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Problem Section */}
        <div className={`w-full lg:w-[40%] overflow-y-auto p-6 lg:p-10 border-r border-white/5 bg-[#080808] ${mobileTab === 'problem' ? 'block' : 'hidden lg:block'}`}>
          <span className="text-purple-500 text-[10px] font-black uppercase tracking-[0.3em]">Module_0{currentIndex + 1}</span>
          <h1 className="text-3xl font-black text-white italic uppercase mt-4 mb-6">{q?.title}</h1>
          <div className="prose prose-invert prose-sm mb-10 opacity-70 leading-relaxed">{q?.description}</div>

          <div className="space-y-4">
            {q?.testCases?.map((tc: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 font-mono text-[10px]">
                <div className="text-purple-400 mb-1 uppercase font-bold">Input</div>
                <div className="text-zinc-300 mb-3">{tc.input}</div>
                <div className="text-emerald-400 mb-1 uppercase font-bold">Output</div>
                <div className="text-zinc-300">{tc.output}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Section */}
        <div className={`flex-1 flex flex-col bg-[#0b0b0b] ${mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="flex-1 relative">
            <Editor
              theme="vs-dark"
              language={params.get("language")?.toLowerCase() === "c++" ? "cpp" : "python"}
              value={code}
              onChange={(v: string | undefined) => setCode(v ?? "")}
              options={{ fontSize: 15, minimap: { enabled: false }, fontFamily: "JetBrains Mono", wordWrap: "on" }}
            />
          </div>

          <div className="h-32 lg:h-40 bg-black border-t border-white/5 p-4 flex flex-col justify-center gap-4">
            <div className="flex gap-3">
              <button
                onClick={handleSaveAndNext}
                className="flex-1 py-4 bg-zinc-900 border border-white/5 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all"
              >
                {currentIndex === questions.length - 1 ? "Save Final" : "Save & Next"}
              </button>

              {currentIndex === questions.length - 1 && (
                <button
                  onClick={handleFinishContest}
                  disabled={isFinishing}
                  className="flex-1 py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                  {isFinishing ? <Loader2 className="animate-spin w-4 h-4" /> : "Finish Contest"}
                </button>
              )}
            </div>
            <p className="text-[9px] text-zinc-600 uppercase text-center tracking-widest font-bold">
              Submissions are encrypted and hidden until contest completion.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}