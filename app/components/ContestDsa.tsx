"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

export default function ContestDsa() {
  const params = useSearchParams();
  const topic = params.get("topic") || "Arrays";
  const difficulty = params.get("difficulty") || "Easy";
  const initialLang = params.get("language") || "C++";
  const editorLang = initialLang === "C++" ? "cpp" : initialLang.toLowerCase();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState("");
  const [verdict, setVerdict] = useState("");
  const [loading, setLoading] = useState(true);

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
        setQuestions(data.questions || []);
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
      setVerdict(">> [STATUS]: INITIALIZING JUDGE...\n>> [STATUS]: COMPILING ASSETS...\n>> [STATUS]: RUNNING TEST CASES...");
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
      setVerdict(`[VERDICT]: ${data.verdict}\n[SCORE]: ${data.score}/1\n[LOG]: ${data.feedback}`);
    } catch (err) {
      setVerdict(">> [CRITICAL]: JUDGE CONNECTION LOST.");
    }
  }

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-black gap-4">
      <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      <div className="text-purple-400 font-black tracking-[0.3em] text-xs animate-pulse">PREPARING ARENA</div>
    </div>
  );

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden font-mono selection:bg-purple-500/30">
      
      {/* HUD HEADER */}
      <header className="h-14 bg-zinc-900/80 backdrop-blur-md border-b border-white/5 px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          <div className="space-y-0.5">
            <h1 className="text-xs font-black uppercase italic tracking-tighter text-purple-400">{topic} Contest</h1>
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${difficulty === "Easy" || difficulty === "Basic" ? "bg-green-500" : "bg-yellow-500"} shadow-[0_0_8px_rgba(34,197,94,0.5)]`} />
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{difficulty} • {initialLang}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1 flex items-center gap-3">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Progress</div>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`h-1 w-4 rounded-full transition-all ${i === currentIndex ? "bg-purple-500" : i < currentIndex ? "bg-zinc-600" : "bg-zinc-800"}`} />
            ))}
          </div>
          <div className="text-[10px] text-white font-black">{currentIndex + 1}/{questions.length}</div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        
        {/* PROBLEM DATA PANE */}
        <div className="flex-1 md:overflow-y-auto custom-scrollbar bg-black p-6 md:p-10 border-r border-white/5">
          <section className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em]">Problem {currentIndex + 1}</span>
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">{currentQuestion?.title}</h2>
            </div>
            
            <div className="text-zinc-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans border-l-2 border-zinc-800 pl-6">
              {currentQuestion?.description}
            </div>

            <div className="space-y-4 pt-6">
              <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Expected Logic Output</h3>
              {currentQuestion?.testCases?.map((tc: any, i: number) => (
                <div key={i} className="group bg-zinc-900/30 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/50 transition-all">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-1">
                      <span className="text-[9px] font-black text-zinc-600 uppercase">Input</span>
                      <div className="text-xs text-purple-300 bg-purple-500/5 p-3 rounded-xl border border-purple-500/10 font-mono">{tc.input}</div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-[9px] font-black text-zinc-600 uppercase">Output</span>
                      <div className="text-xs text-green-400 bg-green-500/5 p-3 rounded-xl border border-green-500/10 font-mono">{tc.output}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* EDITOR & COMMAND CENTER */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] border-t md:border-t-0 border-white/5 min-h-0 overflow-hidden">
          
          {/* EDITOR AREA */}
          <div className="flex-1 relative min-h-0">
            <Editor
              theme="vs-dark"
              language={editorLang}
              value={code}
              onChange={(v: string | undefined) => setCode(v ?? "")}

              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
                padding: { top: 20 },
                fontFamily: "JetBrains Mono, monospace",
                cursorSmoothCaretAnimation: true,
                lineNumbersMinChars: 4,
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* CONTROL DASHBOARD */}
          <div className="bg-zinc-900 border-t border-white/5 p-4 space-y-4 shrink-0">
            <div className="flex gap-4">
              <button
                onClick={submitSolution}
                className="flex-[2] py-4 bg-white text-black font-black text-xs tracking-[0.2em] rounded-xl hover:bg-zinc-200 active:scale-95 transition-all shadow-lg"
              >
                EXECUTE KERNEL
              </button>
              {currentIndex < questions.length - 1 && (
                <button
                  onClick={() => { setCurrentIndex(i => i + 1); setCode(""); setVerdict(""); }}
                  className="flex-1 py-4 bg-zinc-800 text-white font-black text-xs tracking-[0.2em] rounded-xl border border-white/5 hover:bg-zinc-700 transition-all"
                >
                  NEXT
                </button>
              )}
            </div>

            {/* INTEGRATED CONSOLE */}
            <div className={`rounded-xl border border-white/10 overflow-hidden transition-all duration-500 ${verdict ? 'h-32' : 'h-0 opacity-0'}`}>
              <div className="bg-black/50 px-3 py-1.5 border-b border-white/10 flex justify-between items-center">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Judicial Terminal</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
              </div>
              <pre className="p-4 text-[10px] text-green-400 leading-relaxed overflow-y-auto h-24 custom-scrollbar-thin">
                {verdict}
              </pre>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { bg: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar-thin::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb { background: #3f3f46; }
      `}</style>
    </div>
  );
}