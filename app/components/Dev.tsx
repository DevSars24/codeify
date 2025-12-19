"use client";
import { useState } from "react";

/* ================= TYPES ================= */
type Category = "all" | "web" | "app" | "blockchain" | "ai";

/* ================= CATEGORY TABS ================= */
const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All Tracks" },
  { id: "web", label: "Web Dev" },
  { id: "app", label: "App Dev" },
  { id: "blockchain", label: "Blockchain" },
  { id: "ai", label: "Agentic AI" },
];

/* ================= TRACK DATA (HEAVY CONTENT) ================= */
const tracks = [
  /* ================= WEB DEV ================= */
  {
    category: "web",
    level: "Basic",
    color: "green",
    title: "HTML, CSS & JavaScript Foundations",
    stack: ["HTML", "CSS", "JavaScript"],
    topics: [
      "Semantic HTML",
      "Accessibility (ARIA)",
      "Flexbox & Grid",
      "Responsive Design",
      "DOM Manipulation",
      "Event Handling",
      "Forms & Validation",
      "Browser Rendering Basics",
    ],
    outcomes: [
      "Build static & responsive websites",
      "Understand browser behavior",
      "Write clean JS logic",
    ],
  },
  {
    category: "web",
    level: "Medium",
    color: "yellow",
    title: "Modern Frontend Engineering",
    stack: ["React", "Next.js", "TypeScript"],
    topics: [
      "Component Architecture",
      "Hooks & State Management",
      "Client vs Server Components",
      "Routing & Layouts",
      "API Integration",
      "Performance Optimization",
      "SEO Basics",
    ],
    outcomes: [
      "Build scalable frontend apps",
      "Understand React internals",
      "Production-ready UI patterns",
    ],
  },
  {
    category: "web",
    level: "Advanced",
    color: "purple",
    title: "Backend & System Design for Frontend Devs",
    stack: ["APIs", "Auth", "Redis", "Rate Limiting", "Databases"],
    topics: [
      "REST vs GraphQL",
      "JWT & Sessions",
      "RBAC & Auth Flows",
      "Caching Strategies",
      "Rate Limiting Algorithms",
      "Monolith vs Microservices",
      "System Design Interviews",
    ],
    outcomes: [
      "Crack frontend + full-stack interviews",
      "Design scalable systems",
    ],
  },

  /* ================= APP DEV ================= */
  {
    category: "app",
    level: "Basic",
    color: "green",
    title: "Mobile App Development Basics",
    stack: ["React Native", "Flutter"],
    topics: [
      "Mobile UI Components",
      "Navigation Patterns",
      "State Management Basics",
      "Device APIs",
      "Styling Systems",
    ],
    outcomes: ["Build cross-platform apps", "Understand mobile UX"],
  },
  {
    category: "app",
    level: "Advanced",
    color: "purple",
    title: "Scalable Mobile App Architecture",
    stack: ["Firebase", "CI/CD", "Monitoring"],
    topics: [
      "Offline First Apps",
      "Push Notifications",
      "Secure Storage",
      "Deployment Pipelines",
      "Performance Monitoring",
    ],
    outcomes: ["Enterprise-grade mobile apps"],
  },

  /* ================= BLOCKCHAIN ================= */
  {
    category: "blockchain",
    level: "Basic",
    color: "green",
    title: "Blockchain & Smart Contracts",
    stack: ["Solidity", "Ethereum", "Web3"],
    topics: [
      "Blockchain Fundamentals",
      "Smart Contracts",
      "Wallets & Transactions",
      "Gas Fees",
      "Security Basics",
    ],
    outcomes: ["Build simple dApps"],
  },
  {
    category: "blockchain",
    level: "Advanced",
    color: "purple",
    title: "Advanced Blockchain Systems",
    stack: ["Layer 2", "ZK Proofs", "Auditing"],
    topics: [
      "Scalability",
      "Cross-Chain Bridges",
      "Security Audits",
      "Enterprise Blockchain",
    ],
    outcomes: ["Production blockchain systems"],
  },

  /* ================= AGENTIC AI ================= */
  {
    category: "ai",
    level: "Basic",
    color: "green",
    title: "Agentic AI Foundations",
    stack: ["Python", "LangChain", "Prompting"],
    topics: [
      "LLM Basics",
      "Prompt Engineering",
      "Tool Calling",
      "Single-Agent Systems",
    ],
    outcomes: ["Build simple AI agents"],
  },
  {
    category: "ai",
    level: "Advanced",
    color: "purple",
    title: "Production Agentic AI Systems",
    stack: ["Vector DBs", "LLM Ops", "Kubernetes"],
    topics: [
      "Multi-Agent Systems",
      "Memory & Context",
      "Evaluation & Guardrails",
      "Ethical AI",
      "Scalable Deployment",
    ],
    outcomes: ["Deploy real-world AI agents"],
  },
];

/* ================= COMPONENT ================= */
export default function Dev() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const comingSoon = () => {
    alert(
      "🚧 Feature Under Development\n\n" +
        "AI quizzes, challenges & evaluations are being built.\n\n" +
        "For now, practice in the Coding Playground.\n\n" +
        "Thanks for your patience 🙏"
    );
  };

  const visibleTracks =
    activeCategory === "all"
      ? tracks
      : tracks.filter((t) => t.category === activeCategory);

  const getColorClasses = (color: string) => {
    const colors = {
      green: {
        border: "border-green-500",
        text: "text-green-400",
        glow: "shadow-green-500/30",
        bg: "bg-gradient-to-br from-green-500/5 to-green-600/5",
      },
      yellow: {
        border: "border-yellow-500",
        text: "text-yellow-400",
        glow: "shadow-yellow-500/30",
        bg: "bg-gradient-to-br from-yellow-500/5 to-yellow-600/5",
      },
      blue: {
        border: "border-blue-500",
        text: "text-blue-400",
        glow: "shadow-blue-500/30",
        bg: "bg-gradient-to-br from-blue-500/5 to-blue-600/5",
      },
      purple: {
        border: "border-purple-500",
        text: "text-purple-400",
        glow: "shadow-purple-500/30",
        bg: "bg-gradient-to-br from-purple-500/5 to-purple-600/5",
      },
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-5 pt-24 pb-20 overflow-hidden">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto text-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 -z-10 rounded-3xl blur-xl" />
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 relative z-10">
          Development Practice Arena
        </h1>
        <p className="text-zinc-400 max-w-4xl mx-auto text-lg leading-relaxed">
          A complete learning ecosystem covering Web Development, App
          Development, Blockchain and Agentic AI — from beginner fundamentals to
          interview-level mastery.
        </p>
      </div>

      {/* CATEGORY TABS */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex justify-center flex-wrap gap-3">
          {categories.map((c) => {
            const isActive = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`group relative px-6 py-3 rounded-full border-2 font-medium transition-all duration-300 overflow-hidden ${
                  isActive
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-lg shadow-cyan-500/20"
                    : "border-zinc-700/50 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/20 hover:text-zinc-300"
                }`}
              >
                <span className="relative z-10">{c.label}</span>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TRACK GRID */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleTracks.map((t, idx) => {
          const colors = getColorClasses(t.color);
          const bgClass = colors.border.replace("border-", "bg-") + "/40";
          return (
            <div
              key={idx}
              className={`group rounded-2xl ${colors.border} ${colors.bg} bg-zinc-900/40 p-6 flex flex-col transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 ${
                colors.glow
              } shadow-xl border-opacity-80 overflow-hidden relative`}
            >
              {/* Glow Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              
              {/* Level Badge - Enhanced Visibility */}
              <span className={`text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-full inline-block mb-4 transition-all shadow-md ring-1 ring-white/20 ${colors.text} ${bgClass}`}>
                {t.level}
              </span>
              
              {/* Title */}
              <h3 className={`text-xl font-bold mb-4 leading-tight transition-colors ${colors.text} group-hover:drop-shadow-lg`}>
                {t.title}
              </h3>

              {/* STACK */}
              <div className="flex flex-wrap gap-2 mb-4">
                {t.stack.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-3 py-1.5 rounded-full bg-zinc-800/70 text-zinc-300 backdrop-blur-sm transition-all group-hover:bg-zinc-700/80"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* TOPICS */}
              <ul className="text-sm text-zinc-400 space-y-2 mb-5 flex-1">
                {t.topics.slice(0, 6).map((topic, tIdx) => (
                  <li key={tIdx} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${colors.text} flex-shrink-0`} />
                    {topic}
                  </li>
                ))}
                {t.topics.length > 6 && (
                  <li className="text-zinc-500 text-xs">...and {t.topics.length - 6} more</li>
                )}
              </ul>

              {/* OUTCOMES */}
              <div className="text-xs text-zinc-500 mb-6">
                <strong className={`block text-zinc-300 mb-2 font-medium ${colors.text} transition-colors`}>You will learn:</strong>
                <ul className="space-y-1.5">
                  {t.outcomes.map((o, oIdx) => (
                    <li key={oIdx} className="flex items-start gap-2">
                      <span className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.text} font-bold`}>✓</span>
                      <span className="leading-relaxed">{o}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={comingSoon}
                className={`mt-auto w-full py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group-hover:shadow-lg shadow-${t.color}-500/25 bg-gradient-to-r from-${t.color}-600 to-${t.color}-700 hover:from-${t.color}-500 hover:to-${t.color}-600 text-white`}
              >
                <span className="relative z-10">Start Practice</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Teaser */}
      <div className="max-w-7xl mx-auto mt-20 text-center">
        <p className="text-zinc-500 text-sm">
          AI-powered quizzes, challenges & evaluations coming soon 🚀
        </p>
      </div>
    </div>
  );
}