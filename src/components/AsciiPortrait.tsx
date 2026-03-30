"use client";

import { useEffect, useRef, useState } from "react";

const CHAR_RAMP = " .,:;+*#%@";

export default function AsciiPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ascii, setAscii] = useState("");
  const cols = 200;

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

      const charAspect = 0.5;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const rows = Math.round(cols / (imgAspect / charAspect));

      canvas.width = cols;
      canvas.height = rows;
      ctx.drawImage(img, 0, 0, cols, rows);

      const data = ctx.getImageData(0, 0, cols, rows).data;
      const rampLen = CHAR_RAMP.length - 1;
      const lines: string[] = [];

      for (let y = 0; y < rows; y++) {
        let line = "";
        for (let x = 0; x < cols; x++) {
          const off = (y * cols + x) * 4;
          let lum = (0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2]) / 255;
          // Boost contrast: stretch and clamp
          lum = (lum - 0.15) * 1.6;
          lum = Math.max(0, Math.min(1, lum));
          line += CHAR_RAMP[Math.round(lum * rampLen)];
        }
        lines.push(line);
      }

      setAscii(lines.join("\n"));
    };
    img.src = "/images/profile.jpg";
  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div
        style={{
          background: "#141414",
          borderRadius: 12,
          padding: 12,
          overflow: "hidden",
          opacity: ascii ? 1 : 0,
          transition: "opacity 0.6s ease",
          width: 260,
        }}
      >
        <pre
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 2.4,
            lineHeight: 1.05,
            letterSpacing: "0px",
            color: "#ff6600",
            whiteSpace: "pre",
            overflow: "hidden",
          }}
        >
          {ascii}
        </pre>
      </div>
    </>
  );
}
