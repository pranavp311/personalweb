import "server-only";

import { DEFAULT_THEME, type Theme } from "./theme-preference";

const darkTheme = {
  "--color-scheme": "dark",
  "--color-canvas": "#0a0a0a",
  "--color-text-primary": "#f5f5f7",
  "--color-text-display": "#d1d1d6",
  "--color-text-secondary": "#98989d",
  "--color-text-muted": "#8e8e93",
  "--color-accent": "#ff6600",
  "--color-hero-ascii": "var(--color-accent)",
  "--font-weight-hero-ascii": "400",
  "--color-accent-link": "#ff8a3d",
  "--color-success": "#4ade80",
  "--color-selection-background": "rgb(255 102 0 / 25%)",
  "--color-selection-text": "#ffffff",
  "--color-accent-rule": "rgb(255 102 0 / 40%)",
  "--color-accent-border": "rgb(255 102 0 / 15%)",
  "--color-accent-divider": "rgb(255 102 0 / 12%)",
  "--color-accent-divider-soft": "rgb(255 102 0 / 8%)",
  "--color-accent-scroll": "rgb(255 102 0 / 50%)",
  "--color-border": "rgb(255 255 255 / 4%)",
  "--color-border-portrait": "rgb(255 255 255 / 6%)",
  "--color-project-index": "rgb(255 255 255 / 5%)",
  "--color-hero-arrow": "rgb(255 255 255 / 26%)",
  "--color-hero-subtitle": "rgb(245 245 247 / 55%)",
  "--font-weight-hero-subtitle": "300",
  "--letter-spacing-hero-subtitle": "0.25em",
  "--color-hero-scroll": "#8e8e93",
  "--color-toggle-surface": "rgb(10 10 10 / 72%)",
  "--color-toggle-hover": "rgb(245 245 247 / 8%)",
  "--color-toggle-border": "rgb(245 245 247 / 20%)",
  "--color-toggle-shadow": "rgb(0 0 0 / 35%)",
  "--pattern-project-dots":
    "radial-gradient(circle, rgb(128 128 128 / 40%) 0.5px, transparent 0.5px)",
  "--pattern-portrait-dots":
    "radial-gradient(circle, rgb(0 0 0 / 60%) 0.6px, transparent 0.6px)",
  "--gradient-hero-vignette":
    "radial-gradient(ellipse 60% 40% at 50% 50%, rgb(10 10 10 / 75%) 0%, rgb(10 10 10 / 30%) 50%, transparent 100%)",
  "--shadow-hero-title":
    "0 0 60px rgb(0 0 0 / 90%), 0 0 120px rgb(0 0 0 / 60%)",
  "--shadow-hero-subtitle": "0 0 40px rgb(0 0 0 / 90%)",
} as const;

const lightTheme = {
  "--color-scheme": "light",
  "--color-canvas": "#f7f5f0",
  "--color-text-primary": "#1c1c1e",
  "--color-text-display": "#2c2c2e",
  "--color-text-secondary": "#55555a",
  "--color-text-muted": "#6e6e73",
  "--color-accent": "#b94700",
  "--color-hero-ascii": "#000000",
  "--font-weight-hero-ascii": "500",
  "--color-accent-link": "#a84300",
  "--color-success": "#1f7a35",
  "--color-selection-background": "rgb(185 71 0 / 22%)",
  "--color-selection-text": "#1c1c1e",
  "--color-accent-rule": "rgb(185 71 0 / 38%)",
  "--color-accent-border": "rgb(185 71 0 / 24%)",
  "--color-accent-divider": "rgb(185 71 0 / 18%)",
  "--color-accent-divider-soft": "rgb(185 71 0 / 12%)",
  "--color-accent-scroll": "rgb(185 71 0 / 55%)",
  "--color-border": "rgb(28 28 30 / 10%)",
  "--color-border-portrait": "rgb(28 28 30 / 14%)",
  "--color-project-index": "rgb(28 28 30 / 8%)",
  "--color-hero-arrow": "rgb(0 0 0 / 30%)",
  "--color-hero-subtitle": "#1c1c1e",
  "--font-weight-hero-subtitle": "500",
  "--letter-spacing-hero-subtitle": "0.18em",
  "--color-hero-scroll": "#6e6e73",
  "--color-toggle-surface": "rgb(247 245 240 / 82%)",
  "--color-toggle-hover": "rgb(28 28 30 / 8%)",
  "--color-toggle-border": "rgb(28 28 30 / 22%)",
  "--color-toggle-shadow": "rgb(28 28 30 / 14%)",
  "--pattern-project-dots":
    "radial-gradient(circle, rgb(80 80 80 / 24%) 0.5px, transparent 0.5px)",
  "--pattern-portrait-dots":
    "radial-gradient(circle, rgb(0 0 0 / 42%) 0.6px, transparent 0.6px)",
  "--gradient-hero-vignette": "none",
  "--shadow-hero-title": "none",
  "--shadow-hero-subtitle":
    "0 0 3px rgb(247 245 240), 0 0 10px rgb(247 245 240 / 85%)",
} satisfies Record<keyof typeof darkTheme, string>;

const declarations = (tokens: Record<string, string>) =>
  Object.entries(tokens)
    .map(([name, value]) => `${name}:${value}`)
    .join(";");

const themes = { dark: darkTheme, light: lightTheme } satisfies Record<
  Theme,
  Record<string, string>
>;
const alternateTheme: Theme = DEFAULT_THEME === "light" ? "dark" : "light";

export const themeCss = `:root,[data-theme="${DEFAULT_THEME}"]{${declarations(themes[DEFAULT_THEME])}}[data-theme="${alternateTheme}"]{${declarations(themes[alternateTheme])}}`;

export const faviconColors = {
  dark: {
    background: "#000000",
    foreground: darkTheme["--color-accent"],
  },
  light: {
    background: "#ffffff",
    foreground: "#000000",
  },
};
