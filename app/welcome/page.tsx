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
    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      {value}
      <span className="ml-1 inline-block w-[2px] h-6 bg-purple-400 animate-pulse" />
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

      <div className="min-h-screen bg-black text-white px-4 pt-28 pb-16">
        <div className="max-w-4xl mx-auto text-center animate-fadeIn">

          {/* GREETING */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome,{" "}
            <span className="text-purple-400">
              {user?.firstName}
            </span>{" "}
            👋
          </h1>

          {/* TYPING HOOK */}
          <p className="text-lg md:text-xl text-zinc-300 mb-10">
            <TypingText text="Let’s build your coding journey — step by step." />
          </p>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

            <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/40">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                Beginner First
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Built for students who are just starting out and want concepts
                to actually make sense.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/40">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                No Fancy Setup
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                No powerful laptop needed. Code, debug, and learn directly in
                your browser.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/40">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">
                Learn by Doing
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Write code, find bugs, understand logic, and improve step by
                step.
              </p>
            </div>

          </div>

          {/* FUTURE VISION */}
          <p className="text-zinc-500 text-sm md:text-base mb-10 max-w-2xl mx-auto">
            Coming soon: DSA problem practice, development challenges, guided
            sessions, and a gamified experience that keeps learning fun — not
            stressful.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
  <Button
    size="lg"
    className="px-10 py-6 text-lg bg-purple-600 hover:bg-purple-700 transition-all hover:scale-105"
    onClick={() => router.push("/home")}
  >
    Start Coding Playground →
  </Button>

  <Button
    size="lg"
    variant="outline"
    className="px-10 py-6 text-lg border-purple-500 text-purple-400 hover:bg-purple-950 transition-all hover:scale-105"
    onClick={() => router.push("/dsa")}
  >
    Practice DSA
  </Button>

  <Button
    size="lg"
    variant="outline"
    className="px-10 py-6 text-lg border-cyan-500 text-cyan-400 hover:bg-cyan-950 transition-all hover:scale-105"
    onClick={() => router.push("/dev")}
  >
    Let’s Practice Dev
  </Button>
</div>


          <p className="text-zinc-600 text-sm mt-6">
            Everything runs online — anytime, anywhere 🚀
          </p>
        </div>
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

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
      `}</style>
    </>
  );
}
