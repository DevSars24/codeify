"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import photo from "@/assets/photo.png";

/* ---------- ADVANCED TYPING TEXT ---------- */
function TypingText({ text, speed = 40 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const ref = useRef<number | null>(null);

  useEffect(() => {
    let i = 0;
    const start = performance.now();

    const animate = (time: number) => {
      const elapsed = time - start;
      const next = Math.min(Math.floor(elapsed / speed), text.length);
      if (next !== i) {
        i = next;
        setDisplayed(text.slice(0, i));
      }
      if (i < text.length) ref.current = requestAnimationFrame(animate);
    };

    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current !== null) {
        cancelAnimationFrame(ref.current);
      }
    };
  }, [text, speed]);

  return (
    <span className="relative">
      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
        {displayed}
      </span>
      <span className="ml-1 inline-block w-0.5 h-6 bg-purple-400 animate-pulse" />
    </span>
  );
}

/* ---------- STAT CARD ---------- */
function Stat({ value, label }: { value: number; label: string }) {
  return (
    <Card className="bg-zinc-900/70 border-zinc-800 backdrop-blur">
      <CardContent className="p-6 text-center">
        <p className="text-3xl font-bold text-purple-400">{value}+</p>
        <p className="text-zinc-400 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* ---------- BACKGROUND (SENIOR GRADIENT + GLOW) ---------- */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-zinc-950 to-black">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/30 rounded-full blur-[180px]" />
        <div className="absolute top-1/3 right-[-200px] w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[160px]" />
      </div>

      {/* ---------- HERO ---------- */}
      <section className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-24 items-center">
        {/* LEFT */}
        <div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Code Saarthi
            </span>
          </h1>

          <p className="text-xl text-zinc-300 mb-6">
            <TypingText text="Hi, I’m Saurabh Singh Rajput." />
          </p>

          <p className="text-lg text-zinc-300 leading-relaxed mb-6">
            Sophomore at <Badge variant="secondary">IIIT Bhagalpur</Badge> ·  
            Strong in <Badge variant="secondary">DSA Fundamentals</Badge> ·  
            Building real-world products while balancing development and problem solving.
          </p>

          <p className="text-zinc-400 leading-relaxed mb-8">
            I believe strong fundamentals matter more than fancy tools.  
            My journey focuses on writing correct, efficient code — while
            learning how real software is designed, built, and shipped.
          </p>

          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 px-12 py-6 text-lg glow"
            onClick={() => router.push("/home")}
          >
            Start Coding →
          </Button>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center">
          <Avatar className="w-72 h-72 border border-zinc-800 shadow-2xl">
            <AvatarImage src={photo.src} />
            <AvatarFallback>SR</AvatarFallback>
          </Avatar>
        </div>
      </section>

      {/* ---------- ABOUT / WHY ---------- */}
      <section className="max-w-4xl mx-auto px-6 mb-28">
        <h2 className="text-3xl font-semibold mb-6 text-purple-300">
          Why I Built Code Saarthi
        </h2>

        <p className="text-zinc-300 leading-relaxed mb-4">
          I built this project with a simple goal — to help juniors during the
          most confusing phase of their journey: the beginning.
        </p>

        <p className="text-zinc-400 leading-relaxed mb-4">
          Many first-year students struggle not because they lack intelligence,
          but because they don’t have the right guidance or tools.  
          Coding should be accessible whether you have a powerful laptop or not.
        </p>

        <p className="text-zinc-400 leading-relaxed">
          The integrated Monaco Editor makes it possible to write, review,
          and understand code anywhere — even on mobile.  
          Code Saarthi acts like a mentor, helping you find bugs, explain logic,
          and strengthen fundamentals through hands-on practice.
        </p>
      </section>

      {/* ---------- PROGRESS ---------- */}
      <section className="max-w-5xl mx-auto px-6 mb-32">
        <h3 className="text-2xl font-semibold text-purple-300 mb-10 text-center">
          My Progress So Far
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat value={400} label="DSA Problems Solved" />
          <Stat value={15} label="Contests & Hackathons" />
          <Stat value={20} label="Projects & Experiments" />
          <Stat value={2} label="Years of Consistent Coding" />
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="text-center text-zinc-500 text-sm pb-12">
        Designed & Developed by Saurabh Singh Rajput · IIIT Bhagalpur  
        <br />
        Code Saarthi © 2025
      </footer>
    </div>
  );
}
