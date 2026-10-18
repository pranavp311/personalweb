"use client";

import { useEffect, useRef, useState } from "react";
import deck from "@/components/CardDeck.module.css";
import styles from "./blog.module.css";

// A tiny neural net learning live: a 2-12-12-1 MLP trains on a toy dataset, the field shows
// its prediction as dithered ink, and the curve on the right is its loss. Once it has learned
// the shape, a fresh run starts on the next dataset.

const W = 480;
const H = 200;
const FIELD = 200;
const CELL = 4;
const TICK_MS = 60;
const STEPS_PER_TICK = 2;
const MAX_STEPS = 4000;
const HISTORY = 240;
const POINTS = 160;
const LR = 0.02;
const SIZES = [2, 12, 12, 1];

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

type Point = { x: number; y: number; label: number };
type Layer = { w: Float64Array; b: Float64Array; mw: Float64Array; vw: Float64Array; mb: Float64Array; vb: Float64Array };
type Run = { name: string; points: Point[]; layers: Layer[]; step: number; loss: number; acc: number; history: number[]; settled: number };

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Toy datasets in [-1, 1]^2.
const DATASETS: { name: string; make: (rand: () => number) => Point }[] = [
  {
    name: "spiral",
    make: (rand) => {
      const label = rand() < 0.5 ? 0 : 1;
      const t = rand();
      const angle = t * 2.6 * Math.PI + label * Math.PI;
      const r = 0.15 + t * 0.75;
      return { x: r * Math.cos(angle) + (rand() - 0.5) * 0.04, y: r * Math.sin(angle) + (rand() - 0.5) * 0.04, label };
    },
  },
  {
    name: "rings",
    make: (rand) => {
      const label = rand() < 0.5 ? 0 : 1;
      const angle = rand() * Math.PI * 2;
      const r = (label ? 0.3 : 0.75) + (rand() - 0.5) * 0.2;
      return { x: r * Math.cos(angle), y: r * Math.sin(angle), label };
    },
  },
  {
    name: "xor",
    make: (rand) => {
      const x = rand() * 1.8 - 0.9;
      const y = rand() * 1.8 - 0.9;
      return { x, y, label: x * y > 0 ? 1 : 0 };
    },
  },
  {
    name: "moons",
    make: (rand) => {
      const label = rand() < 0.5 ? 0 : 1;
      const angle = rand() * Math.PI;
      const x = label ? 1 - Math.cos(angle) : Math.cos(angle);
      const y = label ? 0.5 - Math.sin(angle) : Math.sin(angle);
      return { x: (x - 0.5) * 0.6 + (rand() - 0.5) * 0.06, y: (y - 0.25) * 0.6 + (rand() - 0.5) * 0.06, label };
    },
  },
];

function newRun(index: number, seed: number): Run {
  const rand = rng(seed);
  const dataset = DATASETS[index % DATASETS.length];
  const points = Array.from({ length: POINTS }, () => dataset.make(rand));
  const layers = SIZES.slice(1).map((out, i) => {
    const inp = SIZES[i];
    const scale = Math.sqrt(1 / inp);
    return {
      w: Float64Array.from({ length: out * inp }, () => (rand() * 2 - 1) * scale * 1.5),
      b: new Float64Array(out),
      mw: new Float64Array(out * inp),
      vw: new Float64Array(out * inp),
      mb: new Float64Array(out),
      vb: new Float64Array(out),
    };
  });
  return { name: dataset.name, points, layers, step: 0, loss: 1, acc: 0, history: [], settled: 0 };
}

// Returns every layer's activations; tanh hidden layers, sigmoid output.
function forward(layers: Layer[], x: number, y: number) {
  const acts: Float64Array[] = [Float64Array.of(x, y)];
  layers.forEach((layer, l) => {
    const inp = acts[l];
    const out = new Float64Array(layer.b.length);
    for (let j = 0; j < out.length; j++) {
      let sum = layer.b[j];
      for (let i = 0; i < inp.length; i++) sum += layer.w[j * inp.length + i] * inp[i];
      out[j] = l === layers.length - 1 ? 1 / (1 + Math.exp(-sum)) : Math.tanh(sum);
    }
    acts.push(out);
  });
  return acts;
}

// One full-batch Adam step on binary cross-entropy.
function train(run: Run) {
  const { layers, points } = run;
  const gw = layers.map((l) => new Float64Array(l.w.length));
  const gb = layers.map((l) => new Float64Array(l.b.length));
  let loss = 0;
  let correct = 0;
  for (const p of points) {
    const acts = forward(layers, p.x, p.y);
    const out = acts[acts.length - 1][0];
    loss -= p.label ? Math.log(out + 1e-9) : Math.log(1 - out + 1e-9);
    if ((out > 0.5 ? 1 : 0) === p.label) correct++;
    let delta = Float64Array.of(out - p.label);
    for (let l = layers.length - 1; l >= 0; l--) {
      const inp = acts[l];
      const layer = layers[l];
      const next = new Float64Array(inp.length);
      for (let j = 0; j < delta.length; j++) {
        gb[l][j] += delta[j];
        for (let i = 0; i < inp.length; i++) {
          gw[l][j * inp.length + i] += delta[j] * inp[i];
          next[i] += delta[j] * layer.w[j * inp.length + i];
        }
      }
      if (l > 0) for (let i = 0; i < next.length; i++) next[i] *= 1 - inp[i] * inp[i];
      delta = next;
    }
  }
  run.step++;
  const t = run.step;
  const n = points.length;
  const adam = (param: Float64Array, grad: Float64Array, m: Float64Array, v: Float64Array) => {
    for (let k = 0; k < param.length; k++) {
      const g = grad[k] / n;
      m[k] = 0.9 * m[k] + 0.1 * g;
      v[k] = 0.999 * v[k] + 0.001 * g * g;
      param[k] -= (LR * (m[k] / (1 - 0.9 ** t))) / (Math.sqrt(v[k] / (1 - 0.999 ** t)) + 1e-8);
    }
  };
  layers.forEach((layer, l) => {
    adam(layer.w, gw[l], layer.mw, layer.vw);
    adam(layer.b, gb[l], layer.mb, layer.vb);
  });
  run.loss = loss / n;
  run.acc = correct / n;
}

const toField = (v: number) => ((v + 1) / 2) * FIELD;

// Allocation-free prediction for drawing the field, which runs thousands of times a frame.
const hidden = SIZES.slice(1, -1).map((n) => new Float64Array(n));
function predict(layers: Layer[], x: number, y: number) {
  let inp: ArrayLike<number> = [x, y];
  for (let l = 0; l < layers.length; l++) {
    const layer = layers[l];
    const last = l === layers.length - 1;
    const out = last ? null : hidden[l];
    for (let j = 0; j < layer.b.length; j++) {
      let sum = layer.b[j];
      for (let i = 0; i < inp.length; i++) sum += layer.w[j * inp.length + i] * inp[i];
      if (last) return 1 / (1 + Math.exp(-sum));
      out![j] = Math.tanh(sum);
    }
    inp = out!;
  }
  return 0;
}

function draw(ctx: CanvasRenderingContext2D, run: Run, ink: string, paper: string, font: string) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = ink;

  // Prediction field: dot density follows the predicted probability.
  const cols = FIELD / CELL;
  for (let gy = 0; gy < cols; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const x = ((gx + 0.5) / cols) * 2 - 1;
      const y = 1 - ((gy + 0.5) / cols) * 2;
      const p = predict(run.layers, x, y);
      if (p * 0.85 > BAYER[(gy & 3) * 4 + (gx & 3)]) ctx.fillRect(gx * CELL + 1, gy * CELL + 1, 2, 2);
    }
  }
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, FIELD - 1, H - 1);

  // Data: filled squares for one class, hollow for the other, each knocked out of the field.
  for (const p of run.points) {
    const x = toField(p.x);
    const y = toField(-p.y);
    ctx.fillStyle = paper;
    ctx.fillRect(x - 4, y - 4, 8, 8);
    ctx.fillStyle = ink;
    if (p.label) ctx.fillRect(x - 3, y - 3, 6, 6);
    else ctx.strokeRect(x - 2.5, y - 2.5, 5, 5);
  }

  // Loss curve.
  const left = FIELD + 28;
  const right = W - 8;
  const top = 22;
  const bottom = H - 22;
  ctx.font = `15px ${font}`;
  ctx.fillText("loss", left, 15);
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left, bottom);
  ctx.lineTo(right, bottom);
  ctx.stroke();
  const peak = Math.max(0.7, ...run.history);
  ctx.beginPath();
  run.history.forEach((loss, i) => {
    const x = left + (i / (HISTORY - 1)) * (right - left);
    const y = bottom - (loss / peak) * (bottom - top);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.fillText("step", right - 34, H - 4);
}

export default function LearningWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState({ run: 1, name: DATASETS[0].name, step: 0, loss: 1, acc: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    // The canvas is scaled to fill the card, so draw at 3x for crisp dots.
    const ratio = 3;
    canvas.width = W * ratio;
    canvas.height = H * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    let index = 0;
    let seed = 7;
    let runCount = 1;
    let run = newRun(index, seed);
    let visible = true;
    let timer = 0;
    let ink = "";
    let paper = "";
    let font = "";

    function readColours() {
      const style = getComputedStyle(canvas!);
      ink = style.color;
      paper = style.getPropertyValue("--deck-card").trim() || "#fff";
      font = style.fontFamily;
    }

    function report() {
      setStats({ run: runCount, name: run.name, step: run.step, loss: run.loss, acc: run.acc });
    }

    function advance() {
      for (let i = 0; i < STEPS_PER_TICK; i++) train(run);
      run.history.push(run.loss);
      if (run.history.length > HISTORY) run.history.shift();
      run.settled = run.acc >= 0.98 ? run.settled + 1 : 0;
    }

    function tick() {
      if (!visible) return;
      advance();
      if (run.settled > 50 || run.step >= MAX_STEPS) {
        index++;
        seed++;
        runCount++;
        run = newRun(index, seed);
      }
      draw(ctx!, run, ink, paper, font);
      report();
    }

    function handleTheme() {
      readColours();
      draw(ctx!, run, ink, paper, font);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);
    window.addEventListener("themechange", handleTheme);
    readColours();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (let i = 0; i < 150; i++) advance();
    } else {
      timer = window.setInterval(tick, TICK_MS);
    }
    draw(ctx, run, ink, paper, font);
    report();

    return () => {
      clearInterval(timer);
      observer.disconnect();
      window.removeEventListener("themechange", handleTheme);
    };
  }, []);

  return (
    <div className={`${deck.card} ${styles.visualCard}`} aria-hidden="true">
      <div className={deck.head}>
        <span>B1</span>
        <span>Learning 1.0 · run {stats.run}</span>
        <span />
      </div>
      <canvas ref={canvasRef} className={styles.learning} />
      <div className={styles.learningStats}>
        <span>{stats.name}</span>
        <span>step {stats.step.toLocaleString("en-SG")}</span>
        <span>loss {stats.loss.toFixed(3)}</span>
        <span>acc {Math.round(stats.acc * 100)}%</span>
      </div>
    </div>
  );
}
