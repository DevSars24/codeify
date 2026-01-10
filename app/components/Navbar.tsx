"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-3 rounded-2xl border border-zinc-800 bg-black/70 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-6">

            {/* LEFT — Brand */}
            <Link
              href="/"
              className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Code Saarthi
            </Link>

            {/* RIGHT — Nav + Auth */}
            <div className="flex items-center gap-6">
              
              {/* LOGGED IN LINKS */}
              <SignedIn>
                <Link 
                  href="/history" 
                  className="text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-[0.2em] transition-colors"
                >
                  Mission Logs
                </Link>
                <div className="h-4 w-[1px] bg-white/10" />
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              {/* LOGGED OUT */}
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button variant="ghost" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest">
                    Login
                  </Button>
                </SignUpButton>
                <SignUpButton mode="modal">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-xs font-bold uppercase tracking-widest rounded-xl px-6">
                    Join Arena
                  </Button>
                </SignUpButton>
              </SignedOut>

            </div>

          </div>
        </div>
      </div>
    </header>
  );
}