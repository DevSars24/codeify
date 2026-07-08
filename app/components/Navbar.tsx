"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Command, LogOut } from "lucide-react";
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
            {PUBLIC_LINKS.map(({ label, href }) => {
              if (!isSignedIn) {
                return (
                  <span
                    key={label}
                    className="text-sm text-muted-foreground/60 cursor-not-allowed select-none"
                  >
                    {label}
                  </span>
                );
              }
              return (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </SignedIn>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <SignedOut>
              <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign in
              </Link>
              <Button asChild size="sm" className="rounded-md h-8 px-4 text-xs font-medium">
                <Link href="/sign-up">Get started</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button asChild size="sm" variant="outline" className="h-8 px-3 text-xs">
                <Link href="/welcome">Dashboard</Link>
              </Button>
              <SignOutButton>
                <button className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                  <LogOut size={13} />
                  Logout
                </button>
              </SignOutButton>
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
            {PUBLIC_LINKS.map(({ label, href }) => {
              if (!isSignedIn) {
                return (
                  <span
                    key={label}
                    className="text-sm text-muted-foreground/60 cursor-not-allowed select-none py-1"
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
                  className="text-sm text-muted-foreground hover:text-foreground py-1"
                >
                  {label}
                </Link>
              );
            })}
            <div className="border-t border-border pt-3 flex flex-col gap-2">
              <SignedOut>
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground py-1"
                >
                  Sign in
                </Link>
                <Button asChild size="sm" className="w-full">
                  <Link href="/sign-up" onClick={() => setIsOpen(false)}>Get started</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                {PROTECTED_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground py-1"
                  >
                    {label}
                  </Link>
                ))}
                <SignOutButton>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-1 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </SignOutButton>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
