"use client";

import { useEffect, useState } from "react";

type CounterProps = {
  value: number;
  label: string;
};

export default function Counter({ value, label }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = Math.ceil(value / (duration / 16));

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-purple-400">{count}+</p>
      <p className="text-sm text-zinc-400 mt-1">{label}</p>
    </div>
  );
}

