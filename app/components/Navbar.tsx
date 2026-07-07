"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Command } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import ThemeToggle from "@/components/ThemeToggle";
import { prefersReducedMotion } from "@/lib/motion";

const SignedIn = ({ children }: { children: React.ReactNode }) => null;
const SignedOut = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const UserButton = () => null;
const SignInButton = ({ children }: { children: React.ReactNode; mode?: string }) => <>{children}</>;
const SignUpButton = ({ children }: { children: React.ReactNode; mode?: string }) => <>{children}</>;

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Blogs", href: "/blogs" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Sessions", href: "/sessions" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current || prefersReducedMotion()) return;
    gsap.to(navRef.current, {
      backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0)",
      borderColor: scrolled ? "rgba(226,232,240,1)" : "rgba(226,232,240,0)",
      boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.06)" : "0 0 0 rgba(0,0,0,0)",
      duration: 0.3,
      ease: "power2.out",
    });
  }, [scrolled]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 py-4">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          ref={navRef}
          className={`dark:bg-background/90 flex items-center justify-between h-12 px-5 rounded-lg border transition-colors ${
            scrolled ? "border-border" : "border-transparent"
          }`}
        >
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <Command size={14} className="text-primary" />
            </div>
            <span className="text-sm font-semibold tracking-tight">codesaarthi</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <SignedOut>
              <SignInButton mode="modal">
                <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sign in
                </Link>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="rounded-md h-8 px-4 text-xs font-medium">
                  Get started
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-2 rounded-lg border border-border bg-card p-4 flex flex-col gap-3 shadow-sm">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setIsOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground py-1"
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-border pt-3 flex flex-col gap-2">
              <Link href="/sign-in" className="text-sm text-muted-foreground">Sign in</Link>
              <Button size="sm" className="w-full">Get started</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
