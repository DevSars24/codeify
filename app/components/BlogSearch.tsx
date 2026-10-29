"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function BlogSearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-4 w-4 text-[#a9b49b]" strokeWidth={1.6} />
            </div>
            <input
                type="text"
                className="block w-full rounded-full border border-white/[0.13] bg-white/[0.045] py-3 pl-11 pr-4 text-sm leading-5 text-[#f1eee6] shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_8px_24px_rgba(0,0,0,0.12)] outline-none backdrop-blur-xl transition placeholder:text-[#858980] hover:border-white/20 focus:border-[#a9b49b]/50 focus:bg-white/[0.065] focus:ring-2 focus:ring-[#a9b49b]/10"
                placeholder="Look for a topic, tool, or idea..."
                aria-label="Search stories by title, topic, or pattern"
                defaultValue={searchParams.get("q")?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    );
}
