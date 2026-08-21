const CHAR_RAMP = " .,:;+*#%@";
const LIGHT_VISIBLE_THRESHOLD = 0.03;
const LIGHT_DENSITY_GAMMA = 0.64;

export class AsciiRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private _cols = 0;
  private _rows = 0;
  private charWidth = 0;
  private charHeight = 0;

  get cols() { return this._cols; }
  get rows() { return this._rows; }

  constructor(
    private fontSize: number = 10,
    private lineHeight: number = 1.0,
    private letterSpacing: number = 0,
  ) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true })!;
    this.measureChar();
    this.computeGrid();
  }

  private measureChar() {
    const m = document.createElement("canvas");
    const c = m.getContext("2d")!;
    c.font = `${this.fontSize}px "JetBrains Mono", monospace`;
    const metrics = c.measureText("M");
    this.charWidth = metrics.width;
    this.charHeight = this.fontSize * this.lineHeight;
  }

  computeGrid() {
    this._cols = Math.floor(window.innerWidth / (this.charWidth + this.letterSpacing));
    this._rows = Math.floor(window.innerHeight / this.charHeight);
    this.canvas.width = this._cols;
    this.canvas.height = this._rows;
  }

  sampleImage(img: HTMLImageElement): Float32Array {
    const { _cols: cols, _rows: rows } = this;
    const grid = new Float32Array(cols * rows);

    // Cover-fit: compute source crop to match grid aspect ratio
    const gridAspect = (cols * this.charWidth) / (rows * this.charHeight);
    const imgAspect = img.naturalWidth / img.naturalHeight;

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

    if (imgAspect > gridAspect) {
      // Image is wider — crop sides
      sw = img.naturalHeight * gridAspect;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      // Image is taller — crop top/bottom
      sh = img.naturalWidth / gridAspect;
      sy = (img.naturalHeight - sh) / 2;
    }

    this.ctx.clearRect(0, 0, cols, rows);
    this.ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);

    const data = this.ctx.getImageData(0, 0, cols, rows).data;
    for (let i = 0; i < cols * rows; i++) {
      const off = i * 4;
      // BT.601 luminance with gamma correction for better contrast
      let lum = (0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2]) / 255;
      // Increase contrast — push darks darker, brights brighter
      lum = Math.pow(lum, 1.6);
      grid[i] = lum;
    }

    return grid;
  }

  gridToString(
    grid: Float32Array,
    invertTone = false,
  ): string {
    const { _cols: cols, _rows: rows } = this;
    const rampLen = CHAR_RAMP.length - 1;
    const lines: string[] = [];

    for (let y = 0; y < rows; y++) {
      let line = "";
      for (let x = 0; x < cols; x++) {
        const brightness = grid[y * cols + x];
        if (!invertTone) {
          line += CHAR_RAMP[Math.round(brightness * rampLen)];
        } else {
          const idx = brightness >= LIGHT_VISIBLE_THRESHOLD
            ? Math.round(
                Math.pow(1 - brightness, LIGHT_DENSITY_GAMMA) * rampLen,
              )
            : 0;
          line += CHAR_RAMP[idx];
        }
      }
      lines.push(line);
    }

    return lines.join("\n");
  }

  interpolateGrids(a: Float32Array, b: Float32Array, t: number): Float32Array {
    const result = new Float32Array(a.length);
    const inv = 1 - t;
    for (let i = 0; i < a.length; i++) {
      result[i] = a[i] * inv + b[i] * t;
    }
    return result;
  }
}
