"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Clock,
  Layers,
  Crown,
  BellRing,
} from "lucide-react";

export default function PricingSection() {
  const [waitlistSuccess, setWaitlistSuccess] = useState<string | null>(null);

  const handleJoinWaitlist = (planName: string) => {
    setWaitlistSuccess(planName);
    setTimeout(() => setWaitlistSuccess(null), 3500);
  };

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 border-t border-white/[0.08] relative bg-black/40">
      <div className="max-w-6xl mx-auto space-y-14">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="badge-pill inline-flex mx-auto border-emerald-500/30 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Currently 100% Free · Plans In Active Planning</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Transparent Pricing & Future Tiers
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every feature on CodeSaarthi is currently completely free to help you sharpen your skills. Here is what we are planning for heavy power-users and competitive teams.
          </p>
        </div>

        {/* Waitlist Success Notification Toast */}
        {waitlistSuccess && (
          <div className="max-w-md mx-auto p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono text-center flex items-center justify-center gap-2 backdrop-blur-md animate-fade-in shadow-xl shadow-emerald-500/5">
            <Check size={14} className="text-emerald-400" />
            <span>You have been added to the priority waitlist for {waitlistSuccess}!</span>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: Community Free (Active Now) */}
          <div className="glass-card-glow rounded-3xl p-7 border border-emerald-500/30 bg-black/80 flex flex-col justify-between relative group hover:border-emerald-500/50 transition-all duration-300">
            <div className="absolute -top-3 left-6">
              <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500 text-black shadow-md">
                CURRENTLY ACTIVE · 100% FREE
              </span>
            </div>

            <div className="space-y-6 pt-2">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Community Beta</h3>
                <p className="text-xs text-muted-foreground">For every student and developer practicing daily.</p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-xs text-muted-foreground font-mono">/ forever during beta</span>
              </div>

              <div className="space-y-3 pt-2 text-xs text-zinc-300">
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Full 11-Language Playground access (No signup required)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Sub-200ms real-time Groq LPU AI code simulation</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Mobile & desktop optimized practice rounds</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Public algorithmic contest leaderboards</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Instant asymptotic complexity review (O(N) diagnostics)</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/home"
                className="btn-primary w-full text-xs font-semibold flex items-center justify-center gap-2"
              >
                <span>Start Practicing Now</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 2: Developer Pro (In Planning - $10/mo) */}
          <div className="glass-card rounded-3xl p-7 border border-white/[0.12] bg-black/60 flex flex-col justify-between relative group hover:border-violet-500/40 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Developer Pro</h3>
                  <p className="text-xs text-muted-foreground">For intense interview preparation & serious coders.</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  IN PLANNING
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-white">$10</span>
                <span className="text-xs text-muted-foreground font-mono">/ month (Planned)</span>
              </div>

              <div className="space-y-3 pt-2 text-xs text-zinc-300">
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-violet-400 shrink-0 mt-0.5" />
                  <span>Everything in Community Free</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-violet-400 shrink-0 mt-0.5" />
                  <span>Dedicated, unthrottled Groq LPU execution compute</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-violet-400 shrink-0 mt-0.5" />
                  <span>Deep AI mentor explanations & code refactor suggestions</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-violet-400 shrink-0 mt-0.5" />
                  <span>Multi-file project sandboxing and custom stress testcases</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-violet-400 shrink-0 mt-0.5" />
                  <span>Zero cooldown between contest evaluation submissions</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleJoinWaitlist("Developer Pro ($10/mo)")}
                className="btn-glass-accent w-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <BellRing size={14} />
                <span>Join Pro Waitlist ($10/mo)</span>
              </button>
            </div>
          </div>

          {/* Card 3: Grandmaster / Team (In Planning - $20/mo) */}
          <div className="glass-card rounded-3xl p-7 border border-white/[0.12] bg-black/60 flex flex-col justify-between relative group hover:border-cyan-500/40 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Grandmaster</h3>
                  <p className="text-xs text-muted-foreground">For university coding clubs, teams, and elite aspirants.</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  IN PLANNING
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-white">$20</span>
                <span className="text-xs text-muted-foreground font-mono">/ month (Planned)</span>
              </div>

              <div className="space-y-3 pt-2 text-xs text-zinc-300">
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span>Everything in Developer Pro</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span>1-on-1 AI mock interview simulation with interactive voice hints</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span>Host custom private contest arenas for up to 100 members</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span>Team leaderboard & detailed anti-cheat telemetry metrics</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span>Direct priority developer support & preview releases</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleJoinWaitlist("Grandmaster Team ($20/mo)")}
                className="btn-secondary w-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer hover:border-cyan-400/50"
              >
                <Crown size={14} className="text-yellow-400" />
                <span>Reserve Team Slot ($20/mo)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Assurance Note */}
        <div className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span>Community commitment: Core 11-language practice and simulation will always stay free.</span>
          </div>
          <span className="text-[11px] text-zinc-500">No credit card required for current access.</span>
        </div>

      </div>
    </section>
  );
}
