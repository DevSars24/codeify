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
  const [mobileTab, setMobileTab] = useState<"problem" | "editor">("problem");

  const q = questions[currentIndex];

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/dsa/generate", {
          method: "POST",
          body: JSON.stringify({
            topic: params.get("topic"),
            difficulty: params.get("difficulty"),
            count: params.get("count"),
          }),
        });
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [params]);

  const handleSaveAndNext = () => {
    setSubmissions((prev) => ({ ...prev, [currentIndex]: code }));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCode(submissions[currentIndex + 1] || "");
      setMobileTab("problem");
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
          questions,
          submissions: finalSubmissions,
        }),
      });

      if (!res.ok) throw new Error("Evaluation failed");

      const { correct, total, accuracy } = await res.json();

      const saveRes = await fetch("/api/contest/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: params.get("topic"),
          language: params.get("language"),
          correct,
          total,
          accuracy,
          submissions: finalSubmissions,
        }),
      });

      if (!saveRes.ok) throw new Error("Save failed");

      router.push("/history");
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setIsFinishing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center font-mono text-purple-500 animate-pulse uppercase tracking-[0.4em]">
        Syncing_Arena...
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050505] text-zinc-300 flex flex-col overflow-hidden">
      {/* NAV */}
      <nav className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-black/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/5 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-purple-500">
            {params.get("topic")}
          </h2>
        </div>

        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 w-6 rounded-full ${i === currentIndex
                  ? "bg-white"
                  : submissions[i]
                    ? "bg-purple-900"
                    : "bg-zinc-800"
                }`}
            />
          ))}
        </div>

        <div className="text-[10px] font-bold text-zinc-500 uppercase">
          {currentIndex + 1} / {questions.length}
        </div>
      </nav>

      {/* MOBILE TAB SWITCH */}
      <div className="flex lg:hidden bg-zinc-900/50 border-b border-white/5">
        <button
          onClick={() => setMobileTab("problem")}
          className={`flex-1 py-3 text-[10px] font-bold tracking-widest ${mobileTab === "problem"
              ? "text-white border-b border-purple-500"
              : "text-zinc-500"
            }`}
        >
          PROBLEM
        </button>
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-3 text-[10px] font-bold tracking-widest ${mobileTab === "editor"
              ? "text-white border-b border-purple-500"
              : "text-zinc-500"
            }`}
        >
          EDITOR
        </button>
      </div>

      {/* MAIN */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* PROBLEM */}
        <div
          className={`w-full lg:w-[40%] overflow-y-auto p-6 border-r border-white/5 bg-[#080808] ${mobileTab === "problem" ? "block" : "hidden lg:block"
            }`}
        >
          <span className="text-purple-500 text-[10px] font-black uppercase tracking-[0.3em]">
            Module_0{currentIndex + 1}
          </span>

          <h1 className="text-2xl font-black text-white mt-4 mb-6">
            {q?.title}
          </h1>

          <div className="prose prose-invert prose-sm opacity-70">
            {q?.description}
          </div>

          <div className="space-y-4 mt-6">
            {q?.testCases?.map((tc: any, i: number) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 font-mono text-[10px]"
              >
                <div className="text-purple-400 mb-1 font-bold">Input</div>
                <div className="mb-3">{tc.input}</div>
                <div className="text-emerald-400 mb-1 font-bold">Output</div>
                <div>{tc.output}</div>
              </div>
            ))}
          </div>
        </div>

        {/* EDITOR */}
        <div
          className={`flex-1 flex flex-col bg-[#0b0b0b] ${mobileTab === "editor" ? "flex" : "hidden lg:flex"
            }`}
        >
          <div className="relative flex-1 min-h-[50vh] pb-36 lg:pb-0">
            <Editor
              theme="vs-dark"
              language={
                params.get("language")?.toLowerCase() === "c++"
                  ? "cpp"
                  : "python"
              }
              value={code}
              onFocus={() => setMobileTab("editor")}
              onChange={(v) => setCode(v ?? "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                fontFamily: "JetBrains Mono",
                wordWrap: "on",
              }}
            />
          </div>

          {/* ACTION BAR */}
          <div className="fixed bottom-0 left-0 right-0 lg:static bg-black border-t border-white/5 p-4 z-50">
            <div className="flex gap-3">
              <button
                onClick={handleSaveAndNext}
                className="flex-1 py-4 bg-zinc-900 border border-white/5 text-white font-black text-[10px] uppercase tracking-widest rounded-xl"
              >
                {currentIndex === questions.length - 1
                  ? "Save Final"
                  : "Save & Next"}
              </button>

              {currentIndex === questions.length - 1 && (
                <button
                  onClick={handleFinishContest}
                  disabled={isFinishing}
                  className="flex-1 py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"
                >
                  {isFinishing ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Finish Contest"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
