"use client";

import TypingText from "@/components/TypingText";
import Counter from "@/components/Counter";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutDeveloperPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 sm:px-6 pt-24 pb-20">
      <div className="max-w-6xl mx-auto space-y-10 lg:space-y-16">

        {/* ================= HERO ================= */}
        <GlassCard>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
              Hi, I’m{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Saurabh Singh Rajput
              </span>
            </h1>

            <div className="text-lg sm:text-xl md:text-2xl h-8 text-zinc-200">
              <TypingText
                text={[
                  "Self-taught Full-Stack Developer",
                  "MERN Stack Engineer",
                  "System Design Learner",
                  "Learning by Building",
                ]}
              />
            </div>

            <p className="max-w-3xl mx-auto text-zinc-200 text-base sm:text-lg leading-relaxed">
              I’m a{" "}
              <span className="text-purple-400 font-medium">
                self-taught full-stack developer
              </span>{" "}
              and a{" "}
              <span className="text-pink-400 font-medium">
                2nd-year CSE student
              </span>{" "}
              at IIIT Bhagalpur. I don’t just learn technologies — I{" "}
              <span className="text-cyan-400 font-medium">
                build systems, products, and real-world solutions
              </span>.
            </p>

            <p className="text-zinc-400 italic text-sm sm:text-base">
              Learning happens best when you build, break, and rebuild things that matter.
            </p>
          </motion.div>
        </GlassCard>

        {/* ================= STATS ================= */}
        <GlassCard>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <Counter value={500} label="DSA Problems Solved" />
            <Counter value={500} label="GitHub Contributions" />
            <Counter value={65} label="Repositories" />
            <Counter value={18} label="Day Coding Streak" />
          </motion.div>
        </GlassCard>

        {/* ================= VISION ================= */}
        <GlassCard>
          <SectionTitle>Who I Am & What I Build</SectionTitle>

          <p className="text-zinc-200 text-base sm:text-lg leading-relaxed text-center">
            I actively work with the{" "}
            <span className="text-purple-400 font-medium">MERN stack</span>, explore{" "}
            <span className="text-pink-400 font-medium">
              Low-Level & High-Level System Design
            </span>, and continuously sharpen my{" "}
            <span className="text-cyan-400 font-medium">
              DSA & problem-solving skills
            </span>.
            Alongside this, I’m diving into AI/ML fundamentals — not for hype,
            but to understand how intelligent systems can genuinely help people.
          </p>

          <p className="text-zinc-400 text-center">
            Inspired by <b>Steve Jobs</b> and <b>Tony Stark</b>, I see code not as
            syntax — but as a tool to create meaningful change.
          </p>
        </GlassCard>

        {/* ================= WHAT I BUILD ================= */}
        <GlassCard>
          <SectionTitle>What I Love Working On</SectionTitle>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Real-world products, not just demo apps",
              "AI-assisted platforms like Codeify",
              "Clean architecture & scalable systems",
              "Developer tools & learning platforms",
              "Collaborative projects where ideas matter",
            ].map((item, i) => (
              <div
                key={i}
                className="
                  rounded-2xl
                  bg-zinc-800/60 backdrop-blur-md
                  border border-white/10
                  px-5 py-4
                  text-zinc-100
                  text-sm sm:text-base
                  hover:border-purple-400/40
                  hover:bg-zinc-800/80
                  transition
                "
              >
                {item}
              </div>
            ))}
          </div>

          <p className="text-zinc-400 text-center text-sm sm:text-base">
            I enjoy collaborating with people who care about quality, learning,
            and long-term impact.
          </p>
        </GlassCard>

        {/* ================= PROFILES ================= */}
        <GlassCard>
          <SectionTitle>My Coding & Professional Profiles</SectionTitle>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <ProfileLink label="LeetCode" href="https://leetcode.com/u/VXGxeHwq/" />
            <ProfileLink label="GeeksforGeeks" href="https://www.geeksforgeeks.org/user/saurabhsinvqv3/" />
            <ProfileLink label="Codolio" href="https://codolio.com/profile/sars" />
            <ProfileLink label="GitHub" href="https://github.com/DevSars24" />
            <ProfileLink label="LinkedIn" href="https://www.linkedin.com/in/saurabh-singh-rajput-25639a306/" />
            <ProfileLink label="Portfolio" href="https://sars24.netlify.app" />
          </div>

          <p className="text-zinc-400 text-center text-sm">
            These profiles represent consistency, discipline, and real skill-building.
          </p>
        </GlassCard>

        {/* ================= FINAL ================= */}
        <GlassCard>
          <p className="text-center text-lg sm:text-xl italic text-zinc-200">
            I’m not chasing titles.
            <br />
            <span className="text-purple-400 font-semibold">
              I’m building skills, systems, and products that stand the test of time.
            </span>
          </p>
        </GlassCard>

      </div>
    </main>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        bg-zinc-900/60 backdrop-blur-xl
        border border-white/10
        shadow-xl shadow-black/50

        /* MOBILE */
        rounded-3xl p-6 space-y-6

        /* DESKTOP */
        lg:rounded-2xl lg:p-10

        transition-all
      "
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-semibold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      {children}
    </h2>
  );
}

function ProfileLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="
        rounded-xl
        border border-white/10
        bg-zinc-800/60 backdrop-blur-md
        px-3 py-2
        text-center
        text-zinc-200
        hover:border-purple-400/40
        hover:text-purple-400
        transition
      "
    >
      {label}
    </Link>
  );
}

