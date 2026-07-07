"use client";

import { Sun, Moon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    if (iconRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        iconRef.current,
        { rotate: 0, opacity: 0.5 },
        { rotate: 180, opacity: 1, duration: 0.25, ease: "power2.inOut" }
      );
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <span ref={iconRef} className="inline-flex">
        {theme === "light" ? (
          <Moon size={15} className="text-muted-foreground" />
        ) : (
          <Sun size={15} className="text-amber-500" />
        )}
      </span>
    </button>
  );
}
