import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Plus, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogSearch from "@/components/BlogSearch";
import BlogCard from "@/components/BlogCard";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

const FALLBACK_BLOGS = [
  {
    id: "blog-dp-1",
    title: "Mastering Dynamic Programming: From Memoization to State Machines",
    content: "Dynamic programming becomes intuitive once you recognize recurrence relations and state boundaries. In this deep dive, we walk through 0/1 knapsack, interval DP, and tree DP with optimal space-saving techniques.",
    imageUrl: "",
    domains: ["DSA", "Algorithms"],
    source: "CodeSaarthi Insights",
    pattern: "Dynamic Programming",
    slug: "mastering-dynamic-programming",
    createdAt: new Date("2026-03-15"),
  },
  {
    id: "blog-ai-2",
    title: "Building Resilient Multi-Model AI Pipelines with Groq & Gemini",
    content: "How round-robin API key pooling across Groq LPUs paired with automatic Gemini fallbacks eliminates 429 rate limit spikes, minimizes API costs, and delivers sub-200ms latency on code execution simulations.",
    imageUrl: "",
    domains: ["AI Systems", "Groq"],
    source: "System Architecture",
    pattern: "Multi-Model Fallback",
    slug: "resilient-multi-model-ai-pipelines",
    createdAt: new Date("2026-03-20"),
  },
  {
    id: "blog-sys-3",
    title: "Real-time Collaborative Code Editors with WebRTC and LiveKit",
    content: "Exploring low-latency audio/video tracks, peer data channels, and state synchronization needed to run live peer-coding classrooms without server bottlenecks.",
    imageUrl: "",
    domains: ["WebRTC", "Live Coding"],
    source: "LiveKit Engineering",
    pattern: "Realtime Collaboration",
    slug: "realtime-collaborative-editors",
    createdAt: new Date("2026-03-25"),
  },
];

interface BlogItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  domains: string[];
  source?: string | null;
  pattern?: string | null;
  slug: string;
  createdAt: Date;
}

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function BlogsPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const queryTerm = q || "";

  const where = queryTerm
    ? {
        OR: [
          { title: { contains: queryTerm, mode: "insensitive" as const } },
          { source: { contains: queryTerm, mode: "insensitive" as const } },
          { pattern: { contains: queryTerm, mode: "insensitive" as const } },
        ],
      }
    : {};

  let blogs: BlogItem[] = FALLBACK_BLOGS;
  let isLiveDb = true;

  try {
    const dbBlogs = await prisma.blog.findMany({ where, orderBy: { createdAt: "desc" } });
    if (dbBlogs && dbBlogs.length > 0) {
      blogs = dbBlogs;
    } else if (queryTerm) {
      blogs = FALLBACK_BLOGS.filter(
        (b) =>
          b.title.toLowerCase().includes(queryTerm.toLowerCase()) ||
          b.source.toLowerCase().includes(queryTerm.toLowerCase()) ||
          b.domains.some((d) => d.toLowerCase().includes(queryTerm.toLowerCase()))
      );
    }
  } catch (err) {
    console.warn("[Blogs Page] Database currently unreachable; serving curated knowledge articles.", err);
    isLiveDb = false;
    if (queryTerm) {
      blogs = FALLBACK_BLOGS.filter(
        (b) =>
          b.title.toLowerCase().includes(queryTerm.toLowerCase()) ||
          b.source.toLowerCase().includes(queryTerm.toLowerCase()) ||
          b.domains.some((d) => d.toLowerCase().includes(queryTerm.toLowerCase()))
      );
    }
  }

  const user = await currentUser();
  const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-ambient-mesh text-foreground overflow-hidden">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-muted-foreground mb-4 backdrop-blur-md">
            <BookOpen size={14} className="text-violet-400" /> Technical Knowledge Base
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-frost">
            Technical Articles & Deep Dives
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
            Algorithmic patterns, system design notes, and real-world software architecture.
          </p>

          {!isLiveDb && (
            <div className="mb-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono border border-violet-500/20 bg-violet-500/10 text-violet-300">
              <Sparkles size={12} /> Curated article bank active (offline resilient mode)
            </div>
          )}

          <BlogSearch />
          {isAdmin && (
            <div className="mt-6">
              <Button asChild size="sm" className="bg-white text-black hover:bg-zinc-200">
                <Link href="/admin/blog/new">
                  <Plus className="mr-2 w-4 h-4" /> New article
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              content={blog.content}
              imageUrl={blog.imageUrl}
              domains={blog.domains}
              source={blog.source}
              createdAt={blog.createdAt}
            />
          ))}
          {blogs.length === 0 && (
            <div className="col-span-full py-20 text-center glass-card border-dashed">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">No matching articles found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
