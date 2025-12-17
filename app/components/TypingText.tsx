"use client";

import React from "react";

type TypingTextProps = {
  text: string;
  className?: string;
};

export default function TypingText({ text, className }: TypingTextProps) {
  // Simple version: just render the text for now.
  // You can later enhance this to show an actual typing animation.
  return <span className={className}>{text}</span>;
}
