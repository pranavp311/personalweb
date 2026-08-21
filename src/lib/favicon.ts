import "server-only";

import { faviconColors } from "./theme";
import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from "./theme-preference";

const lobePath =
  "M60 57C49 49 44 37 48 25C52 13 64 7 75 11C87 15 93 27 89 39C85 50 73 56 60 57Z";

function scaleAroundCenter(scale: number) {
  return `translate(60 60) scale(${scale}) translate(-60 -60)`;
}

function growingSystemSvg(theme: Theme, progress: number) {
  const colors = faviconColors[theme];
  const lobes = [0, 1, 2]
    .map((index) => {
      const rotation = index * 120;
      return `<g transform="rotate(${rotation} 60 60)"><path d="${lobePath}" fill="${colors.foreground}" transform="${scaleAroundCenter(progress)}"/></g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${lobes}<circle cx="60" cy="60" r="9" fill="${colors.foreground}" transform="${scaleAroundCenter(progress)}"/></svg>`;
}

function dataUri(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const defaultFavicon = dataUri(growingSystemSvg(DEFAULT_THEME, 1));

export const themeInitScript = `(()=>{let theme=${JSON.stringify(DEFAULT_THEME)};try{const stored=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(stored==="light"||stored==="dark")theme=stored}catch{}document.documentElement.dataset.theme=theme})();`;

export const faviconAnimation = {
  colors: {
    dark: faviconColors.dark.foreground,
    light: faviconColors.light.foreground,
  },
  duration: 1600,
  lobePath,
};
