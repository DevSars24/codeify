import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Code2,
  Cpu,
  Orbit,
  PenLine,
  Plus,
  Sparkles,
  Terminal,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogSearch from "@/components/BlogSearch";
import BlogCard from "@/components/BlogCard";
import { FALLBACK_BLOGS, type BlogItem } from "@/lib/blogs";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";
const CONTRIBUTION_EMAIL = ADMIN_EMAIL;
const CONTRIBUTION_LINK = `mailto:${CONTRIBUTION_EMAIL}?subject=${encodeURIComponent("Story pitch — The AI Engineer's Journal")}&body=${encodeURIComponent(
  [
    "Hi Codeify team,",
    "",
    "I'd like to contribute a story.",
    "",
    "Topic:",
    "What readers will learn:",
    "Relevant stage (foundations, models, systems, or shipping):",
    "Link to outline or draft (optional):",
    "",
    "Thanks!",
  ].join("\r\n")
)}`;

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

const JOURNEY_STAGES = [
  {
    number: "01",
    title: "The foundations",
    description: "Python, linear algebra, probability, and the math behind learning from data.",
    icon: Code2,
    accent: "text-[#b8d5c8]",
  },
  {
    number: "02",
    title: "Machine learning to deep learning",
    description: "Training loops, loss functions, neural networks, and learning to debug a model.",
    icon: BrainCircuit,
    accent: "text-[#d5c1a8]",
  },
  {
    number: "03",
    title: "Transformers & foundation models",
    description: "Attention, tokenization, embeddings, fine-tuning, and how LLMs actually work.",
    icon: Cpu,
    accent: "text-[#d9c995]",
  },
  {
    number: "04",
    title: "AI systems that work",
    description: "RAG, tool use, evaluations, data pipelines, and reliable model serving.",
    icon: Terminal,
    accent: "text-[#b9c9b4]",
  },
  {
    number: "05",
    title: "Production & impact",
    description: "Ship, observe, and improve real AI products for the people who use them.",
    icon: Sparkles,
    accent: "text-[#d7b6ac]",
  },
];

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

  const searchFallbackBlogs = () =>
    FALLBACK_BLOGS.filter(
      (blog) =>
        blog.title.toLowerCase().includes(queryTerm.toLowerCase()) ||
        blog.source?.toLowerCase().includes(queryTerm.toLowerCase()) ||
        blog.domains.some((domain) => domain.toLowerCase().includes(queryTerm.toLowerCase()))
    );

  let blogs: BlogItem[] = FALLBACK_BLOGS;
  let isLiveDb = Boolean(process.env.DATABASE_URL);

  if (!isLiveDb) {
    console.warn("[Blogs Page] DATABASE_URL is not configured; serving curated knowledge articles.");
    if (queryTerm) blogs = searchFallbackBlogs();
  } else {
    try {
      const dbBlogs = await prisma.blog.findMany({ where, orderBy: { createdAt: "desc" } });
      if (dbBlogs && dbBlogs.length > 0) {
        blogs = dbBlogs;
      } else if (queryTerm) {
        blogs = searchFallbackBlogs();
      }
    } catch (err) {
      const reason = err instanceof Error ? err.message.split("\n")[0] : String(err);
      console.warn("[Blogs Page] Database currently unreachable; serving curated knowledge articles.", reason);
      isLiveDb = false;
      if (queryTerm) blogs = searchFallbackBlogs();
    }
  }

  const user = await currentUser();
  const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL;

  return (
    <div className="min-h-screen overflow-hidden bg-[#0b0d0e] text-[#f4f1e9]">
      <Navbar />
      <main>
        <section className="relative isolate overflow-hidden border-b border-white/[0.08]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-64 left-[15%] h-[34rem] w-[48rem] rounded-full bg-[#a99572]/[0.09] blur-[120px]" />
            <div className="absolute right-[-14rem] top-20 h-[36rem] w-[36rem] rounded-full bg-[#77958a]/[0.08] blur-[130px]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b0d0e] to-transparent" />
          </div>

          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-32 sm:px-8 sm:pb-24 md:pt-40 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <div className="max-w-2xl">
              <div className="mb-8 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#c7c0b1]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] text-[#c9b88e] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  <Orbit size={15} strokeWidth={1.5} />
                </span>
                <span>CodeSaarthi field notes</span>
                <span className="h-px w-8 bg-white/20" />
                <span className="text-white/45">Issue 01</span>
              </div>
              <h1 className="max-w-3xl font-serif text-[3.6rem] font-normal leading-[0.99] tracking-[-0.055em] text-[#f2efe7] sm:text-7xl lg:text-[5.5rem]">
                Learning to build
                <span className="block text-[#b8c5b2]">with intelligence.</span>
              </h1>
              <p className="mt-7 max-w-lg text-[15px] leading-7 text-[#aaa99f] sm:text-base sm:leading-8">
                A practical journal for the long road into AI engineering: the things worth learning, the systems worth building, and the lessons you only get by shipping.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#latest"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e7e1d3]/70 bg-[#e7e1d3] px-5 py-3 text-sm font-semibold text-[#171916] shadow-[0_6px_24px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.8)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Start reading <ArrowDown size={16} />
                </a>
                <a
                  href={CONTRIBUTION_LINK}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.045] px-5 py-3 text-sm font-medium text-[#eeece5] shadow-[inset_0_1px_0_rgba(255,255,255,0.09)] backdrop-blur-xl transition hover:border-white/25 hover:bg-white/[0.08]"
                >
                  <PenLine size={15} className="text-[#c9b88e]" /> Write with us
                </a>
              </div>
              {!isLiveDb && (
                <div className="mt-6 inline-flex items-center gap-2 text-xs text-[#8e9a8b]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#a9bb9f]" />
                  The journal is open; more stories are on the way.
                </div>
              )}
              {isAdmin && (
                <div className="mt-5">
                  <Button asChild size="sm" className="rounded-full bg-[#e7e1d3] text-[#171916] hover:bg-white">
                    <Link href="/admin/blog/new">
                      <Plus className="mr-2 h-4 w-4" /> Publish an article
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
              <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-white/[0.13] via-transparent to-[#a9b49b]/[0.12] blur-sm" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.13] bg-[#171a18]/65 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.11)] backdrop-blur-2xl sm:p-7">
                <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-[#a9b49b]/[0.08] blur-[80px]" />
                <div className="relative flex items-start justify-between gap-4 border-b border-white/[0.09] pb-5">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#aeb0a4]">A learning series</p>
                    <p className="mt-2 max-w-xs font-serif text-xl leading-snug text-[#f0eee7] sm:text-2xl">The road to becoming an AI engineer</p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.13] bg-white/[0.055] text-[#c9b88e] shadow-[inset_0_1px_0_rgba(255,255,255,0.13)]">
                    <BrainCircuit size={18} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="relative mt-3 space-y-1 before:absolute before:bottom-5 before:left-[17px] before:top-5 before:w-px before:bg-gradient-to-b before:from-white/25 before:via-white/10 before:to-transparent">
                  {JOURNEY_STAGES.map((stage, index) => {
                    const Icon = stage.icon;
                    return (
                      <div key={stage.number} className="group relative flex gap-4 rounded-xl px-2.5 py-3 transition-colors hover:bg-white/[0.045]">
                        <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.13] bg-[#1a1d1b]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] ${stage.accent}`}>
                          <Icon size={16} strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0 flex-1 py-0.5">
                          <div className="flex items-baseline gap-2.5">
                            <span className="font-mono text-[10px] text-[#888b80]">{stage.number}</span>
                            <h2 className="text-[13px] font-medium text-[#e9e7df]">{stage.title}</h2>
                          </div>
                          <p className="mt-1 text-xs leading-[1.65] text-[#a1a39a]">{stage.description}</p>
                        </div>
                        {index === 0 && <span className="absolute right-3 top-4 h-1.5 w-1.5 rounded-full bg-[#b8c5a6]" />}
                      </div>
                    );
                  })}
                </div>
                <div className="relative mt-3 flex items-center justify-between gap-4 rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <span className="text-xs leading-5 text-[#b5b5aa]">No shortcuts, no gatekeeping. Just a map and a place to compare notes.</span>
                  <Users size={15} className="shrink-0 text-[#9ea68f]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="mb-9 flex flex-col gap-6 border-b border-white/[0.09] pb-7 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#a9b49b]">
                <BookOpen size={13} strokeWidth={1.5} /> From the notebook
              </div>
              <h2 id="latest" className="font-serif text-3xl font-normal tracking-tight text-[#f0eee7] sm:text-4xl">
                Useful things, learned the hard way.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#a1a39a]">
                Notes on the models, tools, and decisions behind software that works.
              </p>
            </div>
            <div className="w-full md:max-w-sm md:pb-1">
              <BlogSearch />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                content={blog.content}
                imageUrl={blog.imageUrl}
                domains={blog.domains}
                source={blog.source}
                createdAt={blog.createdAt}
                featured={index === 0 && !queryTerm}
              />
            ))}
            {blogs.length === 0 && (
              <div className="col-span-full rounded-3xl border border-dashed border-white/[0.16] bg-white/[0.025] px-6 py-20 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
                <BookOpen className="mx-auto mb-4 h-9 w-9 text-[#9da795]" strokeWidth={1.4} />
                <p className="font-serif text-2xl text-[#f0eee7]">Nothing in the notebook yet.</p>
                <p className="mt-2 text-sm text-[#a1a39a]">Try another topic, or pitch the story you hoped to find.</p>
                <a href={CONTRIBUTION_LINK} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#c9d0be] hover:text-white">
                  Pitch a story <ArrowRight size={15} />
                </a>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.14] bg-[#171a18]/65 px-6 py-9 shadow-[0_24px_70px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl sm:px-10 sm:py-11">
            <div aria-hidden="true" className="absolute -right-16 -top-32 h-72 w-72 rounded-full bg-[#a9b49b]/[0.08] blur-[85px]" />
            <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#b8c5a6]">
                  <Users size={14} strokeWidth={1.5} /> A note to fellow builders
                </div>
                <h2 className="font-serif text-2xl font-normal tracking-tight text-[#f0eee7] sm:text-3xl">The best notes come from the people doing the work.</h2>
                <p className="mt-3 text-sm leading-6 text-[#a1a39a] sm:text-base">
                  A project that surprised you. A paper that finally clicked. A mistake you won&apos;t make twice. Send us a rough outline; we&apos;ll help shape it into something useful.
                </p>
              </div>
              <a
                href={CONTRIBUTION_LINK}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#e7e1d3]/70 bg-[#e7e1d3] px-5 py-3 text-sm font-semibold text-[#171916] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <PenLine size={15} /> Send us a note <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
