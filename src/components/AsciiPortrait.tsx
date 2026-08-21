"use client";

export default function AsciiPortrait() {
  return (
    <div
      style={{
        width: 220,
        height: 220,
        borderRadius: "50%",
        overflow: "hidden",
        position: "relative",
        marginRight: 24,
      }}
    >
      {/* Original image */}
      <img
        src="/images/profile.jpg"
        alt="Pranav Pappu"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          display: "block",
          transform: "scale(1.8)",
          transformOrigin: "45% 40%",
          filter: "brightness(0.8) contrast(1.15)",
        }}
      />
      {/* Dot-grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "var(--pattern-portrait-dots)",
          backgroundSize: "2.5px 2.5px",
          pointerEvents: "none",
        }}
      />
      {/* Subtle border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px solid var(--color-border-portrait)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
