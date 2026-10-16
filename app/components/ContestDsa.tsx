"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { EditorProps } from "@monaco-editor/react";
import {
  ChevronLeft,
  Loader2,
  Play,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  Terminal,
  Cpu,
  HelpCircle,
  Clock,
  Layers,
  Code2,
  ArrowRight,
} from "lucide-react";

const Editor = dynamic<EditorProps>(() => import("@monaco-editor/react"), { ssr: false });

type ConsoleTab = "simulate" | "assess" | "mentor";

export default function ContestDsa() {
  const params = useSearchParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
  const [loading, setLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [submissions, setSubmissions] = useState<Record<number, string>>({});
  const [mobileTab, setMobileTab] = useState<"problem" | "editor" | "console">("problem");
  const [consoleTab, setConsoleTab] = useState<ConsoleTab>("simulate");

  // Simulation State
  const [customInput, setCustomInput] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  // Assessment State
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  // Mentor Explanation State
  const [isExplaining, setIsExplaining] = useState(false);
  const [mentorResult, setMentorResult] = useState<any>(null);
  const [mentorError, setMentorError] = useState<string | null>(null);

  const q = questions[currentIndex];

  useEffect(() => {
    const syncTheme = () => setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  // Initialize language from query or default
  useEffect(() => {
    const langParam = params.get("language")?.toLowerCase();
    if (langParam === "c++" || langParam === "cpp") setSelectedLanguage("cpp");
    else if (langParam === "javascript" || langParam === "js") setSelectedLanguage("javascript");
    else if (langParam === "java") setSelectedLanguage("java");
    else setSelectedLanguage("python");
  }, [params]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/dsa/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: params.get("topic"),
            difficulty: params.get("difficulty"),
            count: params.get("count"),
          }),
        });
        const data = await res.json();
        const loadedQuestions = data.questions || [];
        setQuestions(loadedQuestions);
        if (loadedQuestions[0]?.testCases?.[0]?.input) {
          setCustomInput(loadedQuestions[0].testCases[0].input);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [params]);

  // Sync default input when question changes
  useEffect(() => {
    if (q?.testCases?.[0]?.input) {
      setCustomInput(q.testCases[0].input);
    }
    setSimulationResult(null);
    setAssessmentResult(null);
    setMentorResult(null);
    setSimulationError(null);
    setAssessmentError(null);
    setMentorError(null);
  }, [currentIndex, q]);

  // 1. Simulate with AI
  const handleSimulate = async () => {
    if (!code.trim()) {
      setSimulationError("Please write some code before simulating.");
      return;
    }

    setIsSimulating(true);
    setSimulationError(null);
    setConsoleTab("simulate");
    if (window.innerWidth < 1024) setMobileTab("console");

    try {
      const res = await fetch("/api/dsa/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          input: customInput,
          problemId: q?.id,
          problemTitle: q?.title,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Simulation failed");
      }
      setSimulationResult(data);
    } catch (err: any) {
      setSimulationError(err.message || "Failed to simulate with AI.");
    } finally {
      setIsSimulating(false);
    }
  };

  // 2. Submit for AI Assessment
  const handleAssess = async () => {
    if (!code.trim()) {
      setAssessmentError("Please write code before requesting an assessment.");
      return;
    }

    setIsAssessing(true);
    setAssessmentError(null);
    setConsoleTab("assess");
    if (window.innerWidth < 1024) setMobileTab("console");

    try {
      const res = await fetch("/api/dsa/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          problemId: q?.id,
          problemTitle: q?.title,
          problemDescription: q?.description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Assessment failed");
      }
      setAssessmentResult(data);
    } catch (err: any) {
      setAssessmentError(err.message || "Failed to assess code.");
    } finally {
      setIsAssessing(false);
    }
  };

  // 3. Request Mentor Explanation (Reuses Assessment)
  const handleRequestMentor = async () => {
    setIsExplaining(true);
    setMentorError(null);
    setConsoleTab("mentor");

    try {
      const res = await fetch("/api/dsa/mentor-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          problemTitle: q?.title,
          problemDescription: q?.description,
          assessmentSummary: assessmentResult?.summary || "",
          likelyEdgeCases: assessmentResult?.likelyEdgeCaseFailures || [],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to get mentor advice");
      }
      setMentorResult(data);
    } catch (err: any) {
      setMentorError(err.message || "Failed to connect with AI mentor.");
    } finally {
      setIsExplaining(false);
    }
  };

  const handleSaveAndNext = () => {
    setSubmissions((prev: Record<number, string>) => ({ ...prev, [currentIndex]: code }));

    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCode(submissions[nextIndex] || "");
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
          language: selectedLanguage,
          questions: questions,
          submissions: finalSubmissions,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Contest evaluation failed");
      }

      const { correct, total, accuracy } = data;

      try {
        await fetch("/api/contest/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: params.get("topic"),
            language: selectedLanguage,
            difficulty: params.get("difficulty") || "Basic",
            correct,
            total,
            accuracy,
            submissions: finalSubmissions,
          }),
        });
      } catch (saveErr) {
        console.warn("Offline fallback for contest save:", saveErr);
      }

      router.push("/history");
    } catch (err: any) {
      console.error("Finish Contest Error:", err);
      router.push("/history");
    } finally {
      setIsFinishing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-background text-foreground flex items-center justify-center font-mono animate-pulse uppercase tracking-[0.4em]">
        Syncing_Arena...
      </div>
    );
  }

  return (
    <div className="h-[100dvh] min-h-[100dvh] bg-black text-foreground flex flex-col overflow-hidden font-sans">
      {/* Top Navbar */}
      <nav className="h-14 border-b border-white/[0.06] flex items-center justify-between px-3 md:px-6 bg-black z-[100] shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => router.back()}
            className="p-1.5 hover:bg-muted rounded-md transition-colors shrink-0"
            title="Go Back"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-black uppercase tracking-wider text-foreground truncate">
              {params.get("topic") || "DSA"}
            </span>
            <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-semibold shrink-0">
              AI Arena
            </span>
          </div>
        </div>

        {/* Question Stepper */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-[40%] sm:max-w-none py-1">
          {questions.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => {
                setSubmissions((prev) => ({ ...prev, [currentIndex]: code }));
                setCurrentIndex(i);
                setCode(submissions[i] || "");
              }}
              className={`h-2 rounded-full transition-all shrink-0 ${
                i === currentIndex
                  ? "w-6 sm:w-7 bg-primary"
                  : submissions[i]
                  ? "w-3 sm:w-4 bg-muted-foreground/60"
                  : "w-3 sm:w-4 bg-muted hover:bg-muted-foreground/30"
              }`}
              title={`Question ${i + 1}`}
            />
          ))}
        </div>

        {/* Language Selector & Progress */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-muted text-foreground text-xs font-mono px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="javascript">JS</option>
            <option value="java">Java</option>
          </select>
          <span className="text-[11px] font-bold text-muted-foreground font-mono">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
      </nav>

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden bg-white/[0.02] border-b border-white/[0.08] shrink-0">
        <button
          onClick={() => setMobileTab("problem")}
          className={`flex-1 py-3 text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
            mobileTab === "problem"
              ? "text-white border-b-2 border-white bg-white/[0.06]"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          PROBLEM
        </button>
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-3 text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
            mobileTab === "editor"
              ? "text-white border-b-2 border-white bg-white/[0.06]"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          CODE
        </button>
        <button
          onClick={() => setMobileTab("console")}
          className={`flex-1 py-3 text-[11px] font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === "console"
              ? "text-white border-b-2 border-white bg-white/[0.06]"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          <span>AI CONSOLE</span>
          {(simulationResult || assessmentResult) && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative min-h-0">
        {/* Left Pane: Problem Description */}
        <div
          className={`w-full lg:w-[38%] overflow-y-auto p-4 sm:p-6 md:p-8 border-r border-white/[0.06] bg-black flex-1 min-h-0 ${
            mobileTab === "problem" ? "block" : "hidden lg:block"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.25em]">
              Problem_0{currentIndex + 1}
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded border border-border bg-muted/50">
              {q?.difficulty || "Medium"}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight mb-4">
            {q?.title}
          </h1>

          <div className="prose prose-sm dark:prose-invert mb-8 text-muted-foreground text-xs leading-relaxed whitespace-pre-wrap">
            {q?.description}
          </div>

          {/* Sample Test Cases */}
          <div className="space-y-3 mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Terminal size={13} className="text-primary" /> Sample Test Cases
            </h3>
            {q?.testCases?.map((tc: any, i: number) => (
              <div
                key={i}
                className="p-3.5 rounded-lg bg-muted/50 border border-border font-mono text-[11px] space-y-2"
              >
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                    Input
                  </div>
                  <div className="text-foreground bg-background/60 p-1.5 rounded border border-border/40 break-all select-all">
                    {tc.input}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                    Expected Output
                  </div>
                  <div className="text-foreground bg-background/60 p-1.5 rounded border border-border/40 break-all select-all">
                    {tc.output}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Quick Switch to Editor Button */}
          <div className="lg:hidden pb-10">
            <button
              onClick={() => setMobileTab("editor")}
              className="btn-cyber w-full py-3 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xl"
            >
              <Code2 size={15} />
              <span>Solve Challenge (Open Editor)</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Right Pane: Code Editor + Split AI Console */}
        <div
          className={`w-full lg:flex-1 flex flex-col bg-black overflow-hidden flex-1 min-h-0 ${
            mobileTab === "problem" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Top Editor Area */}
          <div
            className={`w-full flex flex-col relative ${
              mobileTab === "console"
                ? "hidden lg:flex lg:h-[52%]"
                : "flex-1 min-h-0 h-full lg:h-[52%]"
            }`}
          >
            {/* Mobile Editor Header */}
            <div className="lg:hidden h-9 px-3 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between text-xs font-mono shrink-0">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate max-w-[65%]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="truncate">{q?.title || "Problem"}</span>
              </span>
              <span className="text-[10px] text-violet-300 font-bold bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                {selectedLanguage}
              </span>
            </div>

            {/* Monaco Editor Wrapper */}
            <div className="flex-1 min-h-0 h-full w-full relative">
              <Editor
                height="100%"
                theme={theme === "dark" ? "vs-dark" : "vs"}
                language={selectedLanguage === "cpp" ? "cpp" : selectedLanguage}
                value={code}
                onChange={(v: string | undefined) => setCode(v ?? "")}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  fontFamily: "JetBrains Mono, Fira Code, monospace",
                  wordWrap: "on",
                  automaticLayout: true,
                  padding: { top: 12, bottom: 12 },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  lineNumbersMinChars: 3,
                  fixedOverflowWidgets: true,
                  tabSize: 2,
                }}
              />
            </div>

            {/* Mobile Editor Docked Quick Action Bar */}
            <div className="lg:hidden h-13 border-t border-white/[0.08] px-3 bg-black/95 backdrop-blur-md flex items-center justify-between gap-2 shrink-0 z-10">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="px-2.5 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-foreground text-xs font-semibold rounded-lg border border-white/[0.1] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Simulate output"
                >
                  {isSimulating ? (
                    <Loader2 size={12} className="animate-spin text-primary" />
                  ) : (
                    <Zap size={12} className="text-emerald-400" />
                  )}
                  <span>Simulate</span>
                </button>
                <button
                  onClick={handleAssess}
                  disabled={isAssessing}
                  className="px-2.5 py-1.5 bg-violet-500/20 hover:bg-violet-500/30 text-violet-200 text-xs font-bold rounded-lg border border-violet-500/30 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Submit for AI Assessment"
                >
                  {isAssessing ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Sparkles size={12} className="text-violet-400" />
                  )}
                  <span>Assess</span>
                </button>
              </div>

              <button
                onClick={handleSaveAndNext}
                className="px-3 py-1.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
              >
                <span>{currentIndex === questions.length - 1 ? "Save" : "Next"}</span>
                <ChevronLeft size={13} className="rotate-180" />
              </button>
            </div>
          </div>

          {/* Split Pane: Interactive AI Console */}
          <div
            className={`w-full border-t border-white/[0.06] bg-black flex flex-col flex-1 min-h-0 overflow-hidden ${
              mobileTab === "editor" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Console Tabs Header */}
            <div className="h-10 border-b border-white/[0.06] flex items-center justify-between px-3 bg-white/[0.02] shrink-0">
              <div className="flex gap-1 overflow-x-auto py-1">
                <button
                  onClick={() => setConsoleTab("simulate")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                    consoleTab === "simulate"
                      ? "bg-background text-foreground border border-border shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Play size={12} className="text-emerald-500" /> Simulate Output
                </button>
                <button
                  onClick={() => setConsoleTab("assess")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                    consoleTab === "assess"
                      ? "bg-background text-foreground border border-border shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles size={12} className="text-amber-500" /> AI Assessment
                </button>
                {assessmentResult && (
                  <button
                    onClick={() => setConsoleTab("mentor")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                      consoleTab === "mentor"
                        ? "bg-background text-foreground border border-border shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <HelpCircle size={12} className="text-blue-500" /> Mentor Advice
                  </button>
                )}
              </div>

              {/* Action Buttons & Mobile Back Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileTab("editor")}
                  className="lg:hidden px-2.5 py-1 bg-white/[0.06] text-white text-xs font-semibold rounded border border-white/[0.12] flex items-center gap-1 cursor-pointer"
                >
                  <Code2 size={12} />
                  <span>Editor</span>
                </button>

                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="hidden sm:inline-flex px-3 py-1 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold rounded border border-border items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Predict standard output using Groq AI without server execution"
                >
                  {isSimulating ? (
                    <Loader2 size={12} className="animate-spin text-primary" />
                  ) : (
                    <Zap size={12} className="text-primary" />
                  )}
                  Simulate
                </button>
                <button
                  onClick={handleAssess}
                  disabled={isAssessing}
                  className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                  title="Assess algorithmic correctness and edge cases"
                >
                  {isAssessing ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={12} />
                  )}
                  Submit
                </button>
              </div>
            </div>

            {/* Console Content Body */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
              {/* TAB 1: SIMULATE WITH AI */}
              {consoleTab === "simulate" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1">
                      Custom Stdin (Input)
                    </label>
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Enter custom input (e.g. arr = [3,1,4,1,5])"
                      className="w-full bg-muted/60 text-foreground px-3 py-1.5 rounded border border-border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {isSimulating && (
                    <div className="p-4 rounded-lg bg-muted/30 border border-border flex items-center gap-2 text-muted-foreground animate-pulse">
                      <Loader2 size={14} className="animate-spin text-primary" />
                      Simulating output via Groq AI...
                    </div>
                  )}

                  {simulationError && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                      {simulationError}
                    </div>
                  )}

                  {simulationResult && !isSimulating && (
                    <div className="space-y-3">
                      {/* Predicted Output Box */}
                      <div className="p-3.5 rounded-lg bg-muted/40 border border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Terminal size={12} /> Predicted Output
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                            Confidence: {simulationResult.confidence}
                          </span>
                        </div>
                        <pre className="p-2.5 rounded bg-background border border-border/60 text-foreground font-mono text-xs whitespace-pre-wrap break-all select-all">
                          {simulationResult.predictedOutput || "(Empty Output)"}
                        </pre>
                        {simulationResult.reasoning && (
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {simulationResult.reasoning}
                          </p>
                        )}
                      </div>

                      {/* Explicit Output Disclaimer */}
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
                        <span className="font-semibold text-amber-500/90 flex items-center gap-1">
                          <AlertTriangle size={11} /> {simulationResult.disclaimer}
                        </span>
                        <span>
                          Provider: {simulationResult.provider} ({simulationResult.model})
                          {simulationResult.cached && " • Cached"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: AI ASSESSMENT */}
              {consoleTab === "assess" && (
                <div className="space-y-3">
                  {isAssessing && (
                    <div className="p-4 rounded-lg bg-muted/30 border border-border flex items-center gap-2 text-muted-foreground animate-pulse">
                      <Loader2 size={14} className="animate-spin text-primary" />
                      Evaluating algorithmic logic and edge cases via AI...
                    </div>
                  )}

                  {assessmentError && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                      {assessmentError}
                    </div>
                  )}

                  {assessmentResult && !isAssessing && (
                    <div className="space-y-3">
                      {/* Assessment Header & Score */}
                      <div className="p-4 rounded-lg bg-muted/40 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
                            {assessmentResult.scoreLabel}
                          </div>
                          <div className="text-2xl font-black text-foreground flex items-center gap-2">
                            <span>{assessmentResult.aiEstimatedScore} / 100</span>
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                assessmentResult.aiEstimatedScore >= 80
                                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                                  : assessmentResult.aiEstimatedScore >= 50
                                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                                  : "bg-destructive/10 text-destructive border border-destructive/30"
                              }`}
                            >
                              {assessmentResult.verdictLabel}
                            </span>
                          </div>
                        </div>

                        {/* Complexity Metrics */}
                        <div className="flex gap-2">
                          <div className="px-2.5 py-1.5 rounded bg-background border border-border text-[10px]">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock size={10} /> Time
                            </span>
                            <span className="font-bold text-foreground">
                              {assessmentResult.timeComplexity}
                            </span>
                          </div>
                          <div className="px-2.5 py-1.5 rounded bg-background border border-border text-[10px]">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Layers size={10} /> Space
                            </span>
                            <span className="font-bold text-foreground">
                              {assessmentResult.spaceComplexity}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Summary & Edge Cases */}
                      <div className="p-3.5 rounded-lg bg-muted/20 border border-border space-y-2">
                        <p className="text-xs text-foreground leading-relaxed">
                          {assessmentResult.summary}
                        </p>

                        {assessmentResult.likelyEdgeCaseFailures?.length > 0 && (
                          <div className="pt-2 border-t border-border/50">
                            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider block mb-1">
                              Potential Edge-Case Concerns:
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px]">
                              {assessmentResult.likelyEdgeCaseFailures.map((ec: string, i: number) => (
                                <li key={i}>{ec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* On-Demand Mentor Explanation Button */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={handleRequestMentor}
                          disabled={isExplaining}
                          className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isExplaining ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <HelpCircle size={12} />
                          )}
                          Request Detailed Mentor Explanation
                        </button>

                        <span className="text-[10px] text-muted-foreground">
                          Confidence: {assessmentResult.confidence}
                        </span>
                      </div>

                      {/* Explicit Assessment Disclaimer */}
                      <div className="text-[10px] text-muted-foreground/80 px-1 pt-1 border-t border-border/30 flex justify-between">
                        <span>{assessmentResult.disclaimer}</span>
                        <span>
                          {assessmentResult.provider} ({assessmentResult.model})
                          {assessmentResult.cached && " • Cached"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MENTOR GUIDANCE */}
              {consoleTab === "mentor" && (
                <div className="space-y-3">
                  {isExplaining && (
                    <div className="p-4 rounded-lg bg-muted/30 border border-border flex items-center gap-2 text-muted-foreground animate-pulse">
                      <Loader2 size={14} className="animate-spin text-blue-500" />
                      Consulting Kautilya Saarthi AI Mentor...
                    </div>
                  )}

                  {mentorError && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                      {mentorError}
                    </div>
                  )}

                  {mentorResult && !isExplaining && (
                    <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-3">
                      <div>
                        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
                          <Sparkles size={11} /> Mentor Diagnosis
                        </span>
                        <p className="text-xs text-foreground leading-relaxed">
                          {mentorResult.explanation}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-border/50">
                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider block mb-1">
                          Suggested Algorithmic Hint
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {mentorResult.suggestedFixHint}
                        </p>
                      </div>

                      <div className="text-[10px] text-muted-foreground pt-1 flex justify-between">
                        <span>Reused initial assessment context</span>
                        <span>
                          {mentorResult.provider} ({mentorResult.model})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Contest Navigation Bar */}
            <div className="h-14 border-t border-white/[0.06] px-4 flex items-center justify-between bg-black shrink-0">
              <div className="text-[11px] text-muted-foreground hidden sm:block">
                Auto-saved locally for this practice round
              </div>

              <div className="flex gap-2 sm:gap-2.5 ml-auto items-center">
                <button
                  onClick={() => setMobileTab("editor")}
                  className="lg:hidden px-3 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-foreground font-bold text-xs uppercase tracking-wider rounded-md border border-white/[0.12] transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Code2 size={13} className="text-violet-400" />
                  <span>Edit Code</span>
                </button>

                <button
                  onClick={handleSaveAndNext}
                  className="px-3.5 sm:px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-bold text-xs uppercase tracking-wider rounded-md border border-border transition-all active:scale-95 cursor-pointer"
                >
                  {currentIndex === questions.length - 1 ? "Save Current" : "Save & Next"}
                </button>

                {currentIndex === questions.length - 1 && (
                  <button
                    onClick={handleFinishContest}
                    disabled={isFinishing}
                    className="px-5 py-2 bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider rounded-md flex items-center gap-1.5 hover:opacity-90 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isFinishing ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={13} />
                    )}
                    Finish Practice Contest
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
