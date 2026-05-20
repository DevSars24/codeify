"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Command } from "lucide-react";
import { useState, useEffect } from "react";

// Mock Clerk for demo — no keys needed
const SignedIn   = ({ children }: { children: React.ReactNode }) => null;
const SignedOut  = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const UserButton = () => null;
const SignInButton = ({ children, mode }: { children: React.ReactNode; mode?: string }) => <>{children}</>;
const SignUpButton = ({ children, mode }: { children: React.ReactNode; mode?: string }) => <>{children}</>;

const NAV_LINKS = [
  { label: "Features",      href: "#features"     },
  { label: "Blogs",         href: "/blogs"        },
  { label: "Leaderboard",   href: "/leaderboard"  },
  { label: "Live Sessions", href: "/live-sessions" },
];

export default function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`rounded-full flex items-center justify-between h-14 px-6 transition-all duration-500 ${
            scrolled
              ? "bg-[#0a0f1d]/70 backdrop-blur-2xl shadow-xl"
              : "bg-transparent"
          }`}
          style={{ boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.6)" : "none" }}
        >
          {/* ── GenZ Minimalist Brand ── */}
          <Link href="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-300 group-hover:scale-90 group-hover:rotate-12">
              <Command size={16} strokeWidth={3} />
            </div>
            <span className="text-xl font-extrabold tracking-tighter text-white lowercase">
              codesaarthi<span className="text-indigo-500">.</span>
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 hover:text-white transition-colors duration-300 relative group"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-indigo-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* ── Auth CTA (desktop) ── */}
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="h-9 px-6 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-wide shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all">
                  Get Access
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* ── Hamburger ── */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 glass rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: "rgba(8,10,18,0.92)" }}
            >
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
              <div className="h-px bg-white/5" />
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 hover:text-white">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full h-11 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
                    Get Access
                  </Button>
                </SignUpButton>
              </SignedOut>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
