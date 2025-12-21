"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user } = useUser();

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

             

              {/* LOGGED OUT */}
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>

              {/* LOGGED IN */}
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
