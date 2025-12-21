"use client";

import TypingText from "@/components/TypingText";
import Counter from "@/components/Counter";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutDeveloperPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 pt-28 pb-20">
      <div className="max-w-6xl mx-auto space-y-24">

        {/* ================= HERO / INTRO ================= */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold">
            Hi, I’m{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Saurabh Singh Rajput
            </span>
          </h1>

          <div className="text-xl md:text-2xl h-8">
            <TypingText
              text={[
                "Self-taught Full-Stack Developer",
                "MERN Stack Engineer",
                "System Design Learner",
                "Learning by Building",
              ]}
            />
          </div>

          <p className="max-w-3xl mx-auto text-zinc-300 text-lg leading-relaxed">
            I’m a self-taught full-stack developer and a 2nd-year CSE student at
            IIIT Bhagalpur. I don’t just learn technologies — I build systems,
            products, and solutions that solve real-world problems.
          </p>

          <p className="text-zinc-400 italic">
            Learning happens best when you build, break, and rebuild things that matter.
          </p>
        </motion.section>

        {/* ================= STATS ================= */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <Counter value={500} label="DSA Problems Solved" />
          <Counter value={500} label="GitHub Contributions" />
          <Counter value={65} label="Repositories" />
          <Counter value={18} label="Day Coding Streak" />
        </motion.section>

        {/* ================= VISION ================= */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <h2 className="text-3xl font-semibold text-purple-400">
            Who I Am & What I Build
          </h2>

          <p className="text-zinc-300 text-lg leading-relaxed">
            I actively work with the MERN stack, explore Low-Level & High-Level
            System Design, and continuously sharpen my DSA and problem-solving
            skills. Alongside this, I’m diving into AI/ML fundamentals — not for
            hype, but to understand how intelligent systems can genuinely help
            people.
          </p>

          <p className="text-zinc-400">
            Inspired by <b>Steve Jobs’</b> obsession with simplicity and impact,
            and <b>Tony Stark’s</b> mindset of building technology to improve the
            world — for me, code is not just syntax, it’s a tool for meaningful
            change.
          </p>
        </motion.section>

        {/* ================= WHAT I BUILD ================= */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl font-semibold text-center text-purple-400 mb-10">
            What I Love Working On
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Real-world products, not just demo apps",
              "AI-assisted platforms like Codeify",
              "Clean architecture & scalable systems",
              "Developer tools & learning platforms",
              "Collaborative projects where ideas matter",
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-zinc-300"
              >
                {item}
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-zinc-400">
            I love collaborating with people who care about quality, learning,
            and long-term impact.
          </p>
        </motion.section>

        {/* ================= PROFILES ================= */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <h2 className="text-3xl font-semibold text-purple-400">
            My Coding & Professional Profiles
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <ProfileLink label="LeetCode" href="https://leetcode.com/u/VXGxeHwq/" />
            <ProfileLink label="GeeksforGeeks" href="https://www.geeksforgeeks.org/user/saurabhsinvqv3/" />
            <ProfileLink label="Codolio" href="https://codolio.com/profile/sars" />
            <ProfileLink label="GitHub" href="https://github.com/DevSars24" />
            <ProfileLink label="LinkedIn" href="https://www.linkedin.com/in/saurabh-singh-rajput-25639a306/" />
            <ProfileLink label="Portfolio" href="https://sars24.netlify.app" />
          </div>

          <p className="text-zinc-400">
            These profiles reflect my consistency, discipline, and real skill
            development — not just certificates.
          </p>
        </motion.section>

        {/* ================= FINAL LINE ================= */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <p className="text-xl italic text-zinc-300">
            I’m not chasing titles.  
            <br />
            <span className="text-purple-400 font-semibold">
              I’m building skills, systems, and products that stand the test of time.
            </span>
          </p>
        </motion.section>

      </div>
    </main>
  );
}

/* ================= HELPER ================= */
function ProfileLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2 hover:border-purple-500 hover:text-purple-400 transition"
    >
      {label}
    </Link>
  );
}
