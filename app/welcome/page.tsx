"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

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
    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent relative overflow-hidden">
      {value}
      <span className="ml-1 inline-block w-[2px] h-6 bg-gradient-to-b from-purple-400 to-pink-400 animate-pulse" />
      {/* Subtle glow trail */}
      <span className="absolute -top-1 -bottom-1 left-0 w-full bg-gradient-to-r from-purple-500/20 to-transparent blur-sm opacity-0 animate-glow-trail" />
    </span>
  );
}

export default function WelcomePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900/50 to-black text-white px-4 pt-28 pb-16 relative overflow-hidden">
        {/* Space Effect Background: Twinkling Stars & Coding Particles */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          {/* Twinkling Stars */}
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
          {/* Subtle Coding Matrix Rain (Vertical Lines) */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 bg-gradient-to-b from-cyan-400/30 to-transparent h-full animate-code-rain"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${10 + Math.random() * 10}s`,
                }}
              />
            ))}
          </div>
          {/* Nebula Gradient Overlay for Depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20 animate-nebula-shift" />
        </div>

        <div className="max-w-4xl mx-auto text-center animate-fadeIn relative z-10">
          {/* GREETING */}
          <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg animate-slideUp">
            Welcome,{" "}
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text drop-shadow-lg">
              {user?.firstName}
            </span>{" "}
            👋
          </h1>

          {/* TYPING HOOK */}
          <p className="text-lg md:text-xl text-zinc-300 mb-12 animate-slideUp animation-delay-200">
            <TypingText text="Let’s build your coding journey — step by step." />
          </p>

          {/* CARDS - Staggered Animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className={`border border-zinc-800/50 rounded-2xl p-6 bg-zinc-900/30 backdrop-blur-md shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 group animate-slideUpCard ${`animation-delay-${idx * 200}`}`}
              >
                <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm group-hover:scale-110 transition-transform">
                  {["Beginner First", "No Fancy Setup", "Learn by Doing"][idx]}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                  {[
                    "Built for students who are just starting out and want concepts to actually make sense.",
                    "No powerful laptop needed. Code, debug, and learn directly in your browser.",
                    "Write code, find bugs, understand logic, and improve step by step.",
                  ][idx]}
                </p>
              </div>
            ))}
          </div>

          {/* FUTURE VISION */}
          <p className="text-zinc-500 text-sm md:text-base mb-12 max-w-2xl mx-auto px-4 animate-slideUp animation-delay-600">
            Coming soon: DSA problem practice, development challenges, guided sessions, and a gamified experience that keeps learning fun — not stressful.
          </p>

          {/* BUTTONS - Responsive Flex */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideUp animation-delay-800">
            <Button
              size="lg"
              className="px-10 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 text-white font-semibold"
              onClick={() => router.push("/home")}
            >
              Start Coding Playground →
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-10 py-4 text-lg border-purple-500/50 text-purple-400 hover:bg-purple-950/50 hover:border-purple-400 transition-all hover:scale-105 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 font-semibold"
              onClick={() => router.push("/dsa")}
            >
              Practice DSA
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-10 py-4 text-lg border-cyan-500/50 text-cyan-400 hover:bg-cyan-950/50 hover:border-cyan-400 transition-all hover:scale-105 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/40 font-semibold"
              onClick={() => router.push("/dev")}
            >
              Let’s Practice Dev
            </Button>
          </div>

          <p className="text-zinc-600 text-sm mt-8 animate-slideUp animation-delay-1000">
            Everything runs online — anytime, anywhere 🚀
          </p>
        </div>
      </div>

      {/* ANIMATION STYLES */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }
        @keyframes slideUpCard {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideUpCard {
          animation: slideUpCard 0.7s ease-out forwards;
        }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
        @keyframes code-rain {
          0% { transform: translateY(-100vh); opacity: 0.6; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-code-rain {
          animation: code-rain linear infinite;
        }
        @keyframes nebula-shift {
          0% { transform: translateX(-20%); }
          50% { transform: translateX(20%); }
          100% { transform: translateX(-20%); }
        }
        .animate-nebula-shift {
          animation: nebula-shift 20s ease-in-out infinite;
        }
        @keyframes glow-trail {
          0% { opacity: 0; transform: translateX(-100%); }
          100% { opacity: 1; transform: translateX(100%); }
        }
        .animate-glow-trail {
          animation: glow-trail 2s linear infinite;
        }
      `}</style>
    </>
  );
}