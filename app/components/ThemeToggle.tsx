"use client";

import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

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
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-border bg-card hover:bg-secondary text-foreground transition-all duration-200 cursor-pointer flex items-center justify-center shadow-sm"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon size={16} className="text-zinc-600 dark:text-zinc-400" />
      ) : (
        <Sun size={16} className="text-yellow-500" />
      )}
    </button>
  );
}
