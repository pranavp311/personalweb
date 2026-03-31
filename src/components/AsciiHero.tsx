"use client";

import { useEffect, useRef, useCallback } from "react";
import { AsciiRenderer } from "@/lib/ascii-renderer";
import { ImageCycler } from "@/lib/image-cycler";

const IMAGE_PATHS = [
  "/images/hero-1.jpg",
  "/images/hero-2.webp",
  "/images/hero-3.jpg",
  "/images/hero-4.png",
];

const FONT_SIZE = 8;
const LINE_HEIGHT = 1.2;
const LETTER_SPACING_EM = 0.12;
const LETTER_SPACING_PX = FONT_SIZE * LETTER_SPACING_EM;

const DOT_SPACING = 32;
const DOT_RADIUS = 3;
const DOT_BRIGHTNESS_THRESHOLD = 0.05; // hide dots above this brightness

export default function AsciiHero() {
  const preRef = useRef<HTMLPreElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cyclerRef = useRef<ImageCycler | null>(null);
  const rendererRef = useRef<AsciiRenderer | null>(null);

  const handleFrame = useCallback((ascii: string) => {
    if (preRef.current) {
      preRef.current.textContent = ascii;
    }

    // Redraw dot grid, hiding dots where ASCII brightness is high
    const canvas = canvasRef.current;
    const cycler = cyclerRef.current;
    const renderer = rendererRef.current;
    if (!canvas || !cycler || !renderer) return;

    const grid = cycler.currentGrid;
    if (!grid) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }

    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(180,180,180,0.15)";

    const cols = renderer.cols;
    const rows = renderer.rows;
    // Map from ASCII grid cells to pixel positions
    const cellW = w / cols;
    const cellH = h / rows;

    for (let dy = DOT_SPACING / 2; dy < h; dy += DOT_SPACING) {
      for (let dx = DOT_SPACING / 2; dx < w; dx += DOT_SPACING) {
        // Find which ASCII grid cell this dot falls in
        const gc = Math.floor(dx / cellW);
        const gr = Math.floor(dy / cellH);
        if (gc < cols && gr < rows) {
          const brightness = grid[gr * cols + gc];
          if (brightness > DOT_BRIGHTNESS_THRESHOLD) continue;
        }
        ctx.beginPath();
        ctx.arc(dx, dy, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      await document.fonts.ready;
      if (!mounted) return;

      const renderer = new AsciiRenderer(FONT_SIZE, LINE_HEIGHT, LETTER_SPACING_PX);
      rendererRef.current = renderer;

      const cycler = new ImageCycler(IMAGE_PATHS, renderer, handleFrame);
      cyclerRef.current = cycler;

      await cycler.start();
    }

    init();

    return () => {
      mounted = false;
      cyclerRef.current?.stop();
    };
  }, [handleFrame]);

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;

    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cyclerRef.current?.handleResize();
      }, 150);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <section
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#0a0a0a",
      }}
    >
      <pre
        ref={preRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "#0a0a0a",
          overflow: "hidden",
          pointerEvents: "none",
          userSelect: "none",
          color: "#ff6600",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: `${FONT_SIZE}px`,
          lineHeight: LINE_HEIGHT,
          letterSpacing: `${LETTER_SPACING_EM}em`,
          whiteSpace: "pre",
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Gradient backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.3) 50%, transparent 100%)",
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            fontFamily: 'var(--font-display), serif',
            fontWeight: 500,

            letterSpacing: "0.01em",
            color: "#d1d1d6",
            textShadow: "0 0 60px rgba(0,0,0,0.9), 0 0 120px rgba(0,0,0,0.6)",
          }}
        >
          Pranav Pappu
        </h1>
        <p
          style={{
            marginTop: 20,
            fontSize: "clamp(12px, 1.2vw, 15px)",
            fontWeight: 300,
            letterSpacing: "0.25em",
            textTransform: "uppercase" as const,
            color: "rgba(245,245,247,0.55)",
            textShadow: "0 0 40px rgba(0,0,0,0.9)",
          }}
        >
          Engineer &nbsp;/&nbsp; AI Researcher &nbsp;/&nbsp; Builder
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 300,
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: "rgba(245,245,247,0.3)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 32,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(to bottom, rgba(255,102,0,0.5), transparent)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  );
}
