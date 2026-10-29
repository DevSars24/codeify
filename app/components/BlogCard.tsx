import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Layers } from "lucide-react";

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  domains: string[];
  source?: string | null;
  createdAt: Date | string;
  featured?: boolean;
}

export default function BlogCard({ id, title, content, imageUrl, domains, source, createdAt, featured = false }: BlogCardProps) {
  const publishedDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(createdAt));
  const excerpt = content.substring(0, 160).replace(/[#*`]/g, "").trim();
  const hasMore = content.length > 160;

  return (
    <Link href={`/blogs/${id}`} className={`group block h-full ${featured ? "md:col-span-2" : ""}`}>
      <article className={`group/card relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.11] bg-[#171a18]/55 shadow-[0_16px_50px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/[0.22] hover:bg-[#1b1e1b]/75 ${featured ? "md:flex-row" : ""}`}>
        <div className={`relative overflow-hidden bg-[#171a18] ${featured ? "aspect-[16/10] md:aspect-auto md:min-h-[22rem] md:w-[49%]" : "aspect-[16/10]"}`}>
          {imageUrl ? (
            <Image src={imageUrl} alt={title} fill className="object-cover transition duration-700 group-hover/card:scale-[1.035] group-hover/card:saturate-[1.08]" sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"} />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center bg-[radial-gradient(ellipse_at_60%_20%,rgba(169,180,155,0.14),transparent_65%)] text-[#aeb9a3]/60">
              <Layers size={34} strokeWidth={1.25} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/[0.04] to-black/15" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {domains.slice(0, 2).map((d) => (
              <span key={d} className="rounded-full border border-white/20 bg-[#171a18]/55 px-3 py-1.5 text-[10px] font-medium tracking-wide text-[#f4f1e9] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl">
                {d}
              </span>
            ))}
          </div>
          {featured && (
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#171a18]/50 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#eee9dc] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c4cba9]" /> Start here
            </span>
          )}
        </div>
        <div className={`flex flex-1 flex-col p-5 sm:p-6 ${featured ? "md:justify-center md:p-8 lg:p-10" : ""}`}>
          <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] text-[#9c9f96]">
            <span>{publishedDate}</span>
            {source && <><span className="text-white/25">·</span><span className="text-[#b9c3aa]">{source}</span></>}
          </div>
          <h2 className={`font-serif font-normal leading-[1.2] tracking-[-0.025em] text-[#f1eee6] transition-colors group-hover/card:text-white ${featured ? "text-2xl sm:text-3xl lg:text-[2.4rem]" : "text-xl"}`}>
            {title}
          </h2>
          <p className={`mb-6 mt-3 flex-1 text-[13px] leading-[1.75] text-[#a9aaa1] ${featured ? "line-clamp-4 max-w-xl sm:text-sm sm:leading-7" : "line-clamp-3"}`}>
            {excerpt}{hasMore ? "..." : ""}
          </p>
          <span className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-[#d9d4c8]">
            Read the field note <ArrowUpRight size={14} className="text-[#b9c3aa] transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}
