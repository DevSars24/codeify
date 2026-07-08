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
        <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground focus:ring-1 focus:ring-ring sm:text-sm transition-all"
                placeholder="Search protocols by title, topic, or pattern..."
                defaultValue={searchParams.get("q")?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    );
}
