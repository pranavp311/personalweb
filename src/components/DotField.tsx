"use client";

import { useEffect, useRef } from "react";

const CELL = 5;
const DOT = 2;
const FRAME_MS = 80;

// 8x8 Bayer matrix, normalised to 0..1 thresholds.
const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28,
  52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39,
  13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64);

// Slow drifting blobs: centre path as fractions of the canvas, radius as a fraction of its height.
const BLOBS = [
  { x: 0.18, y: 0.78, ax: 0.08, ay: 0.06, r: 0.42, speed: 0.00011, phase: 0 },
  { x: 0.84, y: 0.36, ax: 0.06, ay: 0.1, r: 0.38, speed: 0.00009, phase: 2.1 },
  { x: 0.55, y: 1.02, ax: 0.12, ay: 0.04, r: 0.34, speed: 0.00013, phase: 4.2 },
  { x: 0.42, y: 0.08, ax: 0.1, ay: 0.05, r: 0.22, speed: 0.00017, phase: 1.3 },
];

export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ink = 0;
    let width = 0;
    let height = 0;
    let image: ImageData | null = null;
    let pixels = new Uint32Array(0);
    let raf = 0;
    let last = 0;
    let visible = true;

    // Pack the CSS ink colour as a little-endian RGBA pixel.
    function readInk() {
      const [r, g, b] = (getComputedStyle(canvas!).color.match(/\d+/g) ?? ["0", "0", "0"]).map(Number);
      ink = ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
    }

    // One canvas pixel per CSS pixel; the canvas is scaled up with pixelated rendering.
    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas!.width = width;
      canvas!.height = height;
      image = ctx!.createImageData(width, height);
      pixels = new Uint32Array(image.data.buffer);
    }

    function draw(time: number) {
      if (!image) return;
      pixels.fill(0);
      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      const centres = BLOBS.map((b) => ({
        x: (b.x + b.ax * Math.sin(time * b.speed + b.phase)) * width,
        y: (b.y + b.ay * Math.cos(time * b.speed * 1.3 + b.phase)) * height,
        r2: (b.r * height) ** 2,
      }));
      for (let y = 0; y < rows; y++) {
        const py = y * CELL;
        for (let x = 0; x < cols; x++) {
          const px = x * CELL;
          let field = 0;
          for (const c of centres) {
            const dx = px - c.x;
            const dy = py - c.y;
            field += Math.exp(-(dx * dx + dy * dy) / c.r2);
          }
          // Sparse fixed scatter between the blobs.
          const scatter = ((Math.imul(x, 73856093) ^ Math.imul(y, 19349663)) >>> 0) % 997 < 9;
          if (!scatter && field * field <= BAYER[(y & 7) * 8 + (x & 7)]) continue;
          for (let dy = 0; dy < DOT && py + dy < height; dy++) {
            const row = (py + dy) * width;
            for (let dx = 0; dx < DOT && px + dx < width; dx++) pixels[row + px + dx] = ink;
          }
        }
      }
      ctx!.putImageData(image, 0, 0);
    }

    function loop(time: number) {
      if (visible && time - last >= FRAME_MS) {
        last = time;
        draw(time);
      }
      raf = requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(raf);
      if (motion.matches) draw(0);
      else raf = requestAnimationFrame(loop);
    }

    function handleResize() {
      resize();
      draw(performance.now());
    }

    function handleTheme() {
      readInk();
      draw(performance.now());
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    readInk();
    resize();
    start();
    observer.observe(canvas);
    window.addEventListener("resize", handleResize);
    window.addEventListener("themechange", handleTheme);
    motion.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("themechange", handleTheme);
      motion.removeEventListener("change", start);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        color: "var(--deck-ink)",
        imageRendering: "pixelated",
      }}
    />
  );
}
