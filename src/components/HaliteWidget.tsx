"use client";

import { useEffect, useRef, useState } from "react";
import { Widget } from "./HeroWidgets";
import styles from "./AsciiHero.module.css";

// A tiny Halite II: three AI agents race to dock ships on planets, docked ships build more
// ships, and ships that meet enemies fight. Each agent follows its own policy.

const W = 260;
const H = 150;
const TICK_MS = 70;
const MAX_TICKS = 2400;
const MAX_SHIPS = 60;
const SPEED = 1.4;
const BUILD_TICKS = 70;

type Planet = { x: number; y: number; r: number; slots: number; owner: number; docked: number };
type Ship = { x: number; y: number; owner: number; hp: number; dockedAt: number; cooldown: number };
type World = { planets: Planet[]; ships: Ship[]; tick: number; build: number[] };

const AGENTS = [
  { glyph: "▲", name: "expander" },
  { glyph: "■", name: "raider" },
  { glyph: "✚", name: "greedy" },
];

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function newWorld(seed: number): World {
  const rand = rng(seed);
  const planets: Planet[] = [];
  while (planets.length < 7) {
    const r = 7 + Math.floor(rand() * 8);
    const x = 30 + rand() * (W - 60);
    const y = 22 + rand() * (H - 44);
    if (planets.every((p) => Math.hypot(p.x - x, p.y - y) > p.r + r + 18)) {
      planets.push({ x, y, r, slots: Math.max(1, Math.floor(r / 4)), owner: -1, docked: 0 });
    }
  }
  const corners = [
    [12, 12],
    [W - 12, H - 12],
    [W - 12, 12],
  ];
  const ships: Ship[] = [];
  corners.forEach(([x, y], owner) => {
    for (let i = 0; i < 3; i++) ships.push({ x: x + i * 4 * (x < W / 2 ? 1 : -1), y, owner, hp: 3, dockedAt: -1, cooldown: 0 });
  });
  return { planets, ships, tick: 0, build: [0, 0, 0] };
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

function canDock(p: Planet, owner: number) {
  return (p.owner === -1 || p.owner === owner) && p.docked < p.slots;
}

// Each agent's policy: returns the point the ship should head for.
function decide(world: World, ship: Ship) {
  const free = world.planets.filter((p) => canDock(p, ship.owner));
  const enemies = world.ships.filter((s) => s.owner !== ship.owner);
  const nearestEnemy = enemies.reduce<Ship | null>((best, s) => (!best || dist(ship, s) < dist(ship, best) ? s : best), null);
  const nearestFree = free.reduce<Planet | null>((best, p) => (!best || dist(ship, p) < dist(ship, best) ? p : best), null);

  if (ship.owner === 1 && nearestEnemy && dist(ship, nearestEnemy) < 55) return nearestEnemy;
  if (ship.owner === 2 && free.length) {
    return free.reduce((best, p) => (p.r / (dist(ship, p) + 20) > best.r / (dist(ship, best) + 20) ? p : best));
  }
  if (nearestFree) return nearestFree;
  // Nothing left to claim: go after enemy docked ships first, then any enemy.
  const docked = enemies.filter((s) => s.dockedAt >= 0);
  const pool = docked.length ? docked : enemies;
  return pool.reduce<Ship | null>((best, s) => (!best || dist(ship, s) < dist(ship, best) ? s : best), null);
}

function step(world: World) {
  world.tick++;
  for (const ship of world.ships) {
    if (ship.dockedAt >= 0) continue;
    const target = decide(world, ship);
    if (!target) continue;
    const d = dist(ship, target);
    const planet = "slots" in target ? target : null;
    if (planet && d <= planet.r + 3 && canDock(planet, ship.owner)) {
      ship.dockedAt = world.planets.indexOf(planet);
      planet.owner = ship.owner;
      planet.docked++;
      continue;
    }
    const stop = planet ? planet.r + 2 : 0;
    const move = Math.min(SPEED, Math.max(0, d - stop));
    if (d > 0) {
      ship.x += ((target.x - ship.x) / d) * move;
      ship.y += ((target.y - ship.y) / d) * move;
    }
  }

  // Combat: enemies in range chip at each other.
  for (const a of world.ships) {
    if (a.cooldown > 0) {
      a.cooldown--;
      continue;
    }
    const foe = world.ships.find((b) => b.owner !== a.owner && b.hp > 0 && dist(a, b) < 7);
    if (foe) {
      foe.hp--;
      a.cooldown = 6;
    }
  }
  for (const s of world.ships) {
    if (s.hp <= 0 && s.dockedAt >= 0) {
      const p = world.planets[s.dockedAt];
      p.docked--;
      if (p.docked === 0) p.owner = -1;
    }
  }
  world.ships = world.ships.filter((s) => s.hp > 0);

  // Production: docked ships build new ships for their owner.
  AGENTS.forEach((_, owner) => {
    const docked = world.ships.filter((s) => s.owner === owner && s.dockedAt >= 0);
    world.build[owner] += docked.length;
    if (world.build[owner] >= BUILD_TICKS && docked.length && world.ships.length < MAX_SHIPS) {
      world.build[owner] = 0;
      const p = world.planets[docked[0].dockedAt];
      world.ships.push({ x: p.x + p.r + 3, y: p.y, owner, hp: 3, dockedAt: -1, cooldown: 0 });
    }
  });
}

function alive(world: World) {
  return AGENTS.map((_, owner) => world.ships.some((s) => s.owner === owner));
}

function draw(ctx: CanvasRenderingContext2D, world: World, ink: string) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = ink;
  for (const p of world.planets) {
    const owned = p.owner >= 0;
    for (let y = -p.r; y <= p.r; y++) {
      for (let x = -p.r; x <= p.r; x++) {
        const d2 = x * x + y * y;
        if (d2 > p.r * p.r) continue;
        const edge = d2 > (p.r - 1.2) * (p.r - 1.2);
        const px = Math.round(p.x + x);
        const py = Math.round(p.y + y);
        const fill = owned ? (px + py) % 2 === 0 : px % 3 === 0 && py % 3 === 0;
        if (edge || fill) ctx.fillRect(px, py, 1, 1);
      }
    }
  }
  ctx.font = "10px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const s of world.ships) {
    if (s.dockedAt >= 0) {
      const p = world.planets[s.dockedAt];
      ctx.clearRect(Math.round(p.x) - 4, Math.round(p.y) - 4, 9, 9);
      ctx.fillText(AGENTS[s.owner].glyph, p.x, p.y + 0.5);
      continue;
    }
    ctx.fillText(AGENTS[s.owner].glyph, s.x, s.y);
  }
}

export function HaliteWidget({ className }: { className: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState(() => AGENTS.map(() => ({ ships: 3, planets: 0 })));
  const [match, setMatch] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    // The canvas is scaled up to fill its window, so draw at 3x for crisp glyphs.
    const ratio = 3;
    canvas.width = W * ratio;
    canvas.height = H * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    let seed = 2;
    let world = newWorld(seed);
    let ink = getComputedStyle(canvas).color;
    let visible = true;
    let timer = 0;

    function report() {
      setStats(AGENTS.map((_, owner) => ({
        ships: world.ships.filter((s) => s.owner === owner).length,
        planets: world.planets.filter((p) => p.owner === owner).length,
      })));
    }

    function tick() {
      if (!visible) return;
      step(world);
      if (alive(world).filter(Boolean).length <= 1 || world.tick >= MAX_TICKS) {
        seed++;
        world = newWorld(seed);
        setMatch((m) => m + 1);
      }
      draw(ctx!, world, ink);
      if (world.tick % 8 === 0) report();
    }

    function handleTheme() {
      ink = getComputedStyle(canvas!).color;
      draw(ctx!, world, ink);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);
    window.addEventListener("themechange", handleTheme);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (let i = 0; i < 400; i++) step(world);
      draw(ctx, world, ink);
      report();
    } else {
      draw(ctx, world, ink);
      timer = window.setInterval(tick, TICK_MS);
    }

    return () => {
      clearInterval(timer);
      observer.disconnect();
      window.removeEventListener("themechange", handleTheme);
    };
  }, []);

  return (
    <Widget title={`Halite II · match ${match}`} className={className}>
      <canvas ref={canvasRef} className={styles.halite} />
      {AGENTS.map((agent, owner) => (
        <span key={agent.name} className={styles.agentRow}>
          <span>
            {agent.glyph} {agent.name}
          </span>
          <span>
            {stats[owner].ships} {stats[owner].ships === 1 ? "ship" : "ships"} · {stats[owner].planets}{" "}
            {stats[owner].planets === 1 ? "planet" : "planets"}
          </span>
        </span>
      ))}
    </Widget>
  );
}
