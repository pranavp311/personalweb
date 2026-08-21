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

export const faviconInitScript = `(()=>{let theme=${JSON.stringify(DEFAULT_THEME)};try{if(localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})==="light")theme="light"}catch{}document.documentElement.dataset.theme=theme;let link=document.getElementById("site-favicon");if(!link)return;const palette=${JSON.stringify(faviconColors)};const path=${JSON.stringify(lobePath)};const duration=1600;let active=true;let frame=0;const clamp=value=>Math.max(0,Math.min(1,value));const ease=value=>1-Math.pow(1-value,4);const scale=value=>"translate(60 60) scale("+value+") translate(-60 -60)";const uri=value=>{const colors=palette[theme];const lobes=[0,1,2].map(index=>{const local=ease(clamp((value-index*.11)/.68));const rotation=index*120-(1-local)*16;return local===0?"":"<g transform=\"rotate("+rotation+" 60 60)\"><path d=\""+path+"\" fill=\""+colors.foreground+"\" opacity=\""+clamp(local*1.7)+"\" transform=\""+scale(local)+"\"/></g>"}).join("");const seed=ease(clamp(value/.48));const svg="<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 120\">"+lobes+"<circle cx=\"60\" cy=\"60\" r=\"9\" fill=\""+colors.foreground+"\" transform=\""+scale(seed)+"\"/></svg>";return"data:image/svg+xml,"+encodeURIComponent(svg)};const start=performance.now();const draw=now=>{if(!active)return;const progress=clamp((now-start)/duration);link.href=uri(progress);if(progress<1)frame=requestAnimationFrame(draw);else active=false};link.href=uri(0);frame=requestAnimationFrame(draw);window.addEventListener("themechange",()=>{active=false;cancelAnimationFrame(frame);theme=document.documentElement.dataset.theme==="light"?"light":"dark";const current=document.getElementById("site-favicon");if(!current)return;const next=document.createElement("link");next.id="site-favicon";next.rel="icon";next.type="image/svg+xml";next.sizes="any";next.href=uri(1);current.replaceWith(next);link=next})})();`;
