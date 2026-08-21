import { ImageResponse } from "next/og";
import { iconColors } from "@/lib/theme";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: iconColors.background,
          borderRadius: 4,
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontFamily: "monospace",
            fontWeight: 700,
            color: iconColors.foreground,
            lineHeight: 1,
          }}
        >
          P
        </span>
      </div>
    ),
    { ...size },
  );
}
