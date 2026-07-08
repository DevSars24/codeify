"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

type TypingTextProps = {
  text: string[];
  className?: string;
};

export default function TypingText({ text, className = "" }: TypingTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    const cursor = cursorRef.current;
    if (!el || !cursor || text.length === 0) return;

    if (prefersReducedMotion()) {
      el.textContent = text[0];
      return;
    }

    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.35 });

    text.forEach((line) => {
      const proxy = { chars: 0 };
      timeline.call(() => {
        el.textContent = "";
        proxy.chars = 0;
      });
      timeline.to(proxy, {
        chars: line.length,
        duration: Math.min(1.2, line.length * 0.035),
        ease: "none",
        onUpdate() {
          el.textContent = line.slice(0, Math.round(proxy.chars));
        },
      });
      timeline.to({}, { duration: 0.8 });
    });

    gsap.to(cursor, { opacity: 0, duration: 0.45, repeat: -1, yoyo: true, ease: "steps(1)" });

    return () => {
      timeline.kill();
      gsap.killTweensOf(cursor);
    };
  }, [text]);

  return (
    <span className={`font-mono text-foreground ${className}`}>
      <span ref={textRef} />
      <span ref={cursorRef} className="ml-1 inline-block h-[1em] w-[7px] translate-y-0.5 bg-foreground" />
    </span>
  );
}
