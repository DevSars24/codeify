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
    <section id="pricing" className="py-20 sm:py-24 px-4 sm:px-6 border-t border-white/[0.08] relative bg-black/40">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-14">
        
        {/* Section Header */}
        <div className="text-left sm:text-center max-w-2xl sm:mx-auto space-y-3">
          <div className="badge-pill inline-flex sm:mx-auto border-white/[0.08] text-[#7C786F]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
            <span>Currently 100% Free · Plans In Planning</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-[#EDEAE3]">
            Transparent Pricing & Future Tiers
          </h2>
          <p className="text-sm sm:text-base text-[#A8A49B] leading-[1.6]">
            Every feature on CodeSaarthi is currently completely free. Here is what we are planning for heavy power-users and competitive teams.
          </p>
        </div>

        {/* Waitlist Success Notification Toast */}
        {waitlistSuccess && (
          <div className="max-w-md mx-auto p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-[#EDEAE3] text-xs font-mono text-center flex items-center justify-center gap-2 backdrop-blur-md shadow-xl">
            <Check size={14} className="text-[#7FB08A]" />
            <span>You have been added to the priority waitlist for {waitlistSuccess}!</span>
          </div>
        )}

        {/* Pricing Cards Grid (Fully Responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: Community Free (Active Now) */}
          <div className="glass-card-glow rounded-3xl p-6 sm:p-7 border border-white/[0.12] bg-black/80 flex flex-col justify-between relative group transition-colors">
            <div className="absolute -top-3 left-6">
              <span className="text-[10px] font-mono font-medium px-2.5 py-1 rounded-full bg-[#E8A33D] text-[#141008] shadow-sm">
                CURRENTLY ACTIVE · FREE
              </span>
            </div>

            <div className="space-y-6 pt-2">
              <div>
                <h3 className="text-xl font-semibold text-[#EDEAE3] mb-1">Community Beta</h3>
                <p className="text-xs text-[#7C786F]">For every student and developer practicing daily.</p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-semibold text-[#EDEAE3]">$0</span>
                <span className="text-xs text-[#7C786F] font-mono">/ forever during beta</span>
              </div>

              <div className="space-y-3 pt-2 text-xs text-[#A8A49B]">
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#7FB08A] shrink-0 mt-0.5" />
                  <span>Full 11-Language Playground access (No signup required)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#7FB08A] shrink-0 mt-0.5" />
                  <span>Sub-200ms real-time Groq LPU AI code simulation</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#7FB08A] shrink-0 mt-0.5" />
                  <span>Mobile & desktop optimized practice rounds</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#7FB08A] shrink-0 mt-0.5" />
                  <span>Public algorithmic contest leaderboards</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#7FB08A] shrink-0 mt-0.5" />
                  <span>Instant asymptotic complexity review (O(N) diagnostics)</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/home"
                className="btn-primary w-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Practicing Now</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 2: Developer Pro (In Planning - $10/mo) */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/[0.08] bg-black/60 flex flex-col justify-between relative group transition-colors">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[#EDEAE3] mb-1">Developer Pro</h3>
                  <p className="text-xs text-[#7C786F]">For interview preparation & active competitive coders.</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.03] text-[#7C786F] border border-white/[0.08]">
                  IN PLANNING
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-semibold text-[#EDEAE3]">$10</span>
                <span className="text-xs text-[#7C786F] font-mono">/ month (Planned)</span>
              </div>

              <div className="space-y-3 pt-2 text-xs text-[#A8A49B]">
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#7FB08A] shrink-0 mt-0.5" />
                  <span>Everything in Community Free</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#7FB08A] shrink-0 mt-0.5" />
                  <span>Unlimited private mentoring explanations</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#7FB08A] shrink-0 mt-0.5" />
                  <span>Multi-file project sandboxing & custom testcases</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#7FB08A] shrink-0 mt-0.5" />
                  <span>Zero cooldown between contest submissions</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleJoinWaitlist("Developer Pro ($10/mo)")}
                className="btn-secondary w-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <BellRing size={13} />
                <span>Join Pro Waitlist ($10/mo)</span>
              </button>
            </div>
          </div>

          {/* Card 3: Grandmaster / Team (In Planning - $20/mo) */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/[0.08] bg-black/60 flex flex-col justify-between relative group transition-colors">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[#EDEAE3] mb-1">Grandmaster</h3>
                  <p className="text-xs text-[#7C786F]">For university coding clubs, teams, and elite aspirants.</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.03] text-[#7C786F] border border-white/[0.08]">
                  IN PLANNING
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-semibold text-[#EDEAE3]">$20</span>
                <span className="text-xs text-[#7C786F] font-mono">/ month (Planned)</span>
              </div>

              <div className="space-y-3 pt-2 text-xs text-[#A8A49B]">
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#7FB08A] shrink-0 mt-0.5" />
                  <span>Everything in Developer Pro</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#7FB08A] shrink-0 mt-0.5" />
                  <span>1-on-1 AI mock interview simulation with hints</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#7FB08A] shrink-0 mt-0.5" />
                  <span>Custom private contest arenas up to 100 members</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={15} className="text-[#7FB08A] shrink-0 mt-0.5" />
                  <span>Team leaderboard & detailed anti-cheat metrics</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleJoinWaitlist("Grandmaster Team ($20/mo)")}
                className="btn-secondary w-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Crown size={13} className="text-[#E8A33D]" />
                <span>Reserve Team Slot ($20/mo)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Assurance Note */}
        <div className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7C786F]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-[#7FB08A] shrink-0" />
            <span>Community commitment: Core 11-language practice and simulation will always stay free.</span>
          </div>
          <span className="text-[11px] text-[#7C786F]">No credit card required for current access.</span>
        </div>

      </div>
    </section>
  );
}
