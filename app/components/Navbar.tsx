"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Command, LogOut, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { SignedIn, SignedOut, SignOutButton, UserButton, useUser } from "@clerk/nextjs";

const PUBLIC_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Blogs", href: "/blogs" },
];

const PROTECTED_LINKS = [
  { label: "Dashboard", href: "/welcome" },
  { label: "Mission Logs", href: "/history" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Sessions", href: "/sessions" },
];

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 py-3.5 px-4 sm:px-6 transition-all">
      <div className="mx-auto max-w-6xl">
        <div
          className={`flex items-center justify-between h-13 px-4 sm:px-5 rounded-xl border transition-all duration-300 ${
            scrolled
              ? "border-white/[0.09] bg-[#0c0c12]/85 backdrop-blur-xl shadow-2xl shadow-black/50"
              : "border-white/[0.05] bg-[#0c0c12]/60 backdrop-blur-md"
          }`}
        >
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg border border-white/[0.12] bg-white/[0.04] flex items-center justify-center transition-all duration-300 group-hover:border-white/[0.25] group-hover:bg-white/[0.08] shadow-xs">
              <Command size={14} className="text-foreground transition-transform group-hover:scale-105" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                CodeSaarthi
              </span>
              <span className="hidden sm:inline-flex text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.05] border border-white/[0.08] text-muted-foreground">
                v2
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {PUBLIC_LINKS.map(({ label, href }) => {
              if (!isSignedIn) {
                return (
                  <span
                    key={label}
                    className="px-3 py-1.5 text-xs font-medium text-muted-foreground/50 cursor-not-allowed select-none"
                  >
                    {label}
                  </span>
                );
              }
              return (
                <Link
                  key={label}
                  href={href}
                  className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/[0.04] transition-all"
                >
                  {label}
                </Link>
              );
            })}

            <SignedIn>
              {PROTECTED_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/[0.04] transition-all"
                >
                  {label}
                </Link>
              ))}
            </SignedIn>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <ThemeToggle />
            
            <SignedOut>
              <Link
                href="/sign-in"
                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="h-8 px-3.5 rounded-lg text-xs font-semibold bg-foreground text-background hover:opacity-90 inline-flex items-center justify-center transition-all shadow-xs"
              >
                Get started
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                href="/welcome"
                className="h-8 px-3 rounded-lg text-xs font-medium text-foreground border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] inline-flex items-center justify-center transition-all"
              >
                Dashboard
              </Link>
              <SignOutButton>
                <button
                  className="h-8 inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all cursor-pointer"
                  title="Sign out"
                >
                  <LogOut size={12} />
                  <span>Exit</span>
                </button>
              </SignOutButton>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 rounded-xl border border-white/[0.09] bg-[#0c0c12]/95 backdrop-blur-2xl p-4 flex flex-col gap-2.5 shadow-2xl">
            {PUBLIC_LINKS.map(({ label, href }) => {
              if (!isSignedIn) {
                return (
                  <span
                    key={label}
                    className="py-2 px-3 text-xs text-muted-foreground/50 cursor-not-allowed select-none"
                  >
                    {label}
                  </span>
                );
              }
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="py-2 px-3 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  {label}
                </Link>
              );
            })}

            <SignedIn>
              {PROTECTED_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="py-2 px-3 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </SignedIn>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <SignedOut>
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="h-8 px-3 rounded-lg text-xs font-semibold bg-foreground text-background inline-flex items-center"
                >
                  Get started
                </Link>
              </SignedOut>

              <SignedIn>
                <SignOutButton>
                  <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                    <LogOut size={13} />
                    <span>Sign out</span>
                  </button>
                </SignOutButton>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
