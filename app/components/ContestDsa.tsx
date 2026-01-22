"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { ChevronLeft, Loader2 } from "lucide-react";

export default function ContestDsa() {
  const params = useSearchParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);

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
    setSubmissions((prev: Record<number, string>) => ({ ...prev, [currentIndex]: code }));

    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCode(submissions[nextIndex] || "");
      setMobileTab('problem');
    }
  };

  const handleFinishContest = async () => {
    setIsFinishing(true);
    const finalSubmissions = { ...submissions, [currentIndex]: code };

    try {
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

      if (!res.ok) throw new Error("Evaluation failed");

      const data = await res.json();
      const { correct, total, accuracy } = data;

      const saveRes = await fetch("/api/contest/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: params.get("topic"),
          language: params.get("language"),
          difficulty: params.get("difficulty") || "Basic",
          correct, total, accuracy,
          submissions: finalSubmissions
        }),
      });

      if (!saveRes.ok) throw new Error("Save failed");

      router.push("/history");
    } catch (err: any) {
      console.error("Finish Contest Error:", err);
      alert(`Error: ${err.message || "Failed to finish contest."}`);
    } finally {
      setIsFinishing(false);
    }
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center font-mono text-purple-500 animate-pulse uppercase tracking-[0.4em]">Syncing_Arena...</div>;

  return (
    <div className="h-screen bg-[#050505] text-zinc-300 flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <nav className="h-14 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-black/80 backdrop-blur-xl z-[100] shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft size={20} /></button>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-purple-500">{params.get("topic")}</h2>
        </div>

        <div className="flex gap-1">
          {questions.map((_: any, i: number) => (
            <div key={i} className={`h-1 w-4 md:w-6 rounded-full transition-all ${i === currentIndex ? "bg-white" : submissions[i] ? "bg-purple-900" : "bg-zinc-800"}`} />
          ))}
        </div>

        <div className="text-[10px] font-bold text-zinc-500 uppercase">{currentIndex + 1} / {questions.length}</div>
      </nav>

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden bg-zinc-900/50 border-b border-white/5 shrink-0">
        <button onClick={() => setMobileTab('problem')} className={`flex-1 py-4 text-[10px] font-bold tracking-widest transition-all ${mobileTab === 'problem' ? 'text-white border-b-2 border-purple-500 bg-white/5' : 'text-zinc-500'}`}>PROBLEM</button>
        <button onClick={() => setMobileTab('editor')} className={`flex-1 py-4 text-[10px] font-bold tracking-widest transition-all ${mobileTab === 'editor' ? 'text-white border-b-2 border-purple-500 bg-white/5' : 'text-zinc-500'}`}>EDITOR</button>
      </div>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Problem Section */}
        <div className={`w-full lg:w-[40%] overflow-y-auto p-6 lg:p-10 border-r border-white/5 bg-[#080808] ${mobileTab === 'problem' ? 'block' : 'hidden lg:block'}`}>
          <span className="text-purple-500 text-[10px] font-black uppercase tracking-[0.3em]">Module_0{currentIndex + 1}</span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase mt-4 mb-6">{q?.title}</h1>
          <div className="prose prose-invert prose-sm mb-10 opacity-70 leading-relaxed whitespace-pre-wrap">{q?.description}</div>

          <div className="space-y-4 mb-20 lg:mb-0">
            {q?.testCases?.map((tc: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 font-mono text-[10px]">
                <div className="text-purple-400 mb-1 uppercase font-bold">Input</div>
                <div className="text-zinc-300 mb-3 break-all">{tc.input}</div>
                <div className="text-emerald-400 mb-1 uppercase font-bold">Output</div>
                <div className="text-zinc-300 break-all">{tc.output}</div>
              </div>
            ))}
          </div>
        </div>

        {/* EDITOR SECTION */}
        <div className={`flex-1 flex flex-col bg-[#0b0b0b] relative min-h-0 ${mobileTab === "editor" ? "flex" : "hidden lg:flex"}`}>
          <div className="flex-1 relative overflow-hidden">
            <Editor
              theme="vs-dark"
              language={params.get("language")?.toLowerCase() === "c++" ? "cpp" : "python"}
              value={code}
              onChange={(v: string | undefined) => setCode(v ?? "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                fontFamily: "JetBrains Mono",
                wordWrap: "on",
                automaticLayout: true,
                padding: { top: 16, bottom: 120 }, // Extra space so code isn't hidden by buttons
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                glyphMargin: false,
                folding: false,
              }}
            />
          </div>

          {/* ACTION BAR - Always Visible at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 p-4 z-[50] pb-safe">
            <div className="flex gap-3 max-w-4xl mx-auto">
              <button
                onClick={handleSaveAndNext}
                className="flex-1 py-4 bg-zinc-900 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all active:scale-95 shadow-xl"
              >
                {currentIndex === questions.length - 1 ? "Save Final" : "Save & Next"}
              </button>

              {currentIndex === questions.length - 1 && (
                <button
                  onClick={handleFinishContest}
                  disabled={isFinishing}
                  className="flex-1 py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95"
                >
                  {isFinishing ? <Loader2 className="animate-spin w-4 h-4" /> : "Finish Contest"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}