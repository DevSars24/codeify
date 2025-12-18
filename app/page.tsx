"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";

import Navbar from "@/components/Navbar";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import photo from "@/assets/photo.png";

/* ===================== TYPING EFFECT ===================== */
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
    <span className="font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
      {value}
      <span className="ml-1 inline-block w-[2px] h-6 bg-purple-400 animate-pulse" />
    </span>
  );
}

/* ===================== SCROLL REVEAL ===================== */
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = `all 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        } else {
          el.style.opacity = "0";
          el.style.transform = "translateY(50px)";
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return ref;
}

/* ===================== STAT CARD ===================== */
function Stat({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: number;
}) {
  const ref = useReveal(delay);

  return (
    <Card ref={ref} className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6 text-center">
        <p className="text-3xl font-bold text-purple-400">{value}+</p>
        <p className="text-zinc-400 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

/* ===================== PAGE ===================== */
export default function Page() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();


  const titleRef = useReveal(0);
  const typingRef = useReveal(150);
  const descRef = useReveal(300);
  const btnRef = useReveal(450);
  const imageRef = useReveal(600);

  const aboutRef = useReveal(0);
  const statsTitleRef = useReveal(0);

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      <div className="min-h-screen bg-black text-white overflow-hidden pt-24">
        {/* ================= HERO ================= */}
        <section className="max-w-6xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-24 items-center">
          {/* LEFT */}
          <div>
            <h1
              ref={titleRef}
              className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Code Saarthi
            </h1>

            <p ref={typingRef} className="text-xl text-zinc-300 mb-6">
            <TypingText
  text={
    isSignedIn
      ? `Welcome back, ${user?.firstName}. Ready to code?`
      : "Hi, I’m Saurabh Singh Rajput."
  }
/>

            </p>

            <p
              ref={descRef}
              className="text-lg text-zinc-300 mb-6 leading-relaxed"
            >
              Sophomore at <Badge>IIIT Bhagalpur</Badge> · Strong in{" "}
              <Badge>DSA Fundamentals</Badge> · Building real-world products
            </p>

            <div ref={btnRef}>
              <Button
                size="lg"
                className="px-12 py-6 text-lg bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  if (!isSignedIn) {
                    router.push("/sign-in");
                  } else {
                    router.push("/home");
                  }
                }}
              >
              {isSignedIn ? "Start Coding Sir →" : "Start Coding →"}

              </Button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div ref={imageRef} className="flex justify-center perspective-[1200px]">
            <div
              className="relative w-72 h-72 rounded-full border border-zinc-800 shadow-xl"
              style={{
                transformStyle: "preserve-3d",
                animation: "spin3d 14s linear infinite",
              }}
            >
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={photo.src}
                  className="rounded-full backface-hidden"
                />
                <AvatarFallback className="backface-hidden">
                  SR
                </AvatarFallback>
              </Avatar>
            </div>

            <style jsx>{`
              @keyframes spin3d {
                from {
                  transform: rotateY(0deg);
                }
                to {
                  transform: rotateY(360deg);
                }
              }
              .backface-hidden {
                backface-visibility: hidden;
              }
            `}</style>
          </div>
        </section>

        {/* ================= WHY ================= */}
        <section ref={aboutRef} className="max-w-4xl mx-auto px-6 mb-32">
          <h2 className="text-3xl font-semibold mb-6 text-purple-300">
            Why I Built Code Saarthi
          </h2>

          <p className="text-zinc-300 mb-4 leading-relaxed">
            I built this project to help beginners who struggle in their first
            year — not due to lack of intelligence, but lack of guidance.
          </p>

          <p className="text-zinc-400 mb-4 leading-relaxed">
            Coding should be accessible anywhere, even without a powerful
            laptop.
          </p>

          <p className="text-zinc-400 leading-relaxed">
            Code Saarthi enables hands-on learning using a Monaco Editor —
            detect bugs, understand logic, and strengthen fundamentals on any
            device.
          </p>
        </section>

        {/* ================= STATS ================= */}
        <section className="max-w-5xl mx-auto px-6 mb-40">
          <h3
            ref={statsTitleRef}
            className="text-2xl font-semibold mb-10 text-center text-purple-300"
          >
            My Progress So Far
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Stat value={400} label="DSA Problems Solved" delay={0} />
            <Stat value={15} label="Contests & Hackathons" delay={150} />
            <Stat value={20} label="Projects Built" delay={300} />
            <Stat value={2} label="Years of Consistency" delay={450} />
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="text-center text-zinc-500 text-sm pb-12">
          Designed & Developed by Saurabh Singh Rajput · IIIT Bhagalpur
          <br />
          Code Saarthi © 2025
        </footer>
      </div>
    </>
  );
}
