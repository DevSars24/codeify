import "./globals.css";

export const metadata = {
  title: "Code Saarthi",
  description: "AI Code Review & Mentor",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white">
        {children}
      </body>
    </html>
  );
}
