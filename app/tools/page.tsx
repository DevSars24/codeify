import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
    ExternalLink,
    BarChart3,
    Layers,
    Github,
    CheckCircle2,
    ArrowUpRight,
    GraduationCap,
    Presentation,
    Quote
} from "lucide-react";

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24">

                {/* Header */}
                <div className="mb-12 sm:mb-16">
                    <p className="text-xs sm:text-sm font-mono text-zinc-500 uppercase tracking-[0.2em] mb-3">
                        Community Resources
                    </p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        Developer Tools
                    </h1>
                    <p className="text-zinc-500 text-base sm:text-lg max-w-2xl leading-relaxed">
                        Open-source tools designed to accelerate your learning journey.
                        Built by the community, for the community.
                    </p>
                </div>

                {/* Tools */}
                <div className="space-y-6 sm:space-y-8">

                    {/* Vertex Tracker */}
                    <article className="group">
                        <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300">

                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 mb-6">
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1">Vertex Tracker</h2>
                                        <p className="text-zinc-500 text-sm sm:text-base">DSA Progress Tracker & Sheet Manager</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3">
                                    <a
                                        href="https://github.com/somilgupta/vertex"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 sm:p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                                        aria-label="GitHub"
                                    >
                                        <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </a>
                                    <a
                                        href="https://vertex-tracker.vercel.app/dashboard"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all"
                                    >
                                        <span>Open</span>
                                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
                                A comprehensive Data Structures and Algorithms sheet tracker designed to help developers
                                organize, track, and visualize their preparation journey. Import any standard DSA sheet
                                like Striver's SDE Sheet or Love Babbar 450, track your progress with a GitHub-style
                                activity heatmap, and add detailed notes to each problem.
                            </p>

                            {/* Why Use - Students */}
                            <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50 mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <GraduationCap className="w-4 h-4 text-zinc-400" />
                                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">For Students</span>
                                </div>
                                <ul className="space-y-2">
                                    {[
                                        "Track progress across multiple DSA sheets",
                                        "Visualize consistency with activity heatmap",
                                        "Bookmark problems for revision",
                                        "Add notes with markdown support"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
                                            <CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tech */}
                            <div className="flex flex-wrap gap-2">
                                {["Next.js 14", "TypeScript", "MongoDB", "Clerk Auth", "Tailwind CSS"].map((tech) => (
                                    <span key={tech} className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs font-mono">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </article>

                    {/* Nautilus */}
                    <article className="group">
                        <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300">

                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 mb-6">
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                        <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1">Nautilus</h2>
                                        <p className="text-zinc-500 text-sm sm:text-base">System Design & Architecture Visualization</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3">
                                    <a
                                        href="https://github.com/Somilg11/nautilus"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 sm:p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                                        aria-label="GitHub"
                                    >
                                        <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </a>
                                    <a
                                        href="https://nautilusss.vercel.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all"
                                    >
                                        <span>Open</span>
                                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
                                The ultimate open-source system design and architecture visualization tool.
                                A powerful, AI-powered diagramming platform designed for software architects,
                                developers, and system designers to visualize, plan, and document complex systems
                                with production-grade templates.
                            </p>

                            {/* Why Use - Hosts/Mentors */}
                            <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50 mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Presentation className="w-4 h-4 text-zinc-400" />
                                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">For Session Hosts & Mentors</span>
                                </div>
                                <ul className="space-y-2">
                                    {[
                                        "AI-powered architecture generation (OpenAI, Gemini, Claude)",
                                        "Production-grade templates: Netflix, Uber, WhatsApp",
                                        "Rich component library for Cloud, DevOps, Databases",
                                        "Export designs as JSON for documentation"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
                                            <CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tech */}
                            <div className="flex flex-wrap gap-2">
                                {["Next.js", "TypeScript", "AI Integration", "Canvas API", "React Flow"].map((tech) => (
                                    <span key={tech} className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs font-mono">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </article>
                </div>

                {/* Creator Credit */}
                <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-zinc-900">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <p className="text-xs font-mono uppercase tracking-wider text-zinc-600 mb-2">Built by</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                                    SG
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm sm:text-base">Somil Gupta</p>
                                    <p className="text-zinc-500 text-xs sm:text-sm">3rd Year Student, IIIT Bhagalpur</p>
                                </div>
                            </div>
                        </div>

                        <a
                            href="https://github.com/Somilg11"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all text-sm font-medium"
                        >
                            <Github className="w-4 h-4" />
                            <span>@Somilg11</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    </div>

                    {/* Quote */}
                    <div className="mt-8 p-4 sm:p-6 rounded-xl bg-zinc-950 border border-zinc-900">
                        <Quote className="w-5 h-5 text-zinc-700 mb-3" />
                        <p className="text-zinc-500 text-sm italic leading-relaxed">
                            "One of its kind. Free for everyone. Built for the community."
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
