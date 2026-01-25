"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Code2,
  Cpu,
  GraduationCap,
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
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace("/sign-in");
    setMounted(true);
  }, [isLoaded, isSignedIn, router]);

  // Generate floating orbs for background
  const orbs = useMemo(() =>
    [...Array(5)].map((_, i) => ({
      size: 200 + Math.random() * 400,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: i * 0.5,
      color: ['purple', 'cyan', 'pink', 'indigo', 'violet'][i]
    })), []);

  if (!isLoaded || !isSignedIn) return null;

  const quickActions = [
    {
      title: "DSA Arena",
      desc: "Practice Data Structures & Algorithms",
      icon: <Terminal className="w-5 h-5" />,
      href: "/dsa",
      gradient: "from-purple-500 to-indigo-600",
      glow: "purple"
    },
    {
      title: "Dev Lab",
      desc: "Build real-world projects",
      icon: <Code2 className="w-5 h-5" />,
      href: "/dev",
      gradient: "from-cyan-500 to-blue-600",
      glow: "cyan"
    },
    {
      title: "Live Sessions",
      desc: "Join interactive mentorship",
      icon: <Zap className="w-5 h-5" />,
      href: "/sessions",
      gradient: "from-pink-500 to-rose-600",
      glow: "pink"
    },
  ];

  const stats = [
    { label: "Topics", value: "50+", icon: <BookOpen className="w-4 h-4" /> },
    { label: "Problems", value: "200+", icon: <Code2 className="w-4 h-4" /> },
    { label: "Compete", value: "Live", icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Floating Orbs */}
        {orbs.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-[100px] opacity-20 animate-float"
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.left,
              top: orb.top,
              background: `radial-gradient(circle, var(--color-${orb.color}-500) 0%, transparent 70%)`,
              animationDelay: `${orb.delay}s`,
            }}
          />
        ))}

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-purple-950/30 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-[400px] bg-gradient-to-tl from-cyan-950/20 to-transparent" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-28 md:pt-36 pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Hero Section */}
          <div
            className={`text-center mb-20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {/* Greeting Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-zinc-400">Welcome back to your journey</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">Hello, </span>
              <span className="relative">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  {user?.firstName || "Developer"}
                </span>
                {/* Underline decoration */}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-purple-500/30" viewBox="0 0 200 8" preserveAspectRatio="none">
                  <path d="M0 7 Q50 0 100 4 T200 3" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-zinc-500 max-w-xl mx-auto leading-relaxed">
              Your personalized coding sanctuary awaits.
              <span className="text-zinc-400"> What would you like to master today?</span>
            </p>
          </div>

          {/* Quick Stats */}
          <div
            className={`flex justify-center gap-8 md:gap-16 mb-16 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="flex items-center justify-center gap-2 text-zinc-500 mb-1 group-hover:text-purple-400 transition-colors">
                  {stat.icon}
                  <span className="text-xs uppercase tracking-wider font-medium">{stat.label}</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
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
                onMouseEnter={() => setActiveCard(idx)}
                onMouseLeave={() => setActiveCard(null)}
                className="group relative text-left"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-3xl blur-xl transition-opacity duration-500 ${activeCard === idx ? 'opacity-40' : 'opacity-0'}`}
                  style={{ background: `linear-gradient(135deg, var(--color-${action.glow}-500), transparent)` }}
                />

                {/* Card */}
                <div className="relative h-full p-8 rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    {action.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 group-hover:bg-clip-text transition-all">
                    {action.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    {action.desc}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center text-zinc-500 group-hover:text-white transition-colors">
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
              className="group h-14 px-10 rounded-full bg-white text-black hover:bg-zinc-200 font-semibold text-base shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all duration-300"
            >
              <span>Explore All Features</span>
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="mt-6 text-zinc-600 text-xs uppercase tracking-[0.25em] font-medium">
              CodeSaarthi • Your Coding Companion
            </p>
          </div>
        </div>
      </main>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(2deg); }
          66% { transform: translateY(10px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}