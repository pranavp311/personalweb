import { AsciiRenderer } from "./ascii-renderer";

type State = "loading" | "display" | "transition";

interface Twinkle {
  cx: number; // center column
  cy: number; // center row
  radius: number; // half-size of the cluster
  startTime: number;
  duration: number;
  peakBrightness: number;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export class ImageCycler {
  private renderer: AsciiRenderer;
  private images: HTMLImageElement[] = [];
  private grids: Float32Array[] = [];
  private currentIndex = 0;
  private state: State = "loading";
  private stateStartTime = 0;
  private currentFrame = "";
  private _currentGrid: Float32Array | null = null;
  private rafId = 0;
  private onFrame: (ascii: string) => void;

  get currentGrid(): Float32Array | null { return this._currentGrid; }

  private readonly DISPLAY_DURATION = 5500; // ms
  private readonly TRANSITION_DURATION = 1200; // ms

  // Twinkle state — targets mid-to-bright areas (the image subject)
  private twinkles: Twinkle[] = [];
  private scratchGrid: Float32Array | null = null;
  private lastTwinkleSpawn = 0;
  private readonly MAX_TWINKLES = 20;
  private readonly TWINKLE_SPAWN_INTERVAL = 250;
  private readonly TWINKLE_DURATION_MIN = 1500;
  private readonly TWINKLE_DURATION_MAX = 3000;
  private readonly TWINKLE_MIN_BRIGHTNESS = 0.15; // only on visible image areas
  private readonly TWINKLE_PEAK_MIN = 0.15;
  private readonly TWINKLE_PEAK_MAX = 0.35;

  constructor(
    private imagePaths: string[],
    renderer: AsciiRenderer,
    onFrame: (ascii: string) => void,
  ) {
    this.renderer = renderer;
    this.onFrame = onFrame;
  }

  async start() {
    await this.loadImages();
    this.computeAllGrids();
    this.state = "display";
    this.stateStartTime = performance.now();
    this.currentFrame = this.renderer.gridToString(this.grids[0]);
    this.onFrame(this.currentFrame);
    this.tick();
  }

  private async loadImages(): Promise<void> {
    const promises = this.imagePaths.map(
      (src) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        }),
    );
    this.images = await Promise.all(promises);
  }

  computeAllGrids() {
    this.grids = this.images.map((img) => this.renderer.sampleImage(img));
  }

  handleResize() {
    this.renderer.computeGrid();
    this.computeAllGrids();
    this.twinkles = [];
    this.scratchGrid = null;
  }

  private spawnTwinkles(now: number, grid: Float32Array) {
    if (now - this.lastTwinkleSpawn < this.TWINKLE_SPAWN_INTERVAL) return;
    this.lastTwinkleSpawn = now;

    // Prune expired
    this.twinkles = this.twinkles.filter(
      (t) => now - t.startTime < t.duration,
    );

    // Spawn 1-2 new ones up to max
    const totalCells = grid.length;
    const toSpawn = Math.min(
      2,
      this.MAX_TWINKLES - this.twinkles.length,
    );

    const cols = this.renderer.cols;
    const rows = this.renderer.rows;

    for (let i = 0; i < toSpawn; i++) {
      // Find a cell within the image subject (mid-to-bright areas)
      for (let attempt = 0; attempt < 20; attempt++) {
        const cx = Math.floor(Math.random() * cols);
        const cy = Math.floor(Math.random() * rows);
        if (grid[cy * cols + cx] >= this.TWINKLE_MIN_BRIGHTNESS) {
          const radius = 2 + Math.floor(Math.random() * 3); // 2-4 cell radius
          // Randomly brighten or dim (fluctuate)
          const sign = Math.random() < 0.5 ? 1 : -1;
          this.twinkles.push({
            cx,
            cy,
            radius,
            startTime: now,
            duration:
              this.TWINKLE_DURATION_MIN +
              Math.random() *
                (this.TWINKLE_DURATION_MAX - this.TWINKLE_DURATION_MIN),
            peakBrightness:
              sign *
              (this.TWINKLE_PEAK_MIN +
                Math.random() * (this.TWINKLE_PEAK_MAX - this.TWINKLE_PEAK_MIN)),
          });
          break;
        }
      }
    }
  }

  private applyTwinkles(grid: Float32Array, now: number): Float32Array {
    if (this.twinkles.length === 0) return grid;

    if (!this.scratchGrid || this.scratchGrid.length !== grid.length) {
      this.scratchGrid = new Float32Array(grid.length);
    }
    this.scratchGrid.set(grid);

    const cols = this.renderer.cols;
    const rows = this.renderer.rows;

    for (const t of this.twinkles) {
      const progress = (now - t.startTime) / t.duration;
      if (progress < 0 || progress > 1) continue;
      // Sine envelope: smooth rise and fall
      const envelope = Math.sin(progress * Math.PI);
      const boost = t.peakBrightness * envelope;

      // Apply boost to a cluster around (cx, cy), fading with distance
      const r = t.radius;
      const yMin = Math.max(0, t.cy - r);
      const yMax = Math.min(rows - 1, t.cy + r);
      const xMin = Math.max(0, t.cx - r);
      const xMax = Math.min(cols - 1, t.cx + r);

      for (let y = yMin; y <= yMax; y++) {
        for (let x = xMin; x <= xMax; x++) {
          const dx = (x - t.cx) / r;
          const dy = (y - t.cy) / r;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 1) continue;
          // Smooth falloff from center
          const falloff = 1 - dist;
          const idx = y * cols + x;
          this.scratchGrid[idx] = Math.max(0, Math.min(1, this.scratchGrid[idx] + boost * falloff));
        }
      }
    }

    return this.scratchGrid;
  }

  private tick = () => {
    const now = performance.now();
    const elapsed = now - this.stateStartTime;

    let grid: Float32Array;

    if (this.state === "display") {
      grid = this.grids[this.currentIndex];
      if (elapsed >= this.DISPLAY_DURATION) {
        this.state = "transition";
        this.stateStartTime = now;
        this.twinkles = [];
      }
    } else if (this.state === "transition") {
      const nextIndex = (this.currentIndex + 1) % this.grids.length;
      const rawT = Math.min(elapsed / this.TRANSITION_DURATION, 1);
      const t = smoothstep(rawT);

      grid = this.renderer.interpolateGrids(
        this.grids[this.currentIndex],
        this.grids[nextIndex],
        t,
      );

      if (rawT >= 1) {
        this.currentIndex = nextIndex;
        this.state = "display";
        this.stateStartTime = now;
        grid = this.grids[this.currentIndex];
      }
    } else {
      grid = this.grids[this.currentIndex] ?? new Float32Array(0);
    }

    // Apply twinkles only during display state (not during transitions)
    if (this.state === "display") {
      this.spawnTwinkles(now, grid);
    }
    const finalGrid = this.applyTwinkles(grid, now);

    this._currentGrid = finalGrid;
    this.currentFrame = this.renderer.gridToString(finalGrid);
    this.onFrame(this.currentFrame);

    this.rafId = requestAnimationFrame(this.tick);
  };

  stop() {
    cancelAnimationFrame(this.rafId);
  }
}
