"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Command, LogOut, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignOutButton, UserButton, useUser } from "@clerk/nextjs";

const PUBLIC_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "11-Lang Playground", href: "/home" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Developer", href: "/#developer" },
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
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 py-3 px-4 sm:px-6 transition-all">
      <div className="mx-auto max-w-6xl">
        <div
          className={`flex items-center justify-between h-13 px-4 sm:px-5 rounded-2xl border transition-all duration-300 ${
            scrolled
              ? "border-white/[0.14] bg-black/75 shadow-2xl shadow-black/90"
              : "border-white/[0.09] bg-black/55 shadow-xl shadow-black/60"
          }`}
          style={{
            backdropFilter: "blur(24px) saturate(190%)",
            WebkitBackdropFilter: "blur(24px) saturate(190%)",
            boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 16px 36px -10px rgba(0, 0, 0, 0.9)",
          }}
        >
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg border border-white/[0.1] bg-white/[0.04] backdrop-blur-md flex items-center justify-center transition-all duration-200 group-hover:border-white/[0.2]">
              <Command size={14} className="text-[#EDEAE3]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight text-[#EDEAE3]">
                CodeSaarthi
              </span>
              <span className="hidden sm:inline-flex text-[9px] px-1.5 py-0.2 rounded bg-white/[0.04] border border-white/[0.08] text-[#7C786F]">
                v2
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Clean sans, secondary color #7C786F) */}
          <nav className="hidden md:flex items-center gap-1">
            {!isSignedIn ? (
              PUBLIC_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="px-3 py-1.5 text-xs font-normal text-[#7C786F] hover:text-[#EDEAE3] rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  {label}
                </Link>
              ))
            ) : (
              PROTECTED_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="px-3 py-1.5 text-xs font-normal text-[#7C786F] hover:text-[#EDEAE3] rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  {label}
                </Link>
              ))
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] text-[#7C786F] bg-white/[0.03] border border-white/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D]" />
              Beta Free
            </span>

            <SignedOut>
              <Link
                href="/sign-in"
                className="px-3 py-1.5 text-xs font-normal text-[#7C786F] hover:text-[#EDEAE3] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="btn-primary h-8 px-3.5 text-xs font-semibold cursor-pointer"
              >
                Get started
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                href="/welcome"
                className="btn-secondary h-8 px-3 text-xs font-medium cursor-pointer"
              >
                Dashboard
              </Link>
              <SignOutButton>
                <button
                  className="h-8 inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-2.5 text-xs font-normal text-[#7C786F] hover:text-[#EDEAE3] hover:bg-white/[0.08] backdrop-blur-md transition-all duration-200 cursor-pointer"
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
            <button
              className="p-2 rounded-lg border border-white/[0.1] bg-white/[0.04] text-[#7C786F] hover:text-[#EDEAE3] backdrop-blur-md transition-colors"
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Touch friendly & responsive) */}
        {isOpen && (
          <div
            className="md:hidden mt-2 rounded-2xl border border-white/[0.1] bg-black/95 backdrop-blur-2xl p-4 flex flex-col gap-2 shadow-2xl shadow-black/80"
          >
            {!isSignedIn
              ? PUBLIC_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="py-2 px-3 text-sm text-[#7C786F] hover:text-[#EDEAE3] rounded-lg hover:bg-white/[0.04] transition-colors"
                  >
                    {label}
                  </Link>
                ))
              : null}

            <SignedIn>
              {PROTECTED_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="py-2 px-3 text-sm text-[#7C786F] hover:text-[#EDEAE3] rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </SignedIn>

            <div className="pt-3 mt-1 border-t border-white/[0.08] flex items-center justify-between">
              <SignedOut>
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-[#7C786F] hover:text-[#EDEAE3]"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary h-8 px-4 text-xs font-semibold inline-flex items-center"
                >
                  Get started
                </Link>
              </SignedOut>

              <SignedIn>
                <SignOutButton>
                  <button className="text-xs text-[#7C786F] hover:text-[#EDEAE3] flex items-center gap-1.5">
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
