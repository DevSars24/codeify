"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Code2,
  Zap,
  Sparkles,
  ArrowRight,
  Terminal,
  BookOpen,
  Trophy,
} from "lucide-react";

export default function WelcomePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    } else if (isLoaded && isSignedIn) {
      const timer = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

  const quickActions = [
    {
      title: "DSA Arena",
      desc: "Practice Data Structures & Algorithms with AI feedback",
      icon: <Terminal className="w-5 h-5 text-foreground" />,
      href: "/dsa",
      tag: "Algorithms",
    },
    {
      title: "Dev Lab",
      desc: "Build real-world fullstack challenges",
      icon: <Code2 className="w-5 h-5 text-foreground" />,
      href: "/dev",
      tag: "Projects",
    },
    {
      title: "Live Sessions",
      desc: "Join real-time interactive peer coding rooms",
      icon: <Zap className="w-5 h-5 text-foreground" />,
      href: "/sessions",
      tag: "Realtime",
    },
  ];

  const stats = [
    { label: "Topics", value: "50+", icon: <BookOpen className="w-4 h-4 text-primary" /> },
    { label: "Problems", value: "200+", icon: <Code2 className="w-4 h-4 text-primary" /> },
    { label: "Compete", value: "Live", icon: <Trophy className="w-4 h-4 text-primary" /> },
  ];

  return (
    <div className="min-h-screen bg-ambient-mesh text-foreground overflow-hidden relative">
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 pt-32 md:pt-40 pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero Section */}
          <div
            className={`text-center space-y-5 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Greeting Badge */}
            <div className="badge-pill mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-foreground" />
              <span>Workspace Active</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-frost">
              Hello, {user?.firstName || "Developer"}
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Your practice queue is ready. Step into the arena, solve challenges, and hone your algorithmic instincts.
            </p>
          </div>

          {/* Quick Stats */}
          <div
            className={`flex justify-center gap-8 md:gap-16 transition-all duration-700 delay-150 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1 group-hover:text-foreground transition-colors">
                  {stat.icon}
                  <span className="text-[11px] font-mono uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold font-mono text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Action Cards */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-5 transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => router.push(action.href)}
                className="glass-card p-7 text-left group transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl border border-white/[0.1] bg-white/[0.03] flex items-center justify-center group-hover:scale-105 group-hover:border-white/[0.2] transition-all">
                      {action.icon}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-muted-foreground">
                      {action.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-white transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                    {action.desc}
                  </p>
                </div>

                <div className="flex items-center text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors pt-2 border-t border-white/[0.05]">
                  <span>Launch Module</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          {/* Bottom CTA */}
          <div
            className={`text-center space-y-4 pt-4 transition-all duration-700 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Button
              onClick={() => router.push("/dsa")}
              className="btn-primary cursor-pointer px-8 h-12 text-sm font-semibold"
            >
              <span>Explore Practice Challenges</span>
              <ChevronRight className="ml-1.5 w-4 h-4" />
            </Button>

            <p className="text-muted-foreground/60 text-[11px] font-mono tracking-widest uppercase">
              CodeSaarthi Workspace Engine
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
