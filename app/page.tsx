"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  Terminal, Cpu, Zap, Globe, ArrowRight, CheckCircle2, Lock, Users, ChevronRight, Command, Sparkles
} from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        opacity: 0,
        y: 12,
        duration: 0.45,
        stagger: 0.08,
        ease: "power2.out",
      });

      gsap.from(".hero-terminal", {
        opacity: 0,
        x: 24,
        duration: 0.5,
        delay: 0.25,
        ease: "power3.out",
      });

      if (featuresRef.current) {
        gsap.from(".feature-card", {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            once: true,
          },
          opacity: 0,
          y: 16,
          duration: 0.4,
          stagger: 0.12,
          ease: "power2.out",
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <main ref={heroRef} className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Hero */}
        <section className="pt-28 pb-20 md:pt-36 md:pb-28 px-6 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="hero-line inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted border border-border text-xs font-medium text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                AI-powered coding platform
              </div>

              <h1 className="hero-line text-4xl md:text-5xl lg:text-[3.25rem] font-semibold tracking-tight leading-[1.1] text-foreground">
                Practice, compete, and ship code — in one workspace.
              </h1>

              <p className="hero-line text-lg text-muted-foreground max-w-lg leading-relaxed">
                CodeSaarthi gives you structured DSA contests, dev challenges, live sessions, and mission logs — without leaving the browser.
              </p>

              <div className="hero-line flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push("/welcome")}
                  className="btn-primary cursor-pointer"
                >
                  Get started <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => router.push("/sign-in")}
                  className="btn-secondary cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            </div>

            {/* Terminal preview */}
            <div className="hero-terminal surface-card shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">saarthi.config.ts</span>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed bg-card">
                <p><span className="text-primary">import</span> {"{ AI }"} <span className="text-primary">from</span> <span className="text-emerald-600 dark:text-emerald-400">&quot;@codesaarthi/core&quot;</span>;</p>
                <p className="mt-1"><span className="text-primary">const</span> engine = <span className="text-primary">new</span> AI();</p>
                <p className="mt-1 text-muted-foreground">// Initialize environment</p>
                <p className="mt-1"><span className="text-primary">await</span> engine.start({"{"}</p>
                <p className="pl-4">mode: <span className="text-emerald-600 dark:text-emerald-400">&quot;elite&quot;</span>,</p>
                <p className="pl-4">latency: <span className="text-rose-500">0</span></p>
                <p>{"});"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section ref={featuresRef} id="features" className="py-20 px-6 border-t border-border bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 max-w-2xl">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Sparkles size={18} />
                <span className="text-xs font-semibold uppercase tracking-wider">Platform</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                Everything you need to level up
              </h2>
              <p className="text-muted-foreground">
                Contests, analytics, blogs, and live sessions — built for engineers who want deliberate practice.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Terminal, title: "DSA Arena", desc: "Topic-based contests with AI evaluation and instant feedback on your submissions." },
                { icon: Cpu, title: "Dev Challenges", desc: "Real-world tasks across web, backend, and system design — graded by AI mentors." },
                { icon: Zap, title: "Mission Logs", desc: "Track accuracy, XP, and progress over time with clear analytics dashboards." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="feature-card surface-card p-6 hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="surface-card p-8 flex items-center justify-center min-h-[280px]">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">CS</div>
                </div>
                {[Globe, Terminal, Cpu, Zap].map((Icon, i) => (
                  <div
                    key={i}
                    className="absolute w-10 h-10 rounded-md border border-border bg-card flex items-center justify-center"
                    style={{
                      top: `${[10, 10, 70, 70][i]}%`,
                      left: `${[10, 70, 30, 70][i]}%`,
                    }}
                  >
                    <Icon size={16} className="text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Workflow</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                From practice to production
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Connect contests to your learning path. Review mission logs, climb the leaderboard, and join live coding sessions with mentors.
              </p>
              <Link href="/blogs" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
                Explore resources <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="py-20 px-6 border-t border-border bg-muted/30">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                <Lock size={18} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Secure by default</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Authentication via Clerk, encrypted connections, and isolated contest environments.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                <Users size={18} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Built for teams</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Leaderboards, live sessions, and admin tools for instructors running cohorts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
              Ready to start practicing?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join contests, track your progress, and compete on the global leaderboard.
            </p>
            <button onClick={() => router.push("/welcome")} className="btn-primary cursor-pointer">
              Start free <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                <Command size={14} className="text-primary" />
              </div>
              <span className="font-semibold text-sm">codesaarthi</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link href="/blogs" className="hover:text-foreground transition-colors">Blog</Link>
              <Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 CodeSaarthi</p>
          </div>
        </footer>
      </main>
    </>
  );
}
