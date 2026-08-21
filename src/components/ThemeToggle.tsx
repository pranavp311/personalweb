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
    <button type="button" className="theme-toggle" onClick={toggleTheme}>
      <span className="theme-toggle__light">
        <svg
          aria-hidden="true"
          className="theme-toggle__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.55"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3.75" />
          <path d="M12 2.25v2M12 19.75v2M21.75 12h-2M4.25 12h-2M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4M18.9 18.9l-1.4-1.4M6.5 6.5 5.1 5.1" />
        </svg>
        <span className="sr-only">Use light theme</span>
      </span>
      <span className="theme-toggle__dark">
        <svg
          aria-hidden="true"
          className="theme-toggle__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.55"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.15 15.2A8.45 8.45 0 0 1 8.8 3.85a8.45 8.45 0 1 0 11.35 11.35Z" />
        </svg>
        <span className="sr-only">Use dark theme</span>
      </span>
    </button>
  );
}
