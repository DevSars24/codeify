"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  domains: string[];
  source?: string | null;
  createdAt: Date | string;
}

export default function BlogCard({ id, title, content, imageUrl, domains, source, createdAt }: BlogCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || prefersReducedMotion()) return;

    const onEnter = () => gsap.to(el, { borderColor: "var(--foreground)", duration: 0.25, ease: "power2.out" });
    const onLeave = () => gsap.to(el, { borderColor: "var(--border)", duration: 0.25, ease: "power2.out" });

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <Link href={`/blogs/${id}`} className="group block h-full">
      <article ref={cardRef} className="surface-card overflow-hidden h-full flex flex-col transition-shadow hover:shadow-sm">
        <div className="aspect-[16/10] bg-muted relative overflow-hidden">
          {imageUrl ? (
            <Image src={imageUrl} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Layers size={32} />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            {domains.slice(0, 2).map((d) => (
              <span key={d} className="bg-background/90 border border-border text-[10px] font-medium px-2 py-0.5 rounded">
                {d}
              </span>
            ))}
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span>{new Date(createdAt).toLocaleDateString()}</span>
            {source && <><span>·</span><span className="text-primary">{source}</span></>}
          </div>
          <h2 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{title}</h2>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
            {content.substring(0, 150).replace(/[#*`]/g, "")}...
          </p>
          <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
            Read article <ArrowRight size={14} />
          </span>
        </div>
      </article>
    </Link>
  );
}
