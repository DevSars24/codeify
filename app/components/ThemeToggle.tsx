"use client";

import { Sun, Moon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const active = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    if (active !== theme) {
      setTheme(active);
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;

    if (iconRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        iconRef.current,
        { rotate: -90, scale: 0.75, opacity: 0 },
        { rotate: 0, scale: 1, opacity: 1, duration: 0.25, ease: "power2.out" }
      );
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="h-8 w-8 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-foreground transition-all duration-200 cursor-pointer flex items-center justify-center shadow-xs"
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light theme" : "Switch to obsidian black theme"}
    >
      <span ref={iconRef} className="inline-flex">
        {theme === "dark" ? <Sun size={14} className="text-amber-400/90" /> : <Moon size={14} className="text-indigo-400" />}
      </span>
    </button>
  );
}
