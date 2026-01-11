"use client";

import { useEffect, useRef } from "react";

type LoadingOverlayProps = {
  visible?: boolean;
};

/**
 * Matrix effect loading overlay.
 * Renders a full-screen canvas with falling 0/1 strips until the avatar loads.
 */
export default function LoadingOverlay({ visible = true }: LoadingOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    const setSize = () => {
      // Set drawing buffer to device pixels for crisp text
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    // Use standard compositing to avoid GPU-heavy blending
    ctx.globalCompositeOperation = "source-over";
    // Hoist baseline/alignment; avoid resetting inside inner loops
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    const glyphs = "アァカガサザタダナハバパマヤャラワン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    // Canonical Matrix effect: grid columns by fontSize and per-column row indices
    const fgColor = "#94f475";
    const fadeAlpha = 0.05; // typical trail fade used in canonical demos
    let fontSize = Math.floor(Math.max(14, Math.min(22, window.innerWidth / 90)));
    let columns = Math.max(60, Math.floor(window.innerWidth / fontSize));
    let drops: number[] = new Array(columns);
    const initColumns = () => {
      fontSize = Math.floor(Math.max(14, Math.min(22, window.innerWidth / 90)));
      columns = Math.max(60, Math.floor(window.innerWidth / fontSize));
      drops = new Array(columns);
      for (let i = 0; i < columns; i++) {
        drops[i] = 1 + Math.floor(Math.random() * 20); // slight desync across columns
      }
    };
    initColumns();

    // Use requestAnimationFrame for smoother motion
    let rafId: number | null = null;
    let lastTime = performance.now();

    // Column glyph draw (one glyph per column)
    const drawGlyph = (x: number, y: number) => {
      const randChar = glyphs[(Math.random() * glyphs.length) | 0];
      ctx.fillStyle = fgColor;
      ctx.fillText(randChar, x, y);
    };

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      const now = performance.now();
      lastTime = now;

      // Fade previous frame slightly to create trails without clearing everything
      ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Fixed font for the frame
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        drawGlyph(x, y);

        // Reset drop after it goes beyond the screen with randomness
        if (y > window.innerHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    loop();

    const onResize = () => {
      setSize();
      initColumns();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[999] bg-black transition-opacity duration-1000 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
