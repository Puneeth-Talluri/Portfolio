"use client";

import { useEffect, useRef } from "react";

/**
 * Pipeline Aurora-style ambient background (Codrops demo #5).
 * Renders a blurred, glowing particle pipeline on a full-screen canvas.
 * Sits behind all UI (z-index 0) and ignores pointer events.
 */
export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Math helpers and constants
    const TAU = Math.PI * 2;
    const HALF_PI = Math.PI / 2;
    const TO_RAD = Math.PI / 180;
    const rand = (n: number) => Math.random() * n;
    const round = Math.round;
    const cos = Math.cos;
    const sin = Math.sin;
    const fadeInOut = (life: number, ttl: number) => {
      // Smooth fade in/out over lifetime
      const t = life / ttl;
      return Math.sin(t * Math.PI);
    };

    // Config (mirrors pipeline.js)
    const RESET_MS = 10 * 60 * 1000; // 10 minutes
    // Density: keep previous behavior but lower number of pipes
    const pipeCount = 18;
    const pipePropCount = 8;
    const pipePropsLength = pipeCount * pipePropCount;
    const turnCount = 8;
    const turnAmount = (360 / turnCount) * TO_RAD;
    const turnChanceRange = 58;
    const baseSpeed = 0.5;
    const rangeSpeed = 1;
    const baseTTL = 100;
    const rangeTTL = 300;
    const baseWidth = 2;
    const rangeWidth = 4;
    const baseHue = 180;
    const rangeHue = 60;
    const backgroundColor = "hsla(150,80%,1%,1)";

    // Canvas setup
    const canvasA = document.createElement("canvas");
    const canvasB = document.createElement("canvas");
    canvasB.style.position = "fixed";
    canvasB.style.top = "0";
    canvasB.style.left = "0";
    canvasB.style.width = "100%";
    canvasB.style.height = "100%";
    canvasB.style.zIndex = "0";
    canvasB.style.pointerEvents = "none";
    container.appendChild(canvasB);

    const ctxA = canvasA.getContext("2d");
    const ctxB = canvasB.getContext("2d");
    if (!ctxA || !ctxB) {
      container.removeChild(canvasB);
      return;
    }

    const center: [number, number] = [0, 0];
    let tick = 0;
    let rafId = 0;
    let resetIntervalId = 0;
    let pipeProps = new Float32Array(pipePropsLength);

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      // Resize A, preserve B image briefly
      canvasA.width = innerWidth;
      canvasA.height = innerHeight;
      ctxA.drawImage(canvasB, 0, 0);
      // Resize B
      canvasB.width = innerWidth;
      canvasB.height = innerHeight;
      ctxB.drawImage(canvasA, 0, 0);
      center[0] = 0.5 * canvasA.width;
      center[1] = 0.5 * canvasA.height;
    };

    const initPipe = (i: number) => {
      const x = rand(canvasA.width);
      const y = center[1];
      const direction = round(rand(1)) ? HALF_PI : TAU - HALF_PI;
      const speed = baseSpeed + rand(rangeSpeed);
      const life = 0;
      const ttl = baseTTL + rand(rangeTTL);
      const width = baseWidth + rand(rangeWidth);
      const hue = baseHue + rand(rangeHue);
      pipeProps.set([x, y, direction, speed, life, ttl, width, hue], i);
    };

    const initPipes = () => {
      pipeProps = new Float32Array(pipePropsLength);
      for (let i = 0; i < pipePropsLength; i += pipePropCount) {
        initPipe(i);
      }
    };

    const resetAll = () => {
      ctxA.clearRect(0, 0, canvasA.width, canvasA.height);
      initPipes();
    };

    const drawPipe = (
      x: number,
      y: number,
      life: number,
      ttl: number,
      width: number,
      hue: number
    ) => {
      ctxA.save();
      ctxA.strokeStyle = `hsla(${hue},75%,50%,${fadeInOut(life, ttl) * 0.125})`;
      ctxA.beginPath();
      ctxA.arc(x, y, width, 0, TAU);
      ctxA.stroke();
      ctxA.closePath();
      ctxA.restore();
    };

    const checkBounds = (x: number, y: number) => {
      if (x > canvasA.width) return 0;
      if (x < 0) return canvasA.width;
      if (y > canvasA.height) return 0;
      if (y < 0) return canvasA.height;
      return null;
    };

    const updatePipe = (i: number) => {
      const i2 = i + 1;
      const i3 = i + 2;
      const i4 = i + 3;
      const i5 = i + 4;
      const i6 = i + 5;
      const i7 = i + 6;
      const i8 = i + 7;

      let x = pipeProps[i];
      let y = pipeProps[i2];
      let direction = pipeProps[i3];
      const speed = pipeProps[i4];
      let life = pipeProps[i5];
      const ttl = pipeProps[i6];
      const width = pipeProps[i7];
      const hue = pipeProps[i8];

      drawPipe(x, y, life, ttl, width, hue);

      life++;
      x += cos(direction) * speed;
      y += sin(direction) * speed;
      const turnChance = !(tick % round(rand(turnChanceRange))) &&
        (!(round(x) % 6) || !(round(y) % 6));
      const turnBias = round(rand(1)) ? -1 : 1;
      direction += turnChance ? turnAmount * turnBias : 0;

      // Wrap when out of bounds
      const xb = checkBounds(x, y);
      if (xb !== null) {
        if (x > canvasA.width) x = 0;
        if (x < 0) x = canvasA.width;
        if (y > canvasA.height) y = 0;
        if (y < 0) y = canvasA.height;
      }

      pipeProps[i] = x;
      pipeProps[i2] = y;
      pipeProps[i3] = direction;
      pipeProps[i5] = life;

      if (life > ttl) initPipe(i);
    };

    const updatePipes = () => {
      tick++;
      for (let i = 0; i < pipePropsLength; i += pipePropCount) {
        updatePipe(i);
      }
    };

    const render = () => {
      ctxB.save();
      ctxB.fillStyle = backgroundColor;
      ctxB.fillRect(0, 0, canvasB.width, canvasB.height);
      ctxB.restore();

      ctxB.save();
      ctxB.filter = "blur(12px)";
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();

      ctxB.save();
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();
    };

    const draw = () => {
      updatePipes();
      render();
      rafId = window.requestAnimationFrame(draw);
    };

    // Initialize
    resize();
    initPipes();
    draw();
    resetIntervalId = window.setInterval(resetAll, RESET_MS);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
      if (resetIntervalId) window.clearInterval(resetIntervalId);
      try {
        container.removeChild(canvasB);
      } catch {}
    };
  }, []);

  return <div className="content--canvas pointer-events-none" ref={containerRef} />;
}
