"use client";

import { Sun, Moon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;

    if (iconRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        iconRef.current,
        { rotate: -90, scale: 0.75, opacity: 0 },
        { rotate: 0, scale: 1, opacity: 1, duration: 0.28, ease: "power2.out" }
      );
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="h-9 w-9 rounded-md border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer flex items-center justify-center"
      aria-label="Toggle theme"
      title={theme === "light" ? "Switch to black theme" : "Switch to white theme"}
    >
      <span ref={iconRef} className="inline-flex">
        {theme === "light" ? (
          <Moon size={15} className="text-muted-foreground" />
        ) : (
          <Sun size={15} className="text-foreground" />
        )}
      </span>
    </button>
  );
}
