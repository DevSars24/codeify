import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Plus, ArrowRight, Layers, Tag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

import BlogSearch from "@/components/BlogSearch";

interface PageProps {
    searchParams: Promise<{
        q?: string;
    }>;
}

export default async function BlogsPage({ searchParams }: PageProps) {
    const { q } = await searchParams;
    const queryTerm = q || "";

    const where = queryTerm ? {
        OR: [
            { title: { contains: queryTerm, mode: 'insensitive' as const } },
            { source: { contains: queryTerm, mode: 'insensitive' as const } },
            { pattern: { contains: queryTerm, mode: 'insensitive' as const } },
            // Accessing array in Prisma for text search is trickier, simplified here to scalar fields or basic array check if supported
            // or just stick to title/source/pattern for now
        ]
    } : {};

    const blogs = await prisma.blog.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    });

    const user = await currentUser();
    const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20">

                <div className="flex items-end justify-between mb-16 border-b border-zinc-800 pb-8">
                    <div>
                        <div className="flex items-center gap-2 text-purple-400 mb-2">
                            <Layers size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Knowledge Base</span>
                        </div>
                        <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                            Mission <span className="text-zinc-600">Protocols</span>
                        </h1>
                        <BlogSearch />
                    </div>

                    {isAdmin && (
                        <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full px-6">
                            <Link href="/admin/blog/new">
                                <Plus className="mr-2 w-4 h-4" /> New Entry
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <Link
                            key={blog.id}
                            href={`/blogs/${blog.id}`}
                            className="group block h-full"
                        >
                            <article className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl overflow-hidden h-full flex flex-col hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1">
                                {/* Image Area */}
                                <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                                    {blog.imageUrl ? (
                                        <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                            <Layers size={48} />
                                        </div>
                                    )}
                                    {/* Overlay Tags */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {blog.domains.slice(0, 2).map((d: string) => (
                                            <span key={d} className="bg-black/60 backdrop-blur border border-white/10 text-white text-[10px] font-bold uppercase px-2 py-1 rounded">
                                                {d}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase mb-3">
                                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                        {blog.source && (
                                            <>
                                                <span>•</span>
                                                <span className="text-purple-400">{blog.source}</span>
                                            </>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
                                        {blog.title}
                                    </h2>

                                    <p className="text-zinc-400 text-sm line-clamp-3 mb-6 flex-1">
                                        {/* Simplified excerpt creation for markdown */}
                                        {blog.content.substring(0, 150).replace(/[#*`]/g, '')}...
                                    </p>

                                    <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:underline decoration-zinc-700 underline-offset-4">
                                        Read Protocol <ArrowRight size={14} />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}

                    {blogs.length === 0 && (
                        <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-3xl">
                            <p className="text-zinc-500 font-mono text-sm uppercase">No protocols initialized yet.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
