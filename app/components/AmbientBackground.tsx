"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Particle {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  vx: number;
  vy: number;
  color: string;
  phase: number;
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Track mouse coordinates for gentle interactive repulsion/attraction
    let mouse = { x: -1000, y: -1000, radius: 120 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Particle color palette: subtle warm starlight, muted amber, and soft neutral grey
    const colors = [
      "237, 234, 227",   // Warm off-white
      "232, 163, 61",    // Warm amber micro-accent
      "168, 164, 155",   // Muted warm grey
    ];

    let particles: Particle[] = [];
    const PARTICLE_COUNT = Math.min(Math.floor((width * height) / 24000), 45);

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.6,
          baseAlpha: Math.random() * 0.45 + 0.15,
          alpha: Math.random() * 0.45 + 0.15,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -(Math.random() * 0.45 + 0.15), // Gently drift upwards like glowing embers
          color: colors[Math.floor(Math.random() * colors.length)],
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    initParticles();

    let lastTime = performance.now();

    function render(currentTime: number) {
      if (!ctx || !canvas) return;

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // Render glowing floating micro-particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.phase += delta * 1.2;
        p.alpha = p.baseAlpha + Math.sin(p.phase) * 0.18;
        if (p.alpha < 0.05) p.alpha = 0.05;

        // Position updates
        p.x += p.vx;
        p.y += p.vy;

        // Mouse avoidance/gentle swirl
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 1.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Screen wrap-around
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw particle with soft atmospheric glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.shadowBlur = p.size > 1.2 ? 8 : 4;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
    >
      {/* ─── Layer 1: Dark Silk Wave Image ───────────────────────────── */}
      <div className="absolute inset-0 bg-[#000000]">
        <Image
          src="/assets/bg-dark-wave.png"
          alt=""
          fill
          priority
          quality={95}
          className="object-cover object-center md:object-bottom opacity-60 md:opacity-75 transition-opacity duration-1000 scale-[1.02]"
        />
      </div>

      {/* ─── Layer 2: Subtle Ambient Warm Vignette ─────────────────────── */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[160px] opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(232, 163, 61, 0.12) 0%, transparent 70%)",
        }}
      />

      {/* ─── Layer 3: Protective Legibility Mask & Vignette ──────────── */}
      {/* This ensures code editors, text, terminals have ZERO contrast degradation */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.65) 0%, rgba(2, 2, 4, 0.25) 35%, rgba(2, 2, 4, 0.45) 70%, rgba(0, 0, 0, 0.85) 100%)",
        }}
      />

      {/* Radial Vignette to focus eyes on central content and code panes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 30%, transparent 35%, rgba(0, 0, 0, 0.75) 100%)",
        }}
      />

      {/* Subtle Micro-Dot Grid Mesh */}
      <div
        className="absolute inset-0 bg-dot-grid opacity-20"
        style={{
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 25%, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 25%, black 40%, transparent 85%)",
        }}
      />

      {/* ─── Layer 4: Interactive Floating Embers & Particle Canvas ───── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
      />
    </div>
  );
}
