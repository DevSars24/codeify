"use client"; // Note: If you want to fetch data on the server, remove this. 
              // But based on your code, let's fix the prop mismatch.

import { Suspense, useEffect, useState } from "react";
import ContestDsa from "@/components/ContestDsa";

export default function ContestPage() {
  const [attempts, setAttempts] = useState([]);

  // Fetch your history data here
  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch('/api/history'); // Adjust to your actual API route
      if (res.ok) {
        const data = await res.json();
        setAttempts(data);
      }
    }
    fetchHistory();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      {/* Pass the attempts prop here to satisfy TypeScript */}
      <ContestDsa attempts={attempts} />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-black font-mono">
      INITIATING_CORE_LINK...
    </div>
  );
}