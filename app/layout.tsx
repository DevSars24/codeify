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
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    const theme = localStorage.getItem('theme');
                    if (theme === 'dark') {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } catch (e) {}
                })();
              `
            }}
          />
        </head>
        <body className={`${inter.className} min-h-screen bg-background text-foreground selection:bg-[#7C6FE0]/30 selection:text-[#F0F0F8] antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

