import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogSearch from "@/components/BlogSearch";
import BlogCard from "@/components/BlogCard";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

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

  const blogs = await prisma.blog.findMany({ where, orderBy: { createdAt: "desc" } });
  const user = await currentUser();
  const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-28 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted border border-border text-xs font-medium text-muted-foreground mb-4">
            <BookOpen size={14} className="text-primary" /> Knowledge base
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Technical articles</h1>
          <p className="text-muted-foreground mb-8">Deep dives, patterns, and system design notes.</p>
          <BlogSearch />
          {isAdmin && (
            <div className="mt-6">
              <Button asChild size="sm">
                <Link href="/admin/blog/new"><Plus className="mr-2 w-4 h-4" /> New article</Link>
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
            <div className="col-span-full py-20 text-center surface-card border-dashed">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">No articles yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
