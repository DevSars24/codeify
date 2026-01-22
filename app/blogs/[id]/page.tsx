import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
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

    await connectDB();
    const blog = await Blog.findById(id);

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
                            <Link href={`/admin/blog/edit/${blog._id}`}>
                                <button className="px-3 py-1.5 rounded bg-blue-900/30 text-blue-400 text-xs font-bold uppercase hover:bg-blue-900/50 flex items-center gap-2">
                                    <Edit size={12} /> Edit
                                </button>
                            </Link>
                            <DeleteBlogButton id={blog._id.toString()} />
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

                <article className="prose prose-invert prose-purple max-w-none prose-lg prose-headings:font-bold prose-code:font-mono prose-code:text-purple-300">
                    {/* We can use a client component for markdown if needed, or simple rendering */}
                    <MarkdownRenderer content={blog.content} />
                </article>

            </main>
        </div>
    );
}
