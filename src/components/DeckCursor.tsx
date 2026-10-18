"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./DeckCursor.module.css";

// The custom cursor hides the hand pointer, so its tag says what a click will do.
function labelFor(target: Element) {
  const link = target.closest("a");
  if (link) return link.getAttribute("href")?.startsWith("#") ? "GO ↓" : "OPEN ↗";
  const hint = target.closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel;
  const code = target.closest<HTMLElement>("[data-code]")?.dataset.code ?? "";
  if (target.closest("button")) return hint ?? "";
  if (target.closest("[data-drag]")) return code ? `${code} · DRAG` : "DRAG";
  return hint ?? code;
}

// Crosshair cursor for the whole .deck-page it is mounted in.
export default function DeckCursor() {
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState("");
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = cursorRef.current?.closest<HTMLElement>(".deck-page");
    if (!root) return;
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    let lastPoint: [number, number] | null = null;

    function show(visible: boolean) {
      setOn(visible);
      root!.dataset.cursor = visible ? "on" : "off";
    }

    function handleMove(event: PointerEvent) {
      if (!query.matches || event.pointerType !== "mouse") return;
      lastPoint = [event.clientX, event.clientY];
      show(true);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${event.clientX - 10}px, ${event.clientY - 10}px)`;
      }
      setLabel(labelFor(event.target as Element));
    }

    // Scrolling moves the page under a still pointer, so re-read what it is over.
    function handleScroll() {
      if (!lastPoint) return;
      const target = document.elementFromPoint(lastPoint[0], lastPoint[1]);
      if (!target || !root!.contains(target)) {
        show(false);
        return;
      }
      setLabel(labelFor(target));
    }

    function handleLeave() {
      show(false);
    }

    function handleChange(event: MediaQueryListEvent) {
      if (!event.matches) show(false);
    }

    root.addEventListener("pointermove", handleMove);
    root.addEventListener("pointerleave", handleLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    query.addEventListener("change", handleChange);
    return () => {
      root.removeEventListener("pointermove", handleMove);
      root.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("scroll", handleScroll);
      query.removeEventListener("change", handleChange);
      delete root.dataset.cursor;
    };
  }, []);

  return (
    <div ref={cursorRef} className={styles.cursor} data-visible={on} aria-hidden="true">
      <svg width="21" height="21" viewBox="0 0 7 7" shapeRendering="crispEdges">
        <path d="M3 0h1v3H3zM3 4h1v3H3zM0 3h3v1H0zM4 3h3v1H4z" fill="currentColor" />
      </svg>
      {label && <span className={styles.cursorTag}>{label}</span>}
    </div>
  );
}
