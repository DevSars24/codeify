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
  Trophy
} from "lucide-react";

export default function WelcomePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace("/sign-in");
    setMounted(true);
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

  const quickActions = [
    {
      title: "DSA Arena",
      desc: "Practice Data Structures & Algorithms",
      icon: <Terminal className="w-5 h-5" />,
      href: "/dsa",
    },
    {
      title: "Dev Lab",
      desc: "Build real-world projects",
      icon: <Code2 className="w-5 h-5" />,
      href: "/dev",
    },
    {
      title: "Live Sessions",
      desc: "Join interactive mentorship",
      icon: <Zap className="w-5 h-5" />,
      href: "/sessions",
    },
  ];

  const stats = [
    { label: "Topics", value: "50+", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Problems", value: "200+", icon: <Code2 className="w-4 h-4" /> },
    { label: "Compete", value: "Live", icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-28 md:pt-36 pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Hero Section */}
          <div
            className={`text-center mb-20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {/* Greeting Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-muted border border-border backdrop-blur-sm mb-8">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span className="text-sm text-muted-foreground">Welcome back to your workspace</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Hello, </span>
              <span className="relative">
                <span className="text-foreground">
                  {user?.firstName || "Developer"}
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Your practice queue is ready. Pick the next move and keep the streak honest.
            </p>
          </div>

          {/* Quick Stats */}
          <div
            className={`flex justify-center gap-8 md:gap-16 mb-16 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1 group-hover:text-foreground transition-colors">
                  {stat.icon}
                  <span className="text-xs uppercase tracking-wider font-medium">{stat.label}</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Action Cards */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => router.push(action.href)}
                className="group relative text-left"
              >
                <div className="relative h-full p-8 rounded-md bg-card backdrop-blur-xl border border-border hover:border-foreground transition-all duration-300 hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-md border border-border bg-muted mb-6 group-hover:scale-105 transition-transform duration-300">
                    {action.icon}
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2 transition-all">
                    {action.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {action.desc}
                  </p>

                  <div className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors">
                    <span className="text-sm font-medium">Enter</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom CTA */}
          <div
            className={`text-center transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <Button
              onClick={() => router.push("/home")}
              className="group h-14 px-8 sm:px-10 rounded-md bg-primary text-primary-foreground hover:opacity-80 font-semibold text-base transition-all duration-300"
            >
              <span>Explore All Features</span>
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="mt-6 text-muted-foreground text-xs uppercase tracking-[0.25em] font-medium">
              CodeSaarthi • Your Coding Companion
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
