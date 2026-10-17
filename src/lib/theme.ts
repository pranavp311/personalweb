import "server-only";

import { DEFAULT_THEME, type Theme } from "./theme-preference";

const darkTheme = {
  "--color-scheme": "dark",
  "--color-canvas": "#0a0a0a",
  "--color-text-primary": "#f5f5f7",
  "--color-text-secondary": "#98989d",
  "--color-text-muted": "#8e8e93",
  "--color-accent": "#ff6600",
  "--color-hero-ascii": "var(--color-accent)",
  "--font-weight-hero-ascii": "400",
  "--color-selection-background": "rgb(255 102 0 / 25%)",
  "--color-selection-text": "#ffffff",
  "--color-border": "rgb(255 255 255 / 4%)",
  "--color-toggle-surface": "rgb(10 10 10 / 72%)",
  "--color-toggle-hover": "rgb(245 245 247 / 8%)",
  "--color-toggle-border": "rgb(245 245 247 / 20%)",
  "--color-toggle-shadow": "rgb(0 0 0 / 35%)",
} as const;

const lightTheme = {
  "--color-scheme": "light",
  "--color-canvas": "#f7f5f0",
  "--color-text-primary": "#1c1c1e",
  "--color-text-secondary": "#55555a",
  "--color-text-muted": "#6e6e73",
  "--color-accent": "#b94700",
  "--color-hero-ascii": "#000000",
  "--font-weight-hero-ascii": "500",
  "--color-selection-background": "rgb(185 71 0 / 22%)",
  "--color-selection-text": "#1c1c1e",
  "--color-border": "rgb(28 28 30 / 10%)",
  "--color-toggle-surface": "rgb(247 245 240 / 82%)",
  "--color-toggle-hover": "rgb(28 28 30 / 8%)",
  "--color-toggle-border": "rgb(28 28 30 / 22%)",
  "--color-toggle-shadow": "rgb(28 28 30 / 14%)",
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
