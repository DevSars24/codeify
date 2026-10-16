"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import {
  Code2,
  Terminal,
  Zap,
  ArrowRight,
  Sparkles,
  BookOpen,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

  const quickActions = [
    {
      title: "DSA Arena",
      desc: "Practice Data Structures & Algorithms with real-time AI feedback & testcase validation",
      image: "/assets/anime_mobile_coder.jpg",
      icon: <Terminal className="w-4 h-4 text-violet-300" />,
      href: "/dsa",
      tag: "Algorithms",
    },
    {
      title: "Dev Lab",
      desc: "Build real-world fullstack challenges with strategic mentor feedback",
      image: "/assets/webdev.jpeg",
      icon: <Code2 className="w-4 h-4 text-cyan-300" />,
      href: "/dev",
      tag: "Projects",
    },
    {
      title: "11-Language Playground",
      desc: "Instant code review, execution simulation, and auto-fix across 11 programming languages",
      image: "/assets/anime_coder_hero.jpg",
      icon: <Sparkles className="w-4 h-4 text-amber-300" />,
      href: "/home",
      tag: "11 Languages",
    },
    {
      title: "Contest Arena & Live Sessions",
      desc: "Join real-time competitive coding battles, tournaments, and mentor rooms",
      image: "/assets/anime_coding_contest.jpg",
      icon: <Zap className="w-4 h-4 text-emerald-300" />,
      href: "/sessions",
      tag: "Realtime",
    },
  ];

  const stats = [
    { label: "Topics", value: "50+", icon: <BookOpen className="w-4 h-4 text-violet-400" /> },
    { label: "Languages", value: "11", icon: <Code2 className="w-4 h-4 text-cyan-400" /> },
    { label: "AI Models", value: "Multi-Pool", icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { label: "Compete", value: "Live", icon: <Trophy className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <div className="min-h-screen bg-black text-foreground overflow-hidden relative">
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 pt-28 md:pt-36 pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div
            className={`text-center space-y-4 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Status Pill */}
            <div className="badge-pill inline-flex items-center gap-2 border-white/[0.14]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Workspace Active · Cloud Database Connected</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              Hello, <span>{user?.firstName || "Developer"}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Your practice queue is ready. Step into the arena, solve challenges, and hone your algorithmic instincts.
            </p>
          </div>

          {/* Quick Stats */}
          <div
            className={`flex justify-center gap-6 md:gap-14 transition-all duration-700 delay-150 flex-wrap ${
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

          {/* Action Cards with Real Asset Previews */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => router.push(action.href)}
                className="glass-card overflow-hidden p-0 text-left group transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between border border-white/[0.08] hover:border-white/[0.25]"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  <Image
                    src={action.image}
                    alt={action.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />

                  {/* Icon & Tag */}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-black/90 border border-white/[0.15] flex items-center justify-center">
                    {action.icon}
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/[0.15] bg-black/90 text-white">
                    {action.tag}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-black">
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-white transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                      {action.desc}
                    </p>
                  </div>

                  <div className="flex items-center text-xs font-semibold text-white/80 group-hover:text-white transition-colors pt-4 mt-4 border-t border-white/[0.06]">
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </div>
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
              className="btn-cyber cursor-pointer px-8 h-12 text-sm font-semibold"
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
