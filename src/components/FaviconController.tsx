"use client";

import { useEffect } from "react";

import type { Theme } from "@/lib/theme-preference";

type FaviconControllerProps = {
  colors: Record<Theme, string>;
  duration: number;
  lobePath: string;
};

const START_PROGRESS = 0.12;

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function ease(value: number) {
  return 1 - Math.pow(1 - value, 4);
}

function scaleAroundCenter(scale: number) {
  return `translate(60 60) scale(${scale}) translate(-60 -60)`;
}

function faviconUri(
  theme: Theme,
  progress: number,
  colors: Record<Theme, string>,
  lobePath: string,
) {
  const color = colors[theme];
  const visibleProgress = START_PROGRESS + progress * (1 - START_PROGRESS);
  const lobes = [0, 1, 2]
    .map((index) => {
      const local = ease(clamp((visibleProgress - index * 0.11) / 0.68));
      if (local === 0) return "";

      const rotation = index * 120 - (1 - local) * 16;
      return `<g transform="rotate(${rotation} 60 60)"><path d="${lobePath}" fill="${color}" opacity="${clamp(local * 1.7)}" transform="${scaleAroundCenter(local)}"/></g>`;
    })
    .join("");
  const seed = ease(clamp(visibleProgress / 0.48));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${lobes}<circle cx="60" cy="60" r="9" fill="${color}" transform="${scaleAroundCenter(seed)}"/></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function updateFavicon(href: string) {
  let favicon = document.getElementById("site-favicon") as HTMLLinkElement | null;

  if (!favicon) {
    favicon = document.createElement("link");
    favicon.id = "site-favicon";
    favicon.rel = "icon";
    document.head.append(favicon);
  }

  favicon.type = "image/svg+xml";
  favicon.href = href;
}

export default function FaviconController({
  colors,
  duration,
  lobePath,
}: FaviconControllerProps) {
  useEffect(() => {
    let animationFrame = 0;
    let startTimer = 0;
    let disposed = false;

    const currentTheme = (): Theme =>
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const showFrame = (theme: Theme, progress: number) =>
      updateFavicon(faviconUri(theme, progress, colors, lobePath));

    function playAnimation() {
      window.cancelAnimationFrame(animationFrame);
      if (disposed) return;

      const theme = currentTheme();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        showFrame(theme, 1);
        return;
      }

      const startedAt = performance.now();
      const draw = (now: number) => {
        if (disposed) return;

        const progress = clamp((now - startedAt) / duration);
        showFrame(theme, progress);

        if (progress < 1) animationFrame = requestAnimationFrame(draw);
        else showFrame(theme, 1);
      };

      animationFrame = requestAnimationFrame(draw);
    }

    function scheduleInitialAnimation() {
      if (disposed) return;
      startTimer = window.setTimeout(playAnimation, 200);
    }

    function handleThemeChange() {
      window.clearTimeout(startTimer);
      playAnimation();
    }

    if (document.readyState === "complete") scheduleInitialAnimation();
    else
      window.addEventListener("load", scheduleInitialAnimation, { once: true });
    window.addEventListener("themechange", handleThemeChange);

    return () => {
      disposed = true;
      window.clearTimeout(startTimer);
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("load", scheduleInitialAnimation);
      window.removeEventListener("themechange", handleThemeChange);
    };
  }, [colors, duration, lobePath]);

  return null;
}
