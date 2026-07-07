import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Plus, ArrowRight, Layers, Tag, ExternalLink, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogSearch from "@/components/BlogSearch";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

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
        ]
    } : {};

    const blogs = await prisma.blog.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    });

    const user = await currentUser();
    const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL;

    return (
        <div className="min-h-screen bg-[#0B0A1E] text-white selection:bg-purple-500/30 overflow-hidden relative">
            <Navbar />

            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

            <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 md:pt-40 pb-20 relative z-10">
                
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-6 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-2 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                        <BookOpen size={16} className="text-purple-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Knowledge Base</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                        Best protocols are <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">waiting to enrich</span> your coding skills.
                    </h1>
                    
                    <p className="text-zinc-400 text-lg md:text-xl">
                        Explore our curated database of technical deep dives, architectural patterns, and system designs.
                    </p>

                    {/* Prominent Search Bar Container */}
                    <div className="pt-6 relative max-w-2xl mx-auto">
                        <BlogSearch />
                        {isAdmin && (
                            <div className="mt-6">
                                <Button asChild className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-full px-8 py-6 shadow-xl shadow-purple-500/20 transition-all hover:scale-105">
                                    <Link href="/admin/blog/new">
                                        <Plus className="mr-2 w-5 h-5" /> Initialize New Protocol
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-bold text-white">Popular Protocols</h2>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog: any) => (
                            <Link
                                key={blog.id}
                                href={`/blogs/${blog.id}`}
                                className="group block h-full"
                            >
                                <article className="bg-[#16133A]/60 backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden h-full flex flex-col hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(168,85,247,0.1)]">
                                    {/* Image Area */}
                                    <div className="aspect-[16/10] bg-[#1a1744] relative overflow-hidden p-2">
                                        <div className="w-full h-full rounded-[24px] overflow-hidden relative">
                                            {blog.imageUrl ? (
                                                <Image src={blog.imageUrl} alt={blog.title} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-indigo-400/50 bg-gradient-to-br from-[#1c184d] to-[#120f33]">
                                                    <Layers size={48} className="mb-2" />
                                                </div>
                                            )}
                                        </div>
                                        {/* Overlay Tags */}
                                        <div className="absolute top-6 left-6 flex flex-wrap gap-2 pr-6">
                                            {blog.domains.slice(0, 2).map((d: string) => (
                                                <span key={d} className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full shadow-lg">
                                                    {d}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex-1 flex flex-col relative z-10">
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase mb-4">
                                            <span className="bg-white/5 px-2 py-1 rounded">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                            {blog.source && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-purple-500" />
                                                    <span className="text-purple-400 bg-purple-500/10 px-2 py-1 rounded">{blog.source}</span>
                                                </>
                                            )}
                                        </div>

                                        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300 line-clamp-2 leading-tight">
                                            {blog.title}
                                        </h2>

                                        <p className="text-zinc-400/80 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">
                                            {blog.content.substring(0, 150).replace(/[#*`]/g, '')}...
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 group-hover:text-purple-300">
                                                Read Protocol 
                                                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors ml-1">
                                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}

                        {blogs.length === 0 && (
                            <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-[32px] bg-[#16133A]/30">
                                <BookOpen className="w-16 h-16 text-indigo-500/30 mx-auto mb-4" />
                                <p className="text-indigo-300 font-bold text-lg mb-2">No protocols initialized yet.</p>
                                <p className="text-zinc-500 text-sm">Check back later for new content.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
