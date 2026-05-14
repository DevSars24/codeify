"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignUpButton,
  SignInButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <nav className="glass-card rounded-2xl flex items-center justify-between h-16 px-6 relative">

          {/* Brand */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white hover:text-purple-300 transition-colors flex items-center gap-2"
          >
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs">CS</span>
            <span>CodeSaarthi</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/blogs" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Blogs
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Leaderboard
            </Link>
            <Link href="/sessions" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Live Sessions
            </Link>

            <SignedIn>
              <Link
                href="/history"
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Mission Logs
              </Link>
              <div className="h-5 w-[1px] bg-zinc-800" />
              <UserButton afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 ring-2 ring-purple-500/20 hover:ring-purple-500 transition-all",
                  }
                }}
              />
            </SignedIn>

            <SignedOut>
              <div className="flex items-center gap-4">
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-white text-black hover:bg-zinc-200 text-sm font-semibold rounded-lg px-5 h-9">
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Mobile Nav */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-4 glass-card rounded-2xl flex flex-col gap-4 md:hidden animate-fade-in-up">
              <Link href="#features" className="text-sm font-medium text-zinc-400 hover:text-white p-2" onClick={() => setIsOpen(false)}>
                Features
              </Link>
              <Link href="/blogs" className="text-sm font-medium text-zinc-400 hover:text-white p-2" onClick={() => setIsOpen(false)}>
                Blogs
              </Link>
              <Link href="/leaderboard" className="text-sm font-medium text-zinc-400 hover:text-white p-2" onClick={() => setIsOpen(false)}>
                Leaderboard
              </Link>
              <Link href="/sessions" className="text-sm font-medium text-zinc-400 hover:text-white p-2" onClick={() => setIsOpen(false)}>
                Live Sessions
              </Link>
              <SignedIn>
                <Link href="/history" className="text-sm font-medium text-zinc-400 hover:text-white p-2" onClick={() => setIsOpen(false)}>
                  Mission Logs
                </Link>
                <div className="p-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full text-left text-sm font-medium text-zinc-400 hover:text-white p-2">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full bg-white text-black hover:bg-zinc-200">
                    Get Started
                  </Button>
                </SignUpButton>
              </SignedOut>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}