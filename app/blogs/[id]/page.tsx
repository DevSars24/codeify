import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Calendar, Database, Edit, Layers, PenLine, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteBlogButton from "@/components/DeleteBlogButton";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { FALLBACK_BLOGS } from "@/lib/blogs";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";
const CONTRIBUTION_LINK = "mailto:saurabhsingh100605@gmail.com?subject=Story%20pitch%20%E2%80%94%20The%20AI%20Engineer%27s%20Journal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPage({ params }: PageProps) {
  const { id } = await params;
  let blog = null;

  if (process.env.DATABASE_URL) {
    try {
      blog = await prisma.blog.findUnique({ where: { id } });
    } catch (err) {
      const reason = err instanceof Error ? err.message.split("\n")[0] : String(err);
      console.warn("[Blog Page] Database currently unreachable; checking curated articles.", reason);
    }
  }

  const article = blog ?? FALLBACK_BLOGS.find((fallbackBlog) => fallbackBlog.id === id);
  if (!article) return notFound();

  const user = await currentUser();
  const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL;
  const publishedDate = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(article.createdAt));

  return (
    <div className="min-h-screen overflow-hidden bg-[#0b0d0e] text-[#f4f1e9]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-[#aaa99f] transition hover:text-[#f4f1e9]">
              <ArrowLeft size={16} /> Back to the journal
            </Link>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/blog/edit/${article.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.13] bg-white/[0.045] px-3.5 py-2 text-xs font-medium text-[#e9e5db] shadow-[inset_0_1px_0_rgba(255,255,255,0.09)] backdrop-blur-xl transition hover:border-white/25 hover:bg-white/[0.08]"
                >
                  <Edit size={13} /> Edit story
                </Link>
                <DeleteBlogButton id={article.id} />
              </div>
            )}
          </div>

          <header className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.13] bg-[#171a18]/65 px-6 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl sm:px-10 sm:py-12">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-[#a9b49b]/[0.08] blur-[90px]" />
            <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-px w-2/3 bg-gradient-to-r from-[#c9b88e]/35 to-transparent" />
            <div className="relative">
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="mr-2 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#b8c5a6]">
                  <Sparkles size={13} strokeWidth={1.5} /> A field note
                </span>
                {article.domains.map((domain: string) => (
                  <span key={domain} className="rounded-full border border-white/[0.12] bg-white/[0.045] px-3 py-1.5 text-[10px] font-medium tracking-wide text-[#dad8cd] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
                    {domain}
                  </span>
                ))}
              </div>
              <h1 className="max-w-3xl font-serif text-3xl font-normal leading-[1.14] tracking-[-0.04em] text-[#f2efe7] sm:text-5xl sm:leading-[1.12]">
                {article.title}
              </h1>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.09] pt-5 text-xs text-[#a6a79d]">
                <span className="inline-flex items-center gap-2">
                  <Calendar size={14} className="text-[#b9c3aa]" strokeWidth={1.5} /> {publishedDate}
                </span>
                {article.source && (
                  <span className="inline-flex items-center gap-2">
                    <Database size={14} className="text-[#b9c3aa]" strokeWidth={1.5} /> {article.source}
                  </span>
                )}
                {article.pattern && (
                  <span className="inline-flex items-center gap-2">
                    <Layers size={14} className="text-[#b9c3aa]" strokeWidth={1.5} /> {article.pattern}
                  </span>
                )}
              </div>
            </div>
          </header>

          {article.imageUrl && (
            <div className="relative mt-5 aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-white/[0.13] bg-[#171a18] shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          )}

          <article className="prose mx-auto mt-10 max-w-3xl
            prose-sm sm:prose-base md:prose-lg
            prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-[#f0eee7]
            prose-h1:text-2xl prose-h1:sm:text-3xl
            prose-h2:text-xl prose-h2:sm:text-2xl
            prose-h3:text-lg prose-h3:sm:text-xl
            prose-p:leading-8 prose-p:text-[#c4c3ba] prose-p:sm:leading-9
            prose-li:leading-7 prose-li:text-[#c4c3ba]
            prose-ul:my-6 prose-ol:my-6
            prose-code:rounded-md prose-code:border prose-code:border-white/[0.12] prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[#d4d8c8] prose-code:before:content-none prose-code:after:content-none
            prose-pre:overflow-x-auto prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/[0.12] prose-pre:bg-[#151816]
            prose-blockquote:border-[#a9b49b]/50 prose-blockquote:text-[#c4c3ba]
            prose-a:text-[#c9d0be] prose-a:decoration-[#c9d0be]/30 hover:prose-a:text-white
            prose-strong:text-[#f0eee7] prose-hr:border-white/10">
            <MarkdownRenderer content={article.content} />
          </article>

          <div className="mx-auto mt-14 max-w-3xl border-t border-white/[0.09] pt-8">
            <div className="flex flex-col gap-5 rounded-[1.5rem] border border-white/[0.13] bg-[#171a18]/60 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#b8c5a6]">
                  <Sparkles size={14} strokeWidth={1.5} /> Keep the knowledge moving
                </div>
                <p className="mt-2 text-sm text-[#aaa99f]">Have a lesson, build, or hard-won insight to share?</p>
              </div>
              <a
                href={CONTRIBUTION_LINK}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.07] px-4 py-2.5 text-sm font-medium text-[#f0eee7] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition hover:border-white/25 hover:bg-white/[0.11]"
              >
                <PenLine size={15} /> Pitch a story <ArrowUpRight size={15} className="text-[#b9c3aa]" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
