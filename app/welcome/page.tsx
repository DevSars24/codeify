"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronRight, Code2, Cpu, GraduationCap } from "lucide-react";

// Refined Typing Component with a more professional cursor
function TypingText({ text, speed = 40 }: { text: string; speed?: number }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setValue(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <span className="text-zinc-400 font-medium tracking-wide">
      {value}
      <span className="ml-0.5 inline-block w-[1.5px] h-5 bg-purple-500 animate-pulse align-middle" />
    </span>
  );
}

export default function WelcomePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  // Memoize stars to prevent jittery re-renders
  const stars = useMemo(() => 
    [...Array(60)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
    })), []);

  if (!isLoaded || !isSignedIn) return null;

  const features = [
    {
      title: "Beginner First",
      desc: "Abstract concepts turned into visual logic. Finally understand the 'why' behind the code.",
      icon: <GraduationCap className="w-5 h-5 text-purple-400" />,
    },
    {
      title: "Zero Setup",
      desc: "Cloud-based environment. No 'it works on my machine' errors. Just open and code.",
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: "Learn by Doing",
      desc: "Interactive sandboxes that provide real-time feedback on your syntax and logic.",
      icon: <Code2 className="w-5 h-5 text-pink-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 selection:bg-purple-500/30">
      <Navbar />

      <main className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Modern Background: Noise + Deep Radial Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full" />
          
          {/* Subtle Stars */}
          {stars.map((star: any, i: number) => (
            <div
              key={i}
              className="absolute w-[1px] h-[1px] bg-white/40 rounded-full animate-twinkle"
              style={{ ...star }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Header Section */}
          <div className="space-y-4 mb-16 animate-reveal">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
              Welcome back,{" "}
              <span className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                {user?.firstName}
              </span>
            </h1>
            <div className="h-8">
              <TypingText text="Engineering your future, one line at a time." />
            </div>
          </div>

          {/* Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="group relative p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Border Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative h-full bg-zinc-900/40 backdrop-blur-2xl p-8 rounded-[15px] border border-white/5 flex flex-col items-center text-center">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-5 group-hover:scale-110 transition-transform duration-500">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Area */}
          <div className="flex flex-col items-center space-y-8 animate-reveal-slow">
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => router.push("/home")}
                className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 transition-all font-bold text-base shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Start Playground
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/dsa")}
                className="h-14 px-8 rounded-full border-zinc-800 bg-transparent text-white hover:bg-white/5 transition-all text-base"
              >
                Data Structures
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/dev")}
                className="h-14 px-8 rounded-full border-zinc-800 bg-transparent text-white hover:bg-white/5 transition-all text-base"
              >
                Development
              </Button>
            </div>

            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] font-medium">
              Experimental Alpha • V2.0.4
            </p>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-reveal {
          animation: reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-reveal-slow {
          animation: reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle var(--duration, 3s) ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}