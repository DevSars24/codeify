"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  Terminal, Cpu, Shield, Zap, Globe, BarChart3, 
  ArrowRight, Sparkles, CheckCircle2, Lock, Users, ChevronRight 
} from "lucide-react";

// Animation helpers
const fw = (d = 0) => ({
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
      <main className="min-h-screen bg-[#030712] text-slate-300 overflow-x-hidden font-sans">
        
        {/* ════════════ HERO SECTION ════════════ */}
        <section className="relative pt-32 pb-24 md:pt-52 md:pb-40 px-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-20">
          {/* Subtle background glow */}
          <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/15 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />

          {/* Left Text */}
          <div className="flex-1 z-10 text-center lg:text-left relative">
            <motion.div {...fw(0)} className="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#0d1224]/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide backdrop-blur-md shadow-[0_0_20px_rgba(79,70,229,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              New: Institutional environments
            </motion.div>
            
            <motion.h1 {...fw(0.1)} className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold text-white tracking-tighter leading-[1.05] mb-8">
              Automate your <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] animate-[gradientShift_8s_ease_infinite]">
                coding workflows
              </span>
            </motion.h1>
            
            <motion.p {...fw(0.2)} className="text-lg md:text-xl text-slate-400/90 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              CodeSaarthi is designed to give you your time back by getting daily technical work done faster through automated environments, AI-assisted logic, and seamless collaboration.
            </motion.p>
            
            <motion.div {...fw(0.3)} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <button onClick={() => router.push("/welcome")} className="relative group overflow-hidden px-10 py-4 rounded-full bg-indigo-600 text-white font-semibold transition-all hover:scale-105 shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(79,70,229,0.6)]">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-2">Start Free Trial <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
              </button>
              <button onClick={() => router.push("/sign-in")} className="px-10 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold transition-all backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]">
                Book a demo
              </button>
            </motion.div>
          </div>

          {/* Right Graphic (Premium Terminal) */}
          <motion.div {...fw(0.4)} className="flex-1 w-full max-w-2xl lg:max-w-none relative z-10 perspective-1000">
            <div className="relative rounded-2xl bg-[#0a0f1d]/80 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden transform-gpu rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
              {/* Glossy top highlight */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
              
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-[#0d1224]/50">
                <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>

              {/* Terminal Body */}
              <div className="p-8 space-y-5 font-mono text-[15px] leading-relaxed">
                <div className="flex gap-4">
                  <span className="text-indigo-400">import</span> 
                  <span className="text-slate-300">&#123; AI &#125;</span> 
                  <span className="text-indigo-400">from</span> 
                  <span className="text-emerald-400">"@codesaarthi/core"</span>;
                </div>
                <div className="flex gap-4">
                  <span className="text-indigo-400">const</span> 
                  <span className="text-cyan-400">engine</span> 
                  <span className="text-slate-300">=</span> 
                  <span className="text-indigo-400">new</span> 
                  <span className="text-amber-200">AI</span>();
                </div>
                
                <div className="h-2" />
                <div className="flex gap-4 opacity-60">
                  <span className="text-slate-400">// Initialize neural environment</span>
                </div>
                
                <div className="flex gap-4">
                  <span className="text-indigo-400">await</span> 
                  <span className="text-cyan-400">engine</span>.
                  <span className="text-amber-200">start</span>(&#123;
                </div>
                <div className="flex gap-4 pl-6">
                  <span className="text-slate-300">mode:</span> 
                  <span className="text-emerald-400">"elite"</span>,
                </div>
                <div className="flex gap-4 pl-6">
                  <span className="text-slate-300">latency:</span> 
                  <span className="text-rose-400">0</span>
                </div>
                <div className="flex gap-4">&#125;);</div>
                
                <div className="flex items-center gap-2 pt-4">
                  <span className="text-indigo-500">~</span>
                  <span className="w-2.5 h-5 bg-cyan-400/80 animate-pulse" />
                </div>
              </div>
              
              {/* Subtle inner glow */}
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
            </div>
          </motion.div>
        </section>

        {/* ════════════ FEATURES GRID ════════════ */}
        <section className="relative py-24 px-6 bg-[#030712] overflow-hidden">
          {/* Subtle tiled ruler grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          {/* Premium top border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <motion.div {...fw(0)} className="w-12 h-12 mx-auto bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="text-indigo-400" size={24} />
              </motion.div>
              <motion.h2 {...fw(0.1)} className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Your new automation <br /> layer for engineering
              </motion.h2>
              <motion.p {...fw(0.2)} className="text-slate-400 text-lg">
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
                  <div className="p-8 h-full rounded-3xl bg-[#0a0f1d]/40 shadow-2xl backdrop-blur-xl transition-all duration-700 transform-gpu group-hover:scale-105 group-hover:-translate-y-3 group-hover:rotate-x-[5deg] group-hover:rotate-y-[-5deg] group-hover:bg-[#0a0f1d]/60 border border-transparent group-hover:border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none" />
                    <div className="relative z-10">
                    <div className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold tracking-wider uppercase rounded-full mb-6">
                      {item.badge}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 pr-4">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                      {item.desc}
                    </p>
                    <Link href="#" className="text-indigo-400 text-sm font-semibold flex items-center gap-2 hover:text-indigo-300 transition-colors">
                      Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.4)] z-10">
                  <span className="text-white font-bold text-2xl">CS</span>
                </div>
                
                {/* Orbiting nodes (simplified representation) */}
                <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-lg"><Globe size={20} className="text-blue-400"/></div>
                <div className="absolute top-1/4 right-1/4 w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-lg"><Terminal size={24} className="text-green-400"/></div>
                <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-lg"><Cpu size={18} className="text-orange-400"/></div>
                <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-lg"><Zap size={28} className="text-yellow-400"/></div>
                
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
              <motion.h2 {...fw(0.1)} className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Connect your favorite <br className="hidden lg:block"/> apps & services
              </motion.h2>
              <motion.p {...fw(0.2)} className="text-slate-400 text-lg mb-8 leading-relaxed">
                Take automation to the next level by connecting to your existing tools. Notify your co-workers in Slack, keep your repos up to date, or save outputs in your favorite storage tool.
              </motion.p>
              <motion.button {...fw(0.3)} className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold transition-all backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]">
                Explore Integrations
              </motion.button>
            </div>
          </div>
        </section>

        {/* ════════════ TESTIMONIALS ════════════ */}
        <section className="relative py-24 px-6 bg-[#030712] overflow-hidden">
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
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-indigo-500/20" />
                  
                  {/* Quote mark icon */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg">
                    <span className="text-indigo-400 text-5xl font-serif leading-none pt-4">"</span>
                  </div>
                  
                  <p className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed mb-10 relative z-10">
                    "We've scaled up our engineering team by 10x in 2 years, and CodeSaarthi helps us keep infrastructure costs and headcount stable as we grow."
                  </p>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-cyan-500" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm tracking-wide">PETER J. DAWSON</div>
                      <div className="text-indigo-400 text-xs font-semibold tracking-wider">CTO, INVISO</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div {...fw(0.3)} className="text-center mt-16">
              <Link href="#" className="text-indigo-400 text-sm font-semibold flex items-center justify-center gap-2 hover:text-indigo-300 transition-colors">
                Read more about why companies trust us <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ════════════ SECONDARY FEATURES ════════════ */}
        <section className="py-24 px-6 border-t border-slate-800/50">
          <div className="max-w-4xl mx-auto">
            <motion.h2 {...fw(0)} className="text-3xl font-bold text-white text-center mb-16 tracking-tight">
              We care about your code
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-16">
              <motion.div {...fw(0.1)} className="text-center md:text-left">
                <div className="w-16 h-16 mx-auto md:mx-0 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-lg border border-slate-700">
                  <Lock className="text-indigo-400" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Your digital Fort Knox</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We take security extremely seriously. Your data is fully protected with AES-256 encryption, 2-factor authentication, and fraud detection built-in.
                </p>
              </motion.div>
              
              <motion.div {...fw(0.2)} className="text-center md:text-left">
                <div className="w-16 h-16 mx-auto md:mx-0 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-lg border border-slate-700">
                  <Users className="text-cyan-400" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Friendly human support</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  We have real humans ready to help you. If you get stuck, have questions or want to share feedback with us.
                </p>
                <Link href="#" className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 transition-colors">
                  Contact us
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════ BOTTOM CTA ════════════ */}
        <section className="py-24 px-6 bg-slate-900/40 border-t border-slate-800/50 relative overflow-hidden">
          {/* Decorative dots pattern */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-20 pointer-events-none"
            style={{ backgroundImage:"radial-gradient(circle, #fff 2px, transparent 2px)", backgroundSize:"20px 20px" }} />
            
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div {...fw(0)} className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold tracking-wider uppercase rounded mb-6">
              Get Started
            </motion.div>
            <motion.h2 {...fw(0.1)} className="text-3xl md:text-5xl font-bold text-white mb-10 tracking-tight">
              Ready for a delightful, high-performance alternative?
            </motion.h2>
            <motion.div {...fw(0.2)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => router.push("/welcome")} className="relative group overflow-hidden w-full sm:w-auto px-10 py-4 rounded-full bg-indigo-600 text-white font-semibold transition-all hover:scale-105 shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(79,70,229,0.6)]">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-2">Start Free Trial <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
              </button>
              <button onClick={() => router.push("/sign-in")} className="w-full sm:w-auto px-10 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold transition-all backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]">
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
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">CS</div>
                  <span className="font-bold text-white text-lg tracking-tight">CodeSaarthi</span>
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
