"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  GitPullRequest,
  Briefcase,
  Terminal,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function MeetDeveloperSection() {
  return (
    <section id="developer" className="py-20 px-4 sm:px-6 border-t border-white/[0.08] relative bg-black/60">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="badge-pill inline-flex mx-auto border-white/[0.08] text-[#7C786F]">
            <Sparkles size={12} className="text-[#E8A33D]" /> Meet The Developer
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[#EDEAE3]">
            The Engineer Behind CodeSaarthi
          </h2>
          <p className="text-sm text-[#A8A49B] leading-relaxed">
            Crafted with passion for high-performance developer tools, algorithmic mastery, and production-grade open source software.
          </p>
        </div>

        {/* Main Developer Bio Card (Glassmorphic) */}
        <div className="rounded-3xl p-5 sm:p-8 border border-white/[0.1] bg-black/70 backdrop-blur-2xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Developer Portrait & Quick Status */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border border-white/15 p-1 bg-white/[0.02] group">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src="/assets/photo.png"
                    alt="Saurabh Singh Rajput - Developer of CodeSaarthi"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 160px, 192px"
                  />
                </div>
                <div className="absolute bottom-2 inset-x-2 py-1 px-2 rounded-lg bg-black/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#7FB08A] flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7FB08A]" />
                  <span>Building Next-Gen Devtools</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-[#EDEAE3] tracking-tight">
                  Saurabh Singh Rajput
                </h3>
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#7C786F]">
                  <GraduationCap size={14} className="text-[#E8A33D]" />
                  <span>3rd Year CSE Undergrad</span>
                </div>
                <p className="text-xs text-[#7C786F]">
                  IIIT Bhagalpur (Indian Institute of Information Technology)
                </p>
              </div>

              {/* Social Links with Clean Glass Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <Link
                  href="https://www.linkedin.com/in/saurabh-singh-rajput-25639a306/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary h-9 px-3.5 text-xs flex items-center gap-1.5 rounded-xl text-[#EDEAE3]"
                >
                  <Linkedin size={14} className="text-[#A8A49B]" />
                  <span>LinkedIn</span>
                  <ExternalLink size={11} className="opacity-60" />
                </Link>

                <Link
                  href="https://github.com/DevSars24"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary h-9 px-3.5 text-xs flex items-center gap-1.5 rounded-xl text-[#EDEAE3]"
                >
                  <Github size={14} className="text-[#A8A49B]" />
                  <span>GitHub</span>
                  <ExternalLink size={11} className="opacity-60" />
                </Link>

                <Link
                  href="https://x.com/stark123474763"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary h-9 px-3.5 text-xs flex items-center gap-1.5 rounded-xl text-[#EDEAE3]"
                >
                  <Twitter size={14} className="text-[#A8A49B]" />
                  <span>X (Twitter)</span>
                  <ExternalLink size={11} className="opacity-60" />
                </Link>
              </div>
            </div>

            {/* Developer Experience & Work Summary */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] text-[#7C786F] font-medium">
                  <Briefcase size={12} className="text-[#E8A33D]" />
                  <span>ENGINEERING EXPERIENCE & OPEN SOURCE ROLES</span>
                </div>
                <p className="text-sm text-[#A8A49B] leading-relaxed">
                  Aspiring AI infra engineer &amp; experienced backend engineer exploring every edge of AI capabilities. Rustacean by heart, Reactacean by mind — Golang is my crush, Next.js is my wife.
                </p>
              </div>

              {/* Work Role 1: Krrid */}
              <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black border border-white/15 flex items-center justify-center p-1 shrink-0">
                      <Image
                        src="/assets/krrid_logo.png"
                        alt="Krrid Academy Logo"
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#EDEAE3] text-sm flex items-center gap-2">
                        Ex Full Stack Developer
                        <span className="text-[#7C786F] font-normal">at</span>
                        <span className="text-[#E8A33D]">Krrid</span>
                      </h4>
                      <p className="text-xs text-[#7C786F]">Chess Learning & EdTech Architecture</p>
                    </div>
                  </div>

                  <Link
                    href="https://www.linkedin.com/company/krridacademy/home/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#E8A33D] hover:underline"
                  >
                    <span>View Company</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>

                <ul className="text-xs text-[#A8A49B] space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Architected and delivered full-stack production features powering interactive chess curriculum, player progression, and tournament workflows.</li>
                  <li>Engineered responsive, low-latency UI interfaces and optimized backend APIs for seamless student experiences.</li>
                </ul>
              </div>

              {/* Open Source Highlights: OpenSRE & Copperhead */}
              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* OpenSRE */}
                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-[#EDEAE3] flex items-center gap-1.5">
                        <Terminal size={13} className="text-[#E8A33D]" />
                        <span>OpenSRE Contributor</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-[#7FB08A] border border-white/[0.08] font-mono">
                        4 Merged PRs
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7C786F] mb-2">
                      Rust-based open-source SRE tooling platform
                    </p>
                    <ul className="text-[11px] text-[#A8A49B] space-y-1 list-disc list-inside leading-relaxed">
                      <li>Refactored tool-framework declarations to enums, improving type safety & eliminating runtime errors.</li>
                      <li>Implemented S3-compatible remote sync provider.</li>
                      <li>Eliminated raw credential logging in gateway service for enhanced security.</li>
                    </ul>
                  </div>

                  <Link
                    href="https://www.linkedin.com/company/opensre/home/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#E8A33D] hover:underline inline-flex items-center gap-1 pt-1"
                  >
                    <span>OpenSRE Profile</span>
                    <ExternalLink size={10} />
                  </Link>
                </div>

                {/* Copperhead */}
                <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-[#EDEAE3] flex items-center gap-1.5">
                        <GitPullRequest size={13} className="text-[#7FB08A]" />
                        <span>Copperhead EDA Contributor</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-[#7FB08A] border border-white/[0.08] font-mono">
                        v0.12.0
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7C786F] mb-2">
                      EDA AI Engine · KiCad Schematic to PCB Bridge
                    </p>
                    <ul className="text-[11px] text-[#A8A49B] space-y-1 list-disc list-inside leading-relaxed">
                      <li>Identified & resolved Issue #314 (Stage 5 schematic-to-PCB footprint transfer capability gap).</li>
                      <li>Eliminated surrogate pad errors (55→75 DRC violations).</li>
                      <li>PR #319 verified by maintainers and merged into official release v0.12.0.</li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] pt-1">
                    <Link
                      href="https://github.com/copperheadhq/copperhead/pull/319"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7FB08A] hover:underline inline-flex items-center gap-1"
                    >
                      <span>PR #319</span>
                      <ExternalLink size={10} />
                    </Link>
                    <span className="text-white/20">·</span>
                    <Link
                      href="https://github.com/copperheadhq/copperhead/issues/314"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7C786F] hover:text-[#EDEAE3] inline-flex items-center gap-1"
                    >
                      <span>Issue #314</span>
                      <ExternalLink size={10} />
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
