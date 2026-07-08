"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Command } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 py-4">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between h-12 px-4 sm:px-5 rounded-md border backdrop-blur-md transition-colors ${
            scrolled ? "border-border bg-background/92" : "border-transparent bg-background/70"
          }`}
        >
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md border border-border bg-muted flex items-center justify-center">
              <Command size={14} className="text-primary" />
            </div>
            <span className="text-sm font-semibold tracking-tight">CodeSaarthi</span>
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
          <div className="md:hidden mt-2 rounded-md border border-border bg-card p-4 flex flex-col gap-3">
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
