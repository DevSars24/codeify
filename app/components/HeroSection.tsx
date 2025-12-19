"use client";

import FeatureCard from "./FeatureCard";

export default function HeroSection() {
  return (
    <section className="bg-black px-6 py-20 text-center">
      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
        What Code Saarthi Offers 🚀
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-14 max-w-6xl mx-auto">
        <FeatureCard icon="🧠" title="Code Review" />
        
        {/* ⭐ BUG DETECTION SPECIAL */}
        <FeatureCard
          icon="🐞"
          title="Bug Detection"
        />

        <FeatureCard icon="📖" title="Explain Logic" />
        <FeatureCard icon="🎯" title="Interview Mode" />
      </div>
    </section>
  );
}
