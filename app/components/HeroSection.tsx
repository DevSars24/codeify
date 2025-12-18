"use client";

import FeatureCard from "./FeatureCard";

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-black px-6 pt-24 text-center">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
        Code Saarthi 🚀
      </h1>

      <div className="grid md:grid-cols-4 gap-6 mt-16">
        <FeatureCard icon="🧠" title="Code Review" />
        
        {/* ⭐ BUG DETECTION SPECIAL */}
        <FeatureCard
          icon="🐞"
          title="Bug Detection"
          highlight
        />

        <FeatureCard icon="📖" title="Explain Logic" />
        <FeatureCard icon="🎯" title="Interview Mode" />
      </div>
    </section>
  );
}
