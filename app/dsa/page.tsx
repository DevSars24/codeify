import Dsa from "@/components/Dsa";
import { Suspense } from "react";

export default function DsaPage() {
  return (
    // Next.js 16 requires this for any page using useSearchParams()
    <Suspense fallback={<div className="h-dvh bg-zinc-950 text-white flex items-center justify-center">Loading Contest...</div>}>
      <Dsa />
    </Suspense>
  );
}