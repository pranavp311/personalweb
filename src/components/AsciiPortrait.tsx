"use client";

import { useEffect, useRef, useState } from "react";

const CHAR_RAMP = " .,:;+*#%@";

export default function AsciiPortrait() {
  const imgCanvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const cols = 160;
  const charW = 2.2;
  const charH = 3.3;

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const imgCanvas = imgCanvasRef.current!;
      const imgCtx = imgCanvas.getContext("2d", { willReadFrequently: true })!;

      const charAspect = charW / charH;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const rows = Math.round(cols / (imgAspect / charAspect));

      imgCanvas.width = cols;
      imgCanvas.height = rows;
      imgCtx.drawImage(img, 0, 0, cols, rows);

      const data = imgCtx.getImageData(0, 0, cols, rows).data;
      const rampLen = CHAR_RAMP.length - 1;

      const displayCanvas = displayCanvasRef.current!;
      const dpr = window.devicePixelRatio || 1;
      const canvasW = cols * charW;
      const canvasH = rows * charH;
      displayCanvas.width = canvasW * dpr;
      displayCanvas.height = canvasH * dpr;
      displayCanvas.style.width = `${canvasW}px`;
      displayCanvas.style.height = `${canvasH}px`;

      const ctx = displayCanvas.getContext("2d")!;
      ctx.scale(dpr, dpr);
      ctx.font = `${charW * 1.4}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";

      // Acerola-style ASCII: decouple char selection (luminance) from color
      const exposure = 1.2;
      const attenuation = 0.55;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const off = (y * cols + x) * 4;
          const r = data[off];
          const g = data[off + 1];
          const b = data[off + 2];

          // Luminance for character selection
          const rawLum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const adjustedLum = Math.min(1, Math.pow(rawLum * exposure, attenuation));
          const charIdx = Math.round(adjustedLum * rampLen);
          const char = CHAR_RAMP[charIdx];

          if (char !== " ") {
            // Boost original colors to retain vibrancy (Acerola blend approach)
            const boost = adjustedLum / (rawLum + 0.001);
            const cr = Math.min(255, r * boost);
            const cg = Math.min(255, g * boost);
            const cb = Math.min(255, b * boost);
            ctx.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`;
            ctx.fillText(char, x * charW, y * charH);
          }
        }
      }

      setReady(true);
    };
    img.src = "/images/profile.jpg";
  }, []);

  return (
    <>
      <canvas ref={imgCanvasRef} style={{ display: "none" }} />
      <div
        style={{
          width: 220,
          height: 220,
          clipPath: "circle(50%)",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.6s ease",
          position: "relative",
          marginRight: 24,
        }}
      >
        <canvas
          ref={displayCanvasRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-55%, -50%)",
          }}
        />
      </div>
    </>
  );
}
