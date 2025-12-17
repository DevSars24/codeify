"use client";

import FeatureCard from "./FeatureCard";

export default function HeroSection() {
  return (
    <div className="mt-20 px-6 text-center">
      <h1 className="text-4xl font-bold text-purple-400">
        Code Saarthi 🚀
      </h1>

      <div className="grid md:grid-cols-4 gap-6 mt-14">
        <FeatureCard icon="🧠" title="Code Review" />
        <FeatureCard icon="🐞" title="Bug Detection" />
        <FeatureCard icon="📖" title="Explain Logic" />
        <FeatureCard icon="🎯" title="Interview Mode" />
      </div>
    </div>
  );
}
