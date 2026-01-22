import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Code Saarthi - The AI-Powered Coding Platform",
  description: "Experience the next generation of coding with AI. Build, practice, and compete in a seamless browser environment.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} min-h-screen bg-black text-white selection:bg-purple-500/30 selection:text-purple-200 antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

