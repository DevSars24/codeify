import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";
import AmbientBackground from "@/components/AmbientBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Code Saarthi - The AI-Powered Coding Platform",
  description: "Experience the next generation of coding with AI. Build, practice, and compete in a seamless browser environment.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="dark" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-black text-foreground antialiased relative selection:bg-emerald-500/20 selection:text-emerald-300`}>
          <AmbientBackground />
          <div className="relative z-1 flex flex-col min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

