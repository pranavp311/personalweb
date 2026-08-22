"use client";

import Link from "next/link";
import { useEffect, useRef, useCallback, useState } from "react";
import { AsciiRenderer } from "@/lib/ascii-renderer";
import { ImageCycler } from "@/lib/image-cycler";
import blogLinkStyles from "./HeroBlogLink.module.css";

const IMAGE_PATHS = [
  "/images/hero-1.jpg",
  "/images/hero-2.webp",
  "/images/hero-3.jpg",
  "/images/hero-4.jpg",
];

const FONT_SIZE = 6;
const LINE_HEIGHT = 1.2;
const LETTER_SPACING_EM = 0.12;
const LETTER_SPACING_PX = FONT_SIZE * LETTER_SPACING_EM;

const BACKGROUND_ARROWS = [
  { x: "3%", y: "9%", glyph: "→" },
  { x: "31%", y: "14%", glyph: "↓" },
  { x: "68%", y: "8%", glyph: "↑" },
  { x: "96%", y: "13%", glyph: "←" },
  { x: "6%", y: "45%", glyph: "↑" },
  { x: "36%", y: "40%", glyph: "←" },
  { x: "72%", y: "52%", glyph: "→" },
  { x: "94%", y: "43%", glyph: "↓" },
  { x: "3%", y: "88%", glyph: "→" },
  { x: "32%", y: "93%", glyph: "↓" },
  { x: "67%", y: "86%", glyph: "↑" },
  { x: "97%", y: "91%", glyph: "←" },
] as const;

export default function AsciiHero() {
  const preRef = useRef<HTMLPreElement>(null);
  const cyclerRef = useRef<ImageCycler | null>(null);
  const [loaded, setLoaded] = useState(false);
  const hasSignaledLoad = useRef(false);

  const handleFrame = useCallback((ascii: string) => {
    if (preRef.current) {
      preRef.current.textContent = ascii;
    }

    if (!hasSignaledLoad.current) {
      hasSignaledLoad.current = true;
      requestAnimationFrame(() => setLoaded(true));
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    function handleMotionPreference(event: MediaQueryListEvent) {
      cyclerRef.current?.setAnimating(!event.matches);
    }

    motionPreference.addEventListener("change", handleMotionPreference);

    async function init() {
      await document.fonts.ready;
      if (!mounted) return;

      const renderer = new AsciiRenderer(FONT_SIZE, LINE_HEIGHT, LETTER_SPACING_PX);

      const cycler = new ImageCycler(IMAGE_PATHS, renderer, handleFrame);
      const isLight = document.documentElement.dataset.theme === "light";
      cycler.setInverted(isLight);
      cyclerRef.current = cycler;

      await cycler.start(!motionPreference.matches);
    }

    init();

    return () => {
      mounted = false;
      motionPreference.removeEventListener("change", handleMotionPreference);
      cyclerRef.current?.stop();
    };
  }, [handleFrame]);

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;

    function handleThemeChange() {
      const isLight = document.documentElement.dataset.theme === "light";
      cyclerRef.current?.setInverted(isLight);
    }

    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cyclerRef.current?.handleResize();
      }, 150);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("themechange", handleThemeChange);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("themechange", handleThemeChange);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <section
      onClick={() => cyclerRef.current?.skipToNext()}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "var(--color-canvas)",
        cursor: "default",
      }}
    >
      <Link
        href="/blog"
        className={blogLinkStyles.link}
        onClick={(event) => event.stopPropagation()}
      >
        Blog
      </Link>

      <pre
        ref={preRef}
        className="ascii-hero__fade"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "var(--color-canvas)",
          overflow: "hidden",
          pointerEvents: "none",
          userSelect: "none",
          color: "var(--color-hero-ascii)",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: `${FONT_SIZE}px`,
          fontWeight: "var(--font-weight-hero-ascii)",
          lineHeight: LINE_HEIGHT,
          letterSpacing: `${LETTER_SPACING_EM}em`,
          whiteSpace: "pre",
          opacity: loaded ? 1 : 0,
          transition: "opacity 1.2s ease-in",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          color: "var(--color-hero-arrow)",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 15,
          fontWeight: 400,
          opacity: loaded ? 1 : 0,
          transition: "opacity 1.2s ease-in",
        }}
      >
        {BACKGROUND_ARROWS.map(({ x, y, glyph }) => (
          <span
            key={`${x}-${y}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
            }}
          >
            {glyph}
          </span>
        ))}
      </div>

      {/* Gradient backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          pointerEvents: "none",
          background: "var(--gradient-hero-vignette)",
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
            color: "var(--color-text-display)",
            textShadow: "var(--shadow-hero-title)",
          }}
        >
          Pranav Pappu
        </h1>
        <p
          style={{
            marginTop: 20,
            fontSize: "clamp(12px, 1.2vw, 15px)",
            fontWeight: "var(--font-weight-hero-subtitle)",
            letterSpacing: "var(--letter-spacing-hero-subtitle)",
            textTransform: "uppercase" as const,
            color: "var(--color-hero-subtitle)",
            textShadow: "var(--shadow-hero-subtitle)",
          }}
        >
          Builder &nbsp;/&nbsp; AI Researcher
        </p>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="ascii-hero__scroll-indicator"
        onClick={(event) => event.stopPropagation()}
        aria-label="Scroll to About"
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
          textDecoration: "none",
          textShadow: "var(--shadow-hero-scroll)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: "var(--font-weight-hero-scroll)",
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: "var(--color-hero-scroll)",
          }}
        >
          Scroll
        </span>
        <span
          className="ascii-hero__scroll-arrow"
          aria-hidden="true"
          style={{
            color: "var(--color-hero-scroll-arrow)",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ↓
        </span>
      </a>
    </section>
  );
}
