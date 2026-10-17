"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { AsciiRenderer } from "@/lib/ascii-renderer";
import { ImageCycler } from "@/lib/image-cycler";
import DotField from "./DotField";
import { ClockWidget, GliderWidget } from "./HeroWidgets";
import { HaliteWidget } from "./HaliteWidget";
import styles from "./AsciiHero.module.css";

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

  return (
    <section className={styles.hero}>
      <DotField />
      <div className={styles.frame} aria-hidden="true" />

      <div className={styles.window}>
        <div className={styles.titleBar}>
          <span>C0</span>
          <span>PRANAV_PAPPU</span>
          <span />
        </div>
        <div
          ref={screenRef}
          className={styles.screen}
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
      </div>

      <ClockWidget className={`${styles.widget} ${styles.clock}`} />
      <HaliteWidget className={`${styles.widget} ${styles.halitePos}`} />
      <GliderWidget className={`${styles.widget} ${styles.glider}`} />
    </section>
  );
}
