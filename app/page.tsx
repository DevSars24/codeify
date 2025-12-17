"use client";

import { useRouter } from "next/navigation";
import FeatureCard from "@/components/FeatureCard";
import TypingText from "@/components/TypingText";
import Counter from "@/components/Counter";
import { useEffect, useState } from "react";
import Image from "next/image";
import photo from "@/assets/photo.png";

type GithubUser = {
  public_repos: number;
  followers: number;
};

export default function Welcome() {
  const router = useRouter();
  const [github, setGithub] = useState<GithubUser | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/users/DevSars24")
      .then((r) => r.json() as Promise<GithubUser>)
      .then((data) => setGithub(data))
      .catch(() => setGithub(null));
  }, []);

  return (
    <div className="min-h-screen px-6 py-20">

      {/* HERO */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center mb-32">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-purple-400 mb-6">
            Code Saarthi
          </h1>

          <p className="text-xl text-zinc-300 mb-6">
            <TypingText text="Hi, I’m Saurabh Singh Rajput." />
          </p>

          <p className="text-zinc-300 text-lg mb-4">
            IIITian · Web Developer · Agentic AI Enthusiast
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src={photo}
            alt="Saurabh"
            className="rounded-2xl border border-zinc-800"
            width={280}
            height={280}
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto mb-32">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon="🧠" title="Code Review" />
          <FeatureCard icon="🐞" title="Bug Detection" />
          <FeatureCard icon="📖" title="Explain Logic" />
          <FeatureCard icon="🎯" title="Interview Mode" />
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
        <Counter value={400} label="DSA Problems" />
        <Counter value={github?.public_repos || 0} label="Repos" />
        <Counter value={github?.followers || 0} label="Followers" />
        <Counter value={15} label="Contests" />
      </section>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={() => router.push("/home")}
          className="px-10 py-4 bg-purple-600 rounded-xl text-lg"
        >
          Start Coding →
        </button>
      </div>
    </div>
  );
}
