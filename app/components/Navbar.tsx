"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const { user } = useUser();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-3 rounded-2xl border border-zinc-800 bg-black/70 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-6">

            {/* Brand */}
            <Link
              href="/"
              className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Code Saarthi
            </Link>

            {/* LOGGED OUT */}
            <SignedOut>
              <div className="flex gap-3">
          
                <SignUpButton mode="modal">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>

            {/* LOGGED IN */}
            <SignedIn>
              <div className="flex items-center gap-6">
                <div className="hidden md:block text-sm text-right">
                  <p className="text-zinc-400">Welcome to Saarthi</p>
                  <p className="font-medium text-purple-400">
                    {user?.firstName}
                  </p>
                </div>

                <Link href="/home">
                  <Badge variant="secondary" className="cursor-pointer">
                    Dashboard
                  </Badge>
                </Link>

                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

          </div>
        </div>
      </div>
    </header>
  );
}
