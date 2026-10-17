"use client";

import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`relative p-8 rounded-2xl bg-white/[0.025] backdrop-blur-xl border border-white/10 hover:border-white/30 hover:bg-white/[0.045] shadow-xl shadow-black/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 group overflow-hidden ${className}`}
    >
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-white/30 backdrop-blur-md transition-all duration-300">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
