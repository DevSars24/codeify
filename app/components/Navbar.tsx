"use client";

import Link from "next/link";
import { Menu, X, Command, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { SignedIn, SignedOut, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const PUBLIC_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Playground", href: "/home" },
  { label: "Blogs", href: "/blogs" },
  { label: "Leaderboard", href: "/leaderboard" },
];

const PROTECTED_LINKS = [
  { label: "DSA Arena", href: "/dsa" },
  { label: "Dev Lab", href: "/dev" },
  { label: "Playground", href: "/home" },
  { label: "Sessions", href: "/sessions" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Blogs", href: "/blogs" },
  { label: "Mission Logs", href: "/history" },
];

export default function Navbar() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = isSignedIn ? PROTECTED_LINKS : PUBLIC_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 py-3 px-4 sm:px-6 transition-all">
      <div className="mx-auto max-w-7xl">
        <div
          className={`flex items-center justify-between h-13 px-4 sm:px-5 rounded-2xl border transition-all duration-300 ${
            scrolled
              ? "border-white/[0.16] bg-[#171a18]/80 shadow-xl shadow-black/35"
              : "border-white/[0.12] bg-[#171a18]/65 shadow-lg shadow-black/25"
          }`}
          style={{
            backdropFilter: "blur(24px) saturate(145%)",
            WebkitBackdropFilter: "blur(24px) saturate(145%)",
            boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 16px 36px -10px rgba(0, 0, 0, 0.42)",
          }}
        >
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.15] bg-white/[0.055] text-[#c9d0be] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md transition-all duration-300 group-hover:border-white/[0.25] group-hover:bg-white/[0.1]">
              <Command size={14} className="transition-transform group-hover:scale-105" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                CodeSaarthi
              </span>
              <span className="hidden sm:inline-flex text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] border border-white/[0.08] text-muted-foreground">
                v2
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ label, href }) => {
              const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={label}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 ${
                    active
                      ? "border border-white/[0.12] bg-white/[0.075] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]"
                      : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <ThemeToggle />
            
            <SignedOut>
              <Link
                href="/sign-in"
                className="rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-9 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.08] px-4 text-xs font-semibold text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-all hover:bg-white/[0.13]"
              >
                Get started
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                href="/welcome"
                className="inline-flex h-9 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.07] px-4 text-xs font-medium text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md transition-all duration-200 hover:bg-white/[0.12]"
                style={{
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                Dashboard
              </Link>
              <SignOutButton>
                <button
                  className="h-8 inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.08] backdrop-blur-md transition-all duration-200 cursor-pointer"
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
              className="rounded-full border border-white/[0.12] bg-white/[0.05] p-2 text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-colors hover:text-foreground"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div
            className="mt-2 flex flex-col gap-1.5 rounded-2xl border border-white/[0.14] bg-[#171a18]/90 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl md:hidden"
          >
            {links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  pathname === href || pathname.startsWith(`${href}/`)
                    ? "bg-white/[0.08] text-foreground"
                    : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="mt-1 flex items-center justify-between border-t border-white/[0.09] pt-3">
              <SignedOut>
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full px-3 py-2 text-xs text-muted-foreground transition hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground"
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
