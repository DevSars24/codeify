"use client";

import gsap from "gsap";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function animateCountUp(
  element: HTMLElement,
  endValue: number,
  options?: { duration?: number; suffix?: string; prefix?: string }
) {
  const { duration = 0.8, suffix = "", prefix = "" } = options ?? {};
  const reduced = prefersReducedMotion();

  if (reduced) {
    element.textContent = `${prefix}${endValue}${suffix}`;
    return;
  }

  const obj = { value: 0 };
  gsap.to(obj, {
    value: endValue,
    duration,
    ease: "power2.out",
    snap: { value: 1 },
    onUpdate: () => {
      element.textContent = `${prefix}${Math.round(obj.value)}${suffix}`;
    },
  });
}

export function pressFeedback(element: HTMLElement, success: boolean) {
  if (prefersReducedMotion()) return;

  gsap.fromTo(
    element,
    { scale: 1, backgroundColor: success ? "#ecfdf5" : "#fef2f2" },
    {
      scale: success ? 1.01 : 0.99,
      duration: 0.2,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      backgroundColor: "transparent",
    }
  );
}

export const gsapDefaults = {
  ease: "power2.out" as const,
  duration: 0.35,
};
