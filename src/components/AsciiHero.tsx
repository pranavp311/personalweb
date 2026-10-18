"use client";

import Link from "next/link";
import { useEffect, useRef, useCallback, useState } from "react";
import { AsciiRenderer } from "@/lib/ascii-renderer";
import { ImageCycler } from "@/lib/image-cycler";
import DotField from "./DotField";
import Draggable from "./Draggable";
import { ClockWidget, GliderWidget } from "./HeroWidgets";
import { HaliteWidget } from "./HaliteWidget";
import ThemeToggle from "./ThemeToggle";
import styles from "./AsciiHero.module.css";

// focusY picks which part survives the crop on wide screens: 0 keeps the top, 0.5 (default) the middle.
const IMAGES = [
  { src: "/images/hero-1.jpg", focusY: 0 },
  { src: "/images/hero-2.webp" },
  { src: "/images/hero-3.jpg" },
  { src: "/images/hero-4.jpg" },
];

const FONT_SIZE = 6;
const LINE_HEIGHT = 1.2;
const LETTER_SPACING_EM = 0.12;
const LETTER_SPACING_PX = FONT_SIZE * LETTER_SPACING_EM;

export default function AsciiHero() {
  const screenRef = useRef<HTMLDivElement>(null);
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
      if (!mounted || !screenRef.current) return;

      const renderer = new AsciiRenderer(FONT_SIZE, LINE_HEIGHT, LETTER_SPACING_PX);
      const { width, height } = screenRef.current.getBoundingClientRect();
      renderer.computeGrid(width, height);

      const cycler = new ImageCycler(IMAGES, renderer, handleFrame);
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
        const screen = screenRef.current;
        if (!screen) return;
        const { width, height } = screen.getBoundingClientRect();
        cyclerRef.current?.handleResize(width, height);
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

  // The drag inset matches .frame, so dragged cards stay inside the frame line.
  return (
    <section className={styles.hero} data-drag-area="12">
      <DotField />
      <div className={styles.frame} aria-hidden="true" />

      <Draggable className={styles.window}>
        <div className={styles.titleBar} data-drag>
          {/* Menu bar for the hero; the site header stays hidden until the hero scrolls away. */}
          <div className={styles.menuBar}>
            <span>C0</span>
            <nav className={styles.menu} aria-label="Hero menu">
              <Link href="/blog">Blog</Link>
              <a href="/pranav-pappu-resume.pdf" target="_blank" rel="noopener noreferrer">
                Resume
              </a>
              <span data-cursor-label="THEME">
                <ThemeToggle />
              </span>
            </nav>
          </div>
          <span>PRANAV_PAPPU</span>
          <span />
        </div>
        <div
          ref={screenRef}
          className={styles.screen}
          data-cursor-label="NEXT"
          onClick={() => cyclerRef.current?.skipToNext()}
        >
          <pre
            ref={preRef}
            className={`ascii-hero__fade ${styles.ascii}`}
            style={{
              fontSize: `${FONT_SIZE}px`,
              lineHeight: LINE_HEIGHT,
              letterSpacing: `${LETTER_SPACING_EM}em`,
              opacity: loaded ? 1 : 0,
            }}
          />
        </div>
        <div className={styles.footer}>
          <h1 className={styles.name}>Pranav Pappu</h1>
          <p className={styles.role}>Builder / AI Researcher</p>
          <a href="#about" className={styles.scroll}>
            /scroll ↓
          </a>
        </div>
      </Draggable>

      <ClockWidget city="singapore" className={`${styles.widget} ${styles.clock}`} />
      <ClockWidget city="sanFrancisco" className={`${styles.widget} ${styles.sfClock}`} />
      <HaliteWidget className={`${styles.widget} ${styles.halitePos}`} />
      <GliderWidget className={`${styles.widget} ${styles.glider}`} />
    </section>
  );
}
