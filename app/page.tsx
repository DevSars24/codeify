"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import photo from "@/assets/photo.png";
import { SignedIn } from "@clerk/nextjs";


export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white pt-28 px-6">
        {/* HERO */}
        <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Code Saarthi
            </h1>

            <p className="text-zinc-300 mb-4 text-lg">
              Hi, I’m <span className="text-purple-400 font-semibold">Saurabh Singh Rajput</span>,
              a sophomore at <span className="text-purple-400">IIIT Bhagalpur</span>.
            </p>

            <p className="text-zinc-400 mb-6 leading-relaxed">
              I built Code Saarthi to help beginners who struggle with
              fundamentals — especially those who don’t have powerful laptops.
              Code anywhere, anytime, with clarity.
            </p>

           <SignedIn>
  <Button
    size="lg"
    className="px-12 py-6 text-lg bg-purple-600 hover:bg-purple-700"
    onClick={() => router.push("/welcome")}
  >
    Start Coding →
  </Button>
</SignedIn>

          </div>

          {/* IMAGE */}
          <div className="flex justify-center">
            <Image
              src={photo}
              alt="Saurabh"
              className="rounded-full border border-zinc-800"
              width={280}
              height={280}
            />
          </div>
        </section>

        {/* FEATURES */}
        <HeroSection />

        {/* FOOTER */}
        <footer className="text-center text-zinc-500 text-sm py-12">
          Designed & Developed by Saurabh Singh Rajput · IIIT Bhagalpur  
          <br />
          Code Saarthi © 2025
        </footer>
      </div>
    </>
  );
}
