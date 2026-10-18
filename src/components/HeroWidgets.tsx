"use client";

import { useEffect, useState, type ReactNode } from "react";
import Draggable from "./Draggable";
import styles from "./AsciiHero.module.css";

export function Widget({ title, className, children }: { title: string; className: string; children: ReactNode }) {
  return (
    <Draggable className={className} aria-hidden="true">
      <div className={styles.widgetBar} data-drag>
        {title}
      </div>
      <div className={styles.widgetBody}>{children}</div>
    </Draggable>
  );
}

function clockFormats(locale: string, timeZone: string) {
  return {
    date: new Intl.DateTimeFormat(locale, {
      timeZone,
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: new Intl.DateTimeFormat(locale, {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZoneName: "short",
    }),
  };
}

const clocks = {
  singapore: { title: "Singapore", ...clockFormats("en-SG", "Asia/Singapore") },
  sanFrancisco: { title: "San Francisco", ...clockFormats("en-US", "America/Los_Angeles") },
};

export function ClockWidget({ city, className }: { city: keyof typeof clocks; className: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);

  return (
    <Widget title={clocks[city].title} className={className}>
      <span>{now ? clocks[city].date.format(now) : "--"}</span>
      <span>{now ? clocks[city].time.format(now) : "--:--:--"}</span>
    </Widget>
  );
}

const SIZE = 6;
const START = [
  [0, 1],
  [1, 2],
  [2, 0],
  [2, 1],
  [2, 2],
];

function seed() {
  const cells = new Array(SIZE * SIZE).fill(false);
  for (const [y, x] of START) cells[y * SIZE + x] = true;
  return cells;
}

// One Game of Life step on a wrapping grid.
function step(cells: boolean[]) {
  return cells.map((alive, i) => {
    const y = Math.floor(i / SIZE);
    const x = i % SIZE;
    let n = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if ((dx || dy) && cells[((y + dy + SIZE) % SIZE) * SIZE + ((x + dx + SIZE) % SIZE)]) n++;
      }
    }
    return n === 3 || (alive && n === 2);
  });
}

export function GliderWidget({ className }: { className: string }) {
  const [cells, setCells] = useState(seed);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setCells(step), 450);
    return () => clearInterval(timer);
  }, []);

  return (
    <Widget title="Glider 1.1" className={className}>
      <div className={styles.life}>
        {cells.map((alive, i) => (
          <span key={i} className={styles.cell} data-alive={alive} />
        ))}
      </div>
      <span>Game of Life</span>
    </Widget>
  );
}
