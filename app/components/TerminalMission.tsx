"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export default function TerminalMission() {
  const [bootingText, setBootingText] = useState("");
  const [solveText, setSolveText] = useState("");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setBootingText("booting CodeSaarthi...");
      setSolveText("solve()");
      setStep(6);
      return;
    }

    let isCancelled = false;

    const runSequence = async () => {
      // Reset
      setBootingText("");
      setSolveText("");
      setStep(0);

      const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

      // 1. Type booting
      const fullBooting = "booting CodeSaarthi...";
      for (let i = 0; i <= fullBooting.length; i++) {
        if (isCancelled) return;
        setBootingText(fullBooting.slice(0, i));
        await sleep(50);
      }
      setStep(1); // Show connect status
      await sleep(400);

      // 2. Show Connected
      if (isCancelled) return;
      setStep(2); // Show Connected + Mentor status
      await sleep(400);

      // 3. Show Mentor
      if (isCancelled) return;
      setStep(3); // Show Mentor + Mission status
      await sleep(400);

      // 4. Show Focus Area list
      if (isCancelled) return;
      setStep(4);
      await sleep(800);

      // 5. Type solve()
      const fullSolve = "solve()";
      for (let i = 0; i <= fullSolve.length; i++) {
        if (isCancelled) return;
        setSolveText(fullSolve.slice(0, i));
        await sleep(75);
      }
      setStep(5); //solve typed
      await sleep(500);

      // 6. Show Accepted
      if (isCancelled) return;
      setStep(6);
      
      // Wait for loop restart
      await sleep(5000);
      if (!isCancelled) {
        runSequence();
      }
    };

    runSequence();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-black/40 backdrop-blur-xl border border-border/20 rounded-xl overflow-hidden shadow-2xl animate-float">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/10 bg-black/30">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/70 border border-red-500/30 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70 border border-yellow-500/30 animate-pulse delay-75" />
          <div className="w-3 h-3 rounded-full bg-green-500/70 border border-green-500/30 animate-pulse delay-150" />
        </div>
        <span className="text-[10px] tracking-widest text-muted-foreground font-mono uppercase">
          mission_session.sh
        </span>
        <div className="w-12" /> {/* Spacer to center title */}
      </div>

      {/* Terminal Area */}
      <div className="p-6 font-mono text-xs md:text-sm leading-relaxed min-h-[300px] text-zinc-300 select-none bg-black/10">
        {/* Step 0: Booting */}
        <p className="flex items-center gap-1.5 text-zinc-400">
          <span className="text-purple-500 font-bold">&gt;</span>
          <span>{bootingText}</span>
          {step === 0 && (
            <span className="w-1.5 h-4 bg-zinc-300 inline-block animate-cursor-blink" />
          )}
        </p>

        {/* Step 1: connected */}
        {step >= 1 && (
          <p className="text-emerald-400 mt-2 flex items-center gap-2">
            <span className="font-bold">✓</span> arena connected
          </p>
        )}

        {/* Step 2: mentor ready */}
        {step >= 2 && (
          <p className="text-emerald-400 mt-1 flex items-center gap-2">
            <span className="font-bold">✓</span> mentor ready
          </p>
        )}

        {/* Step 3: mission assigned */}
        {step >= 3 && (
          <p className="text-emerald-400 mt-1 flex items-center gap-2">
            <span className="font-bold">✓</span> mission assigned
          </p>
        )}

        {/* Step 4: focus details */}
        {step >= 4 && (
          <div className="mt-4 border-l border-purple-500/30 pl-4 py-1 space-y-1">
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Focus:</p>
            <div className="grid grid-cols-2 gap-x-4 text-xs font-semibold text-zinc-400">
              <p>• Arrays</p>
              <p>• Graphs</p>
              <p>• DP</p>
              <p>• System Design</p>
            </div>
          </div>
        )}

        {/* Step 5: solve() */}
        {step >= 4 && (
          <p className="flex items-center gap-1.5 mt-5 text-zinc-400">
            <span className="text-purple-500 font-bold">&gt;</span>
            <span>{solveText}</span>
            {step === 5 && (
              <span className="w-1.5 h-4 bg-zinc-300 inline-block animate-cursor-blink" />
            )}
          </p>
        )}

        {/* Step 6: Accepted */}
        {step >= 6 && (
          <p className="text-emerald-400 font-extrabold text-sm md:text-base tracking-wider mt-3 pl-5 border-l-2 border-emerald-500 flex items-center gap-2 bg-emerald-500/5 py-2 rounded">
            <span>Accepted</span>
            <span className="animate-bounce">✓</span>
          </p>
        )}
      </div>
    </div>
  );
}
