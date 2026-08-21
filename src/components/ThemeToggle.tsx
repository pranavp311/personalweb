"use client";

import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme-preference";

export default function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const nextTheme: Theme = root.dataset.theme === "light" ? "dark" : "light";

    root.dataset.theme = nextTheme;
    window.dispatchEvent(new Event("themechange"));

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The active page still switches theme when storage is unavailable.
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
    >
      <span className="theme-toggle__light">
        <span className="sr-only">Use </span>
        Light
        <span className="sr-only"> theme</span>
      </span>
      <span className="theme-toggle__dark">
        <span className="sr-only">Use </span>
        Dark
        <span className="sr-only"> theme</span>
      </span>
    </button>
  );
}
