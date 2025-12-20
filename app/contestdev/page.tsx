"use client";

import { Suspense } from "react";
import ContestDev from "@/components/ContestDev";

export default function ContestPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ContestDev />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Loading contest...
    </div>
  );
}
