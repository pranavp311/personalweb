import { AsciiRenderer } from "./ascii-renderer";

type State = "loading" | "display" | "transition";

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
  private rafId = 0;
  private onFrame: (ascii: string) => void;

  private readonly DISPLAY_DURATION = 5500; // ms
  private readonly TRANSITION_DURATION = 1200; // ms

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
    // Force re-render current frame
    if (this.state === "display") {
      this.currentFrame = this.renderer.gridToString(this.grids[this.currentIndex]);
      this.onFrame(this.currentFrame);
    }
  }

  private tick = () => {
    const now = performance.now();
    const elapsed = now - this.stateStartTime;

    if (this.state === "display") {
      if (elapsed >= this.DISPLAY_DURATION) {
        this.state = "transition";
        this.stateStartTime = now;
      }
    } else if (this.state === "transition") {
      const nextIndex = (this.currentIndex + 1) % this.grids.length;
      const rawT = Math.min(elapsed / this.TRANSITION_DURATION, 1);
      const t = smoothstep(rawT);

      const blended = this.renderer.interpolateGrids(
        this.grids[this.currentIndex],
        this.grids[nextIndex],
        t,
      );
      this.currentFrame = this.renderer.gridToString(blended);
      this.onFrame(this.currentFrame);

      if (rawT >= 1) {
        this.currentIndex = nextIndex;
        this.state = "display";
        this.stateStartTime = now;
        this.currentFrame = this.renderer.gridToString(this.grids[this.currentIndex]);
        this.onFrame(this.currentFrame);
      }
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  stop() {
    cancelAnimationFrame(this.rafId);
  }
}
