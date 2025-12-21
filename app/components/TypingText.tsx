"use client";

import { useEffect, useState } from "react";

type TypingTextProps = {
  text: string[];        // REQUIRED
  className?: string;
};

export default function TypingText({
  text,
  className = "",
}: TypingTextProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const currentWord = text[wordIndex];

    if (charIndex < currentWord.length) {
      const timeout = setTimeout(() => {
        setDisplay((prev) => prev + currentWord[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 80);

      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setDisplay("");
        setCharIndex(0);
        setWordIndex((prev) => (prev + 1) % text.length);
      }, 1500);

      return () => clearTimeout(pause);
    }
  }, [charIndex, wordIndex, text]);

  return (
    <span className={`text-purple-400 font-medium ${className}`}>
      {display}
      <span className="animate-pulse">|</span>
    </span>
  );
}
