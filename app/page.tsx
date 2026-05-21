"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  Terminal, Cpu, Shield, Zap, Globe, BarChart3,
  ArrowRight, Sparkles, CheckCircle2, Lock, Users, ChevronRight, Command
} from "lucide-react";

// Animation helpers
const fw = (d = 0): any => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] },
});

export default function LandingPage() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#040508] text-[#F0F0F8] overflow-x-hidden font-sans relative">
        {/* Ambient Background Image */}
        <div
          className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/main-page.jpg')",
            opacity: 0.40,
            filter: "brightness(0.8) contrast(1.05)",
          }}
        />
        {/* Radial vignette mask - color graded to blend the background image perfectly */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(4,5,8,0.15)_0%,rgba(4,5,8,0.75)_45%,#040508_95%)]" />

        {/* ════════════ HERO SECTION ════════════ */}
        <section className="relative pt-32 pb-24 md:pt-52 md:pb-40 px-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-20">
          {/* Subtle background glow */}
          <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-[#7868b8]/15 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-[#8878c8]/10 blur-[150px] rounded-full pointer-events-none" />

          {/* Left Text */}
          <div className="flex-1 z-10 text-center lg:text-left relative">
            <motion.div {...fw(0)} className="mb-8 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0F1120]/90 border border-[#7C6FE0]/30 text-[#A89FF5] text-xs font-medium tracking-wide backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C6FE0] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7C6FE0]" />
              </span>
              New: Institutional environments
            </motion.div>

            <motion.h1 {...fw(0.1)} className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white tracking-tight leading-[1.05] mb-8 drop-shadow-[0_4px_24px_rgba(8,10,18,0.85)]">
              Automate your <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C6FE0] via-[#A89FF5] to-[#7C6FE0] bg-[length:200%_auto] animate-[gradientShift_8s_ease_infinite] drop-shadow-[0_2px_12px_rgba(124,111,224,0.35)]">
                coding workflows
              </span>
            </motion.h1>

            <motion.p {...fw(0.2)} className="text-lg md:text-xl text-[#8B8FA8] mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              CodeSaarthi is designed to give you your time back by getting daily technical work done faster through automated environments, AI-assisted logic, and seamless collaboration.
            </motion.p>

            <motion.div {...fw(0.3)} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <button onClick={() => router.push("/welcome")} className="relative group overflow-hidden px-10 py-4 rounded-full bg-gradient-to-r from-[#7C6FE0] to-[#8B7FE8] text-white font-semibold tracking-wide transition-all hover:scale-[1.02] border border-white/10 hover:border-white/30 shadow-[0_0_30px_rgba(124,111,224,0.35)] hover:shadow-[0_0_50px_rgba(124,111,224,0.65)] cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8B7FE8] to-[#7C6FE0] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-2">Start Free Trial <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
              </button>
              <button onClick={() => router.push("/sign-in")} className="px-10 py-4 rounded-full bg-white/5 hover:bg-[#7C6FE0]/10 text-white font-semibold tracking-wide border border-white/10 hover:border-[#7C6FE0]/40 transition-all backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_40px_rgba(124,111,224,0.35)] cursor-pointer">
                Book a demo
              </button>
            </motion.div>
          </div>

          {/* Right Graphic (Premium Terminal) */}
          <motion.div {...fw(0.4)} className="flex-1 w-full max-w-2xl lg:max-w-none relative z-10 perspective-1000">
            <div className="relative rounded-2xl bg-[#0A0B16]/90 border border-[#14172B] shadow-2xl backdrop-blur-2xl overflow-hidden hover:shadow-[0_20px_80px_rgba(124,111,224,0.22)] hover:border-[#7C6FE0]/40 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-700 ease-[0.16,1,0.3,1] group">
              {/* Glossy top highlight */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7C6FE0]/40 to-transparent" />

              {/* Terminal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#14172B]/85 bg-[#06070D]/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[0_0_8px_rgba(255,95,86,0.3)]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[0_0_8px_rgba(255,189,46,0.3)]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[0_0_8px_rgba(39,201,63,0.3)]" />
                </div>
                {/* File tab bar */}
                <div className="flex items-center gap-1.5 text-xs text-[#8B8FA8] font-mono select-none">
                  <span className="px-3.5 py-1.5 rounded-t-lg bg-[#0A0B16] text-[#F0F0F8] border-t-2 border-[#7C6FE0] border-x border-[#14172B] flex items-center gap-2 shadow-inner">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500/20 text-[#60a5fa] font-bold text-[8px] flex items-center justify-center">TS</span> 
                    saarthi.config.ts
                    <span className="text-slate-500 hover:text-white transition-colors cursor-pointer text-[9px] font-sans ml-1">×</span>
                  </span>
                  <span className="px-3.5 py-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-2 font-medium">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500/10 text-[#60a5fa]/60 font-bold text-[8px] flex items-center justify-center">TS</span>
                    index.ts
                  </span>
                </div>
                <div className="w-12" /> {/* alignment spacer */}
              </div>

              {/* Terminal Body */}
              <div className="p-8 font-mono text-[14px] leading-relaxed text-[#F0F0F8] bg-[#0A0B16]/30">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="w-8 text-slate-600 select-none text-right pr-4 border-r border-white/[0.03]">1</td>
                      <td className="pl-4">
                        <span className="text-[#7C6FE0] font-medium">import</span> <span className="text-white">&#123;</span> <span className="text-[#8E82E9]">AI</span> <span className="text-white">&#125;</span> <span className="text-[#7C6FE0] font-medium">from</span> <span className="text-emerald-300">"@codesaarthi/core"</span>;
                      </td>
                    </tr>
                    <tr>
                      <td className="w-8 text-slate-600 select-none text-right pr-4 border-r border-white/[0.03]">2</td>
                      <td className="pl-4">
                        <span className="text-[#7C6FE0] font-medium">const</span> <span className="text-sky-300">engine</span> <span className="text-white">=</span> <span className="text-[#7C6FE0] font-medium">new</span> <span className="text-[#8E82E9]">AI</span>();
                      </td>
                    </tr>
                    <tr>
                      <td className="w-8 text-slate-600 select-none text-right pr-4 border-r border-white/[0.03]">3</td>
                      <td className="pl-4">
                        <span className="text-slate-500 font-mono italic">// Initialize neural environment</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-8 text-slate-600 select-none text-right pr-4 border-r border-white/[0.03]">4</td>
                      <td className="pl-4">
                        <span className="text-[#7C6FE0] font-medium">await</span> <span className="text-sky-300">engine</span>.<span className="text-[#8E82E9]">start</span>(<span className="text-white">&#123;</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-8 text-slate-600 select-none text-right pr-4 border-r border-white/[0.03]">5</td>
                      <td className="pl-4">
                        <span className="pl-4 text-slate-300">mode:</span> <span className="text-emerald-300">"elite"</span>,
                      </td>
                    </tr>
                    <tr>
                      <td className="w-8 text-slate-600 select-none text-right pr-4 border-r border-white/[0.03]">6</td>
                      <td className="pl-4">
                        <span className="pl-4 text-slate-300">latency:</span> <span className="text-rose-300">0</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-8 text-slate-600 select-none text-right pr-4 border-r border-white/[0.03]">7</td>
                      <td className="pl-4">
                        <span className="text-white">&#125;</span>);
                      </td>
                    </tr>
                    <tr>
                      <td className="w-8 text-slate-600 select-none text-right pr-4 border-r border-white/[0.03]">8</td>
                      <td className="pl-4">
                        <span className="text-[#7C6FE0]">~</span> <span className="inline-block w-[2px] h-[15px] bg-[#7C6FE0] animate-pulse ml-0.5 align-middle" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Terminal Footer status bar */}
              <div className="flex items-center justify-between px-6 py-3 border-t border-[#14172B]/60 bg-[#06070D]/90 text-[10px] text-slate-500 font-mono">
                <div>src/saarthi.config.ts</div>
                <div className="flex items-center gap-3">
                  <span>UTF-8</span>
                  <span>TypeScript</span>
                  <span>Ln 8, Col 5</span>
                </div>
              </div>

              {/* Subtle inner glow */}
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#7868b8]/10 blur-[80px] rounded-full pointer-events-none" />
            </div>
          </motion.div>
        </section>

        {/* ════════════ FEATURES GRID ════════════ */}
        <section className="relative py-24 px-6 bg-[#020305] overflow-hidden">
          {/* Subtle tiled ruler grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          {/* Premium top border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <motion.div {...fw(0)} className="w-12 h-12 mx-auto bg-[#7C6FE0]/10 border border-[#7C6FE0]/25 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="text-[#7C6FE0]" size={24} />
              </motion.div>
              <motion.h2 {...fw(0.1)} className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-[0_4px_12px_rgba(8,10,18,0.9)]">
                Your new automation <br /> layer for engineering
              </motion.h2>
              <motion.p {...fw(0.2)} className="text-[#8B8FA8] text-base md:text-lg font-medium">
                CodeSaarthi lives on top of your existing workflows and lets you set up rules that automate everything from provisioning to deployment—all while keeping your code secure.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                { badge: "WORKSPACE", title: "A single inbox for all your projects", desc: "Sync, upload, or clone a repo and let CodeSaarthi read, analyze, and map all the data to your development environment." },
                { badge: "WORKFLOWS", title: "Advanced workflow automation", desc: "Create automated pipelines with multi-step approvals based on tests, security, resources, and more. Automate categorization." },
                { badge: "INTELLIGENCE", title: "Intelligent code assistance", desc: "Use AI to automatically write boilerplate based on the rules you set, without worrying about syntax errors and bugs." }
              ].map((item, i) => (
                <motion.div key={i} {...fw(0.1 * i + 0.3)} className="relative group perspective-1000">
                  <div className={`p-8 h-full rounded-3xl backdrop-blur-xl transition-all duration-500 relative overflow-hidden ${
                    i === 2 
                      ? "border-[#7C6FE0]/50 shadow-[0_0_30px_rgba(124,111,224,0.15)] bg-gradient-to-b from-[#0F1120] to-[#12142B]/85" 
                      : "border-[#1C1F35] bg-[#0F1120]/80 group-hover:border-[#7C6FE0]/40 group-hover:bg-[#0F1120]/95"
                  } border group-hover:shadow-[0_0_30px_rgba(124,111,224,0.15),0_15px_40px_rgba(0,0,0,0.5)] group-hover:scale-[1.03] group-hover:-translate-y-2`}>
                    
                    {/* Hover radial glowing backdrop overlay */}
                    <div className="absolute -inset-px bg-[radial-gradient(circle_at_center,rgba(124,111,224,0.12),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    {/* Top border light line on hover */}
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#7C6FE0]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="inline-block px-3 py-1 bg-[#7C6FE0]/10 border border-[#7C6FE0]/25 text-[#A89FF5] text-[10px] font-extrabold tracking-widest uppercase rounded-full mb-6">
                        {item.badge}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4 pr-4">{item.title}</h3>
                      <p className="text-[#8B8FA8] text-sm font-medium leading-relaxed mb-8">
                        {item.desc}
                      </p>
                      <Link href="#" className="text-[#7C6FE0] text-sm font-bold tracking-wide flex items-center gap-2 hover:text-[#A89FF5] transition-colors group/link">
                        Read More <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ INTEGRATIONS (2 COL) ════════════ */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16 relative z-10">
            <motion.div {...fw(0.2)} className="flex-1 w-full relative">
              <div className="aspect-square max-w-md mx-auto relative">
                {/* Central Hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#7868b8] rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(120,104,184,0.4)] z-10">
                  <span className="text-white font-bold text-2xl">CS</span>
                </div>

                {/* Orbiting nodes (simplified representation) */}
                <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-lg"><Globe size={20} className="text-blue-400" /></div>
                <div className="absolute top-1/4 right-1/4 w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-lg"><Terminal size={24} className="text-green-400" /></div>
                <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-lg"><Cpu size={18} className="text-orange-400" /></div>
                <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-lg"><Zap size={28} className="text-yellow-400" /></div>

                {/* Connecting lines (bg) */}
                <svg className="absolute inset-0 w-full h-full text-slate-800 pointer-events-none" style={{ zIndex: 0 }}>
                  <circle cx="50%" cy="50%" r="35%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                </svg>
              </div>
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <motion.div {...fw(0)} className="inline-block px-3 py-1 bg-pink-500/10 text-pink-400 text-[10px] font-bold tracking-wider uppercase rounded mb-6">
                Integrations
              </motion.div>
              <motion.h2 {...fw(0.1)} className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-[0_4px_12px_rgba(3,7,18,0.9)]">
                Connect your favorite <br className="hidden lg:block" /> apps & services
              </motion.h2>
              <motion.p {...fw(0.2)} className="text-slate-200 text-lg font-semibold mb-8 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                Take automation to the next level by connecting to your existing tools. Notify your co-workers in Slack, keep your repos up to date, or save outputs in your favorite storage tool.
              </motion.p>
              <motion.button {...fw(0.3)} className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold tracking-wide border border-white/10 hover:border-[#7868b8]/40 transition-all backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_40px_rgba(120,104,184,0.4)]">
                Explore Integrations
              </motion.button>
            </div>
          </div>
        </section>

        {/* ════════════ TESTIMONIALS ════════════ */}
        <section className="relative py-24 px-6 bg-[#020305] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.h2 {...fw(0)} className="text-3xl md:text-4xl font-bold text-white text-center mb-16 tracking-tight">
              Used by forward-thinking <br /> engineers
            </motion.h2>

            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Logos Grid */}
              <motion.div {...fw(0.1)} className="flex-1 grid grid-cols-2 gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex justify-center"><div className="text-xl font-bold text-slate-300">Google</div></div>
                <div className="flex justify-center"><div className="text-xl font-bold text-slate-300">Microsoft</div></div>
                <div className="flex justify-center"><div className="text-xl font-bold text-slate-300">Amazon</div></div>
                <div className="flex justify-center"><div className="text-xl font-bold text-slate-300">Meta</div></div>
                <div className="flex justify-center"><div className="text-xl font-bold text-slate-300">Netflix</div></div>
                <div className="flex justify-center"><div className="text-xl font-bold text-slate-300">Apple</div></div>
              </motion.div>

              {/* Testimonial Card */}
              <motion.div {...fw(0.2)} className="flex-1 w-full max-w-lg">
                <div className="relative bg-[#0a0f1d]/60 border border-white/[0.06] backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#7868b8]/10 blur-[80px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-[#7868b8]/20" />

                  {/* Quote mark icon */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#7868b8]/20 border border-[#7868b8]/30 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg">
                    <span className="text-[#8878c8] text-5xl font-serif leading-none pt-4">"</span>
                  </div>

                  <p className="text-slate-200 text-lg md:text-xl font-semibold leading-relaxed mb-10 relative z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                    "We've scaled up our engineering team by 10x in 2 years, and CodeSaarthi helps us keep infrastructure costs and headcount stable as we grow."
                  </p>

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-[#7868b8] to-[#8878c8]" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm tracking-wide">PETER J. DAWSON</div>
                      <div className="text-[#8878c8] text-xs font-semibold tracking-wider">CTO, INVISO</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div {...fw(0.3)} className="text-center mt-16">
              <Link href="#" className="text-[#8878c8] text-sm font-semibold flex items-center justify-center gap-2 hover:text-[#a898e8] transition-colors">
                Read more about why companies trust us <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ════════════ SECONDARY FEATURES ════════════ */}
        <section className="py-24 px-6 border-t border-[#14172B]/60">
          <div className="max-w-4xl mx-auto">
            <motion.h2 {...fw(0)} className="text-3xl font-bold text-white text-center mb-16 tracking-tight">
              We care about your code
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-16">
              <motion.div {...fw(0.1)} className="text-center md:text-left">
                <div className="w-16 h-16 mx-auto md:mx-0 bg-[#0A0B16] rounded-full flex items-center justify-center mb-6 shadow-lg border border-[#14172B]">
                  <Lock className="text-[#8878c8]" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Your digital Fort Knox</h3>
                <p className="text-slate-200 text-sm font-semibold leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                  We take security extremely seriously. Your data is fully protected with AES-256 encryption, 2-factor authentication, and fraud detection built-in.
                </p>
              </motion.div>

              <motion.div {...fw(0.2)} className="text-center md:text-left">
                <div className="w-16 h-16 mx-auto md:mx-0 bg-[#0A0B16] rounded-full flex items-center justify-center mb-6 shadow-lg border border-[#14172B]">
                  <Users className="text-[#8878c8]" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Friendly human support</h3>
                <p className="text-slate-200 text-sm font-semibold leading-relaxed mb-4 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                  We have real humans ready to help you. If you get stuck, have questions or want to share feedback with us.
                </p>
                <Link href="#" className="text-[#8878c8] text-sm font-bold hover:text-[#a898e8] transition-colors">
                  Contact us
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════ BOTTOM CTA ════════════ */}
        <section className="py-24 px-6 bg-[#020305]/65 border-t border-[#14172B]/60 relative overflow-hidden">
          {/* Decorative dots pattern */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-20 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #fff 2px, transparent 2px)", backgroundSize: "20px 20px" }} />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div {...fw(0)} className="inline-block px-3 py-1 bg-[#7868b8]/10 text-[#8878c8] text-[10px] font-bold tracking-wider uppercase rounded mb-6">
              Get Started
            </motion.div>
            <motion.h2 {...fw(0.1)} className="text-3xl md:text-5xl font-bold text-white mb-10 tracking-tight drop-shadow-[0_4px_16px_rgba(3,7,18,0.95)]">
              Ready for a delightful, high-performance alternative?
            </motion.h2>
            <motion.div {...fw(0.2)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => router.push("/welcome")} className="relative group overflow-hidden w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#7868b8] to-[#8878c8] text-white font-bold tracking-wide transition-all hover:scale-105 border border-white/20 hover:border-white/40 shadow-[0_0_30px_rgba(120,104,184,0.6)] hover:shadow-[0_0_50px_rgba(136,120,200,0.9)]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8878c8] to-[#7868b8] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-2">Start Free Trial <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
              </button>
              <button onClick={() => router.push("/sign-in")} className="w-full sm:w-auto px-10 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold tracking-wide border border-white/10 hover:border-[#7868b8]/40 transition-all backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_40px_rgba(120,104,184,0.4)]">
                Book a demo
              </button>
            </motion.div>
          </div>
        </section>

        {/* ════════════ FOOTER ════════════ */}
        <footer className="pt-16 pb-8 px-6 border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
              {/* Brand & Language */}
              <div className="space-y-6 lg:w-1/4">
                <div className="flex items-center gap-2.5 group select-none">
                  <div className="w-8 h-8 rounded-full bg-[#0A0B16] border border-[#7C6FE0]/30 text-[#7C6FE0] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-[#7C6FE0]/65 group-hover:bg-[#7C6FE0]/10 shadow-[0_0_15px_rgba(124,111,224,0.15)]">
                    <Command size={16} strokeWidth={3} className="text-[#7C6FE0]" />
                  </div>
                  <span className="font-bold text-white text-lg tracking-tight lowercase">
                    codesaarthi<span className="text-[#7C6FE0]">.</span>
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400">
                  <span>🇺🇸</span> United States <ChevronRight size={14} />
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:w-3/4">
                {[
                  { title: "Company", links: ["About", "Blog", "Careers"] },
                  { title: "Solutions", links: ["For Startups", "For Enterprise"] },
                  { title: "Product", links: ["Features", "Integrations", "Pricing"] },
                  { title: "Resources", links: ["Documentation", "Support", "Contact"] },
                ].map((col, i) => (
                  <div key={i} className="space-y-4">
                    <h4 className="text-white font-semibold text-sm">{col.title}</h4>
                    <ul className="space-y-3">
                      {col.links.map(link => (
                        <li key={link}><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">{link}</Link></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-800/50">
              <p className="text-xs text-slate-500">© 2026 CodeSaarthi Inc. All rights reserved.</p>
              <div className="flex gap-6 text-xs text-slate-500">
                <Link href="#" className="hover:text-white transition-colors">Security</Link>
                <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
