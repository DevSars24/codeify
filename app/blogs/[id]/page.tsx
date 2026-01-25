import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
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
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20">

                <Link href="/blogs" className="text-zinc-500 hover:text-white mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors">
                    <ArrowLeft size={16} /> Back to Protocols
                </Link>

                {/* Header */}
                <header className="mb-12 border-b border-zinc-900 pb-12">
                    {/* Admin Controls */}
                    {isAdmin && (
                        <div className="flex gap-2 mb-6 justify-end">
                            <Link href={`/admin/blog/edit/${blog.id}`}>
                                <button className="px-3 py-1.5 rounded bg-blue-900/30 text-blue-400 text-xs font-bold uppercase hover:bg-blue-900/50 flex items-center gap-2">
                                    <Edit size={12} /> Edit
                                </button>
                            </Link>
                            <DeleteBlogButton id={blog.id} />
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-6">
                        {blog.domains.map((d: string) => (
                            <span key={d} className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-[10px] font-bold uppercase tracking-wide">
                                {d}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight break-words">
                        {blog.title}
                    </h1>

                    <div className="flex items-center gap-6 text-sm text-zinc-500 font-mono">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            {new Date(blog.createdAt).toLocaleDateString()}
                        </div>
                        {blog.source && (
                            <div className="flex items-center gap-2">
                                <Database size={14} />
                                {blog.source}
                            </div>
                        )}
                        {blog.pattern && (
                            <div className="flex items-center gap-2">
                                <Layers size={14} />
                                {blog.pattern}
                            </div>
                        )}
                    </div>
                </header>

                {/* Content */}
                {blog.imageUrl && (
                    <img src={blog.imageUrl} alt={blog.title} className="w-full rounded-2xl border border-zinc-800 mb-12 shadow-2xl shadow-black" />
                )}

                <article className="prose prose-invert prose-purple max-w-none prose-lg 
                    prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8
                    prose-p:leading-relaxed prose-p:mb-6 prose-p:text-zinc-300
                    prose-li:leading-relaxed prose-li:mb-2
                    prose-ul:my-6 prose-ol:my-6
                    prose-code:font-mono prose-code:text-purple-300 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl prose-pre:my-8
                    prose-blockquote:border-purple-500 prose-blockquote:bg-purple-500/5 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
                    prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white prose-em:text-zinc-200
                    [&>*]:leading-7 space-y-4">
                    <MarkdownRenderer content={blog.content} />
                </article>

            </main>
        </div>
    );
}
