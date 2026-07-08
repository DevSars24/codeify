import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { ArrowLeft, Edit, Trash2, Calendar, Tag, Database, Layers } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import DeleteBlogButton from "@/components/DeleteBlogButton"; // Helper component for interactivity
import MarkdownRenderer from "@/components/MarkdownRenderer"; // Reusing or creating one

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function BlogPage({ params }: PageProps) {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({
        where: { id }
    });

    if (!blog) return notFound();

    const user = await currentUser();
    const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL;

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-16 sm:pb-20">

                <Link href="/blogs" className="text-muted-foreground hover:text-foreground mb-6 sm:mb-8 inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors">
                    <ArrowLeft size={14} className="sm:w-4 sm:h-4" /> Back to Protocols
                </Link>

                {/* Header */}
                <header className="mb-8 sm:mb-12 border-b border-border pb-8 sm:pb-12">
                    {/* Admin Controls */}
                    {isAdmin && (
                        <div className="flex gap-2 mb-4 sm:mb-6 justify-start sm:justify-end">
                            <Link href={`/admin/blog/edit/${blog.id}`}>
                                <button className="px-3 py-1.5 rounded-md border border-border bg-background text-foreground text-xs font-bold uppercase hover:bg-muted flex items-center gap-2">
                                    <Edit size={12} /> Edit
                                </button>
                            </Link>
                            <DeleteBlogButton id={blog.id} />
                        </div>
                    )}

                    {/* Domain Tags */}
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                        {blog.domains.map((d: string) => (
                            <span key={d} className="px-2 py-1 bg-muted text-muted-foreground border border-border rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wide">
                                {d}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 sm:mb-6 leading-tight break-words">
                        {blog.title}
                    </h1>

                    {/* Metadata - Stack on mobile, row on larger screens */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground font-mono">
                        <div className="flex items-center gap-2">
                            <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                        {blog.source && (
                            <div className="flex items-center gap-2">
                                <Database size={12} className="sm:w-3.5 sm:h-3.5" />
                                <span className="truncate max-w-[120px] sm:max-w-none">{blog.source}</span>
                            </div>
                        )}
                        {blog.pattern && (
                            <div className="flex items-center gap-2">
                                <Layers size={12} className="sm:w-3.5 sm:h-3.5" />
                                <span>{blog.pattern}</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Featured Image */}
                {blog.imageUrl && (
                    <div className="relative w-full aspect-[16/9] mb-8 sm:mb-12 rounded-md overflow-hidden border border-border">
                        <Image
                            src={blog.imageUrl}
                            alt={blog.title}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 1200px"
                        />
                    </div>
                )}

                {/* Article Content - Responsive prose */}
                <article className="prose max-w-none 
                    prose-sm sm:prose-base md:prose-lg
                    prose-headings:font-bold prose-headings:mb-3 sm:prose-headings:mb-4 prose-headings:mt-6 sm:prose-headings:mt-8
                    prose-h1:text-xl prose-h1:sm:text-2xl prose-h1:md:text-3xl
                    prose-h2:text-lg prose-h2:sm:text-xl prose-h2:md:text-2xl
                    prose-h3:text-base prose-h3:sm:text-lg prose-h3:md:text-xl
                    prose-p:leading-relaxed prose-p:mb-4 sm:prose-p:mb-6 prose-p:text-muted-foreground prose-p:text-sm sm:prose-p:text-base
                    prose-li:leading-relaxed prose-li:mb-1 sm:prose-li:mb-2 prose-li:text-sm sm:prose-li:text-base
                    prose-ul:my-4 sm:prose-ul:my-6 prose-ol:my-4 sm:prose-ol:my-6
                    prose-code:font-mono prose-code:text-foreground prose-code:bg-muted prose-code:px-1 sm:prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm
                    prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-md prose-pre:my-6 sm:prose-pre:my-8 prose-pre:text-xs sm:prose-pre:text-sm prose-pre:overflow-x-auto
                    prose-blockquote:border-foreground prose-blockquote:bg-muted prose-blockquote:py-1 prose-blockquote:rounded-r-md prose-blockquote:text-sm sm:prose-blockquote:text-base
                    prose-a:text-foreground prose-a:no-underline hover:prose-a:underline prose-a:break-words
                    prose-strong:text-foreground prose-em:text-muted-foreground
                    prose-img:rounded-md prose-img:my-6 sm:prose-img:my-8
                    [&>*]:leading-6 sm:[&>*]:leading-7 space-y-3 sm:space-y-4">
                    <MarkdownRenderer content={blog.content} />
                </article>

            </main>
        </div>
    );
}
