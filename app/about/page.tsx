"use client";

import TypingText from "@/components/TypingText";
import Counter from "@/components/Counter";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AboutDeveloperPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 mx-auto max-w-6xl space-y-24 px-4 pb-24 pt-28 sm:px-6 md:pt-32">

        {/* ================= HERO ================= */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <h1 className="font-serif text-4xl font-normal leading-tight sm:text-5xl md:text-6xl">
              Welcome to{" "}
              <span className="text-[#c9d0be]">
                Sars Workspace
              </span>
            </h1>

            <div className="text-lg sm:text-xl text-zinc-300 h-7">
              <TypingText
                text={[
                  "Full-Stack Developer",
                  "MERN Stack Engineer",
                  "DSA & System Design Focused",
                ]}
              />
            </div>

            <p className="text-zinc-300 leading-relaxed max-w-xl">
              Self-taught full-stack developer and 2nd-year CSE student at IIIT Bhagalpur.
              I build real products, strengthen DSA fundamentals, and design scalable systems.
            </p>

            {/* Small snippet (mobile friendly) */}
            <pre className="bg-zinc-900/40 border border-zinc-700/40 rounded-lg p-3 text-xs max-w-sm">
              <code className="text-green-400 font-mono">
{`console.log("Entering Sars Workspace");`}
              </code>
            </pre>
          </motion.div>

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-64 sm:h-80 md:h-[420px]"
          >
            <Image
              src="/assets/photo.png"
              alt="Developer portrait"
              fill
              className="object-cover rounded-2xl border border-white/10"
              priority
            />
          </motion.div>
        </section>

        {/* ================= STATS ================= */}
        <section className="glass-card grid grid-cols-2 gap-6 p-6 text-center md:grid-cols-4 md:gap-8">
          <Counter value={500} label="DSA Problems" />
          <Counter value={500} label="GitHub Commits" />
          <Counter value={65} label="Repositories" />
          <Counter value={18} label="Day Streak" />
        </section>

        {/* ================= WORK AREAS ================= */}
        <section className="space-y-10">
          <SectionTitle>What I Work On</SectionTitle>

          <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
            {[
              "Data Structures & Algorithms",
              "MERN Stack Applications",
              "Backend APIs & Databases",
              "System Design Fundamentals",
              "Developer Tools & Platforms",
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card flex items-start gap-3 p-4 text-zinc-200"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#c9d0be]" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= PROFILES ================= */}
        <section className="space-y-8 text-center">
          <SectionTitle>Coding Profiles</SectionTitle>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <ProfileLink label="LeetCode" href="https://leetcode.com/u/VXGxeHwq/" />
            <ProfileLink label="GeeksforGeeks" href="https://www.geeksforgeeks.org/user/saurabhsinvqv3/" />
            <ProfileLink label="Codolio" href="https://codolio.com/profile/sars" />
            <ProfileLink label="GitHub" href="https://github.com/DevSars24" />
            <ProfileLink label="LinkedIn" href="https://www.linkedin.com/in/saurabh-singh-rajput-25639a306/" />
            <ProfileLink label="Portfolio" href="https://sars24.netlify.app" />
          </div>

          <pre className="bg-zinc-900/40 border border-zinc-700/40 rounded-lg p-3 text-xs inline-block">
            <code className="text-pink-400 font-mono">
{`connect(profile).then(build());`}
            </code>
          </pre>
        </section>

        {/* ================= FINAL ================= */}
        <section className="text-center space-y-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-serif text-xl font-normal text-zinc-200 sm:text-2xl"
          >
            Focused on{" "}
            <span className="text-[#c9d0be]">skills</span>,{" "}
            <span className="text-[#c9d0be]">systems</span>, and{" "}
            <span className="text-[#c9d0be]">long-term growth</span>.
          </motion.p>

          <pre className="bg-zinc-900/40 border border-zinc-700/40 rounded-lg p-3 text-xs inline-block">
            <code className="text-green-400 font-mono">
{`while (learning) { build(); evolve(); }`}
            </code>
          </pre>
        </section>

      </div>
    </main>
  );
}

/* ================= REUSABLE ================= */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-semibold text-center text-white">
      {children}
    </h2>
  );
}

function ProfileLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="px-4 py-2 rounded-full border border-white/10 text-zinc-200 hover:text-white hover:border-white/40 transition"
    >
      {label}
    </Link>
  );
}
