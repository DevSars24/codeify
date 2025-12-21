"use client";

import FeatureCard from "./FeatureCard";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="bg-black px-6 py-24 text-center">

      {/* ================= WHAT CODE SAARTHI OFFERS ================= */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
      >
        What Code Saarthi Offers 🚀
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-14 max-w-6xl mx-auto"
      >
        <FeatureCard icon="🧠" title="Code Review" />
        <FeatureCard icon="🐞" title="Bug Detection" />
        <FeatureCard icon="📖" title="Explain Logic" />
        <FeatureCard icon="🎯" title="Interview Mode" />
      </motion.div>

      {/* ================= DEVELOPER AT A GLANCE ================= */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-28 max-w-4xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur px-8 py-10"
      >
        <h3 className="text-2xl font-semibold text-purple-400 mb-4">
          The Developer Behind Code Saarthi 👨‍💻
        </h3>

        <p className="text-zinc-300 text-lg leading-relaxed">
          Hi, I’m{" "}
          <span className="text-purple-400 font-medium">
            Saurabh Singh Rajput
          </span>{" "}
          — a self-taught full-stack developer and 2nd-year CSE student at
          IIIT Bhagalpur. I’m building Code Saarthi to help developers learn
          faster by solving real problems, not just reading theory.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
          <span>🚀 500+ DSA Problems</span>
          <span>🔥 500+ GitHub Contributions</span>
          <span>🧠 MERN Stack & System Design</span>
        </div>

        <div className="mt-8">
          <Link
            href="/about"
            className="inline-block rounded-xl bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition"
          >
            Know the Developer →
          </Link>
        </div>
      </motion.div>

    </section>
  );
}
