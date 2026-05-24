const asciiRows = [
  "    .,:;+*#%@#*+;:,.        .,:;+*#%@#*+;:,.    ",
  "  .,:;+*#%@%#*+;:,.      .,:;+*#%@%#*+;:,.      ",
  " .,:;+*#%@#*+;:,.      .,:;+*#%@#*+;:,.         ",
  "   .,:;+*#%@%#*+;:,.      .,:;+*#%@%#*+;:,.     ",
  "      .,:;+*#%@#*+;:,.        .,:;+*#%@#*+;:,.  ",
  " .,:;+*#%@#*+;:,.      .,:;+*#%@%#*+;:,.        ",
  "   .,:;+*#%@%#*+;:,.        .,:;+*#%@#*+;:,.    ",
  "      .,:;+*#%@#*+;:,.      .,:;+*#%@%#*+;:,.   ",
  "  .,:;+*#%@%#*+;:,.        .,:;+*#%@#*+;:,.     ",
  "    .,:;+*#%@#*+;:,.      .,:;+*#%@%#*+;:,.     ",
];

export const socialImageAlt = "Pranav Pappu - Builder / AI Researcher";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export function SocialPreviewImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "#0a0a0a",
        color: "#f5f5f7",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 48,
          color: "rgba(255, 102, 0, 0.16)",
          fontFamily: "monospace",
          fontSize: 24,
          lineHeight: 1.35,
          whiteSpace: "pre",
        }}
      >
        {asciiRows.map((row, index) => (
          <div key={index}>{row}</div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(10,10,10,0.58) 0%, rgba(10,10,10,0.82) 58%, rgba(10,10,10,0.96) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 54,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "rgba(245, 245, 247, 0.48)",
          fontFamily: "monospace",
          fontSize: 24,
          letterSpacing: 5,
          textTransform: "uppercase",
        }}
      >
        <span>pranavpappu.dev</span>
        <span>AI / Systems / Tools</span>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 96px",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#d1d1d6",
            fontFamily: "Georgia, serif",
            fontSize: 104,
            fontWeight: 500,
            lineHeight: 1,
            marginBottom: 34,
          }}
        >
          Pranav Pappu
        </div>
        <div
          style={{
            display: "flex",
            color: "rgba(245, 245, 247, 0.64)",
            fontFamily: "monospace",
            fontSize: 30,
            fontWeight: 400,
            letterSpacing: 8,
            lineHeight: 1.3,
            textTransform: "uppercase",
          }}
        >
          Builder / AI Researcher
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "rgba(255, 102, 0, 0.72)",
          fontFamily: "monospace",
          fontSize: 22,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        <span>NUS CS</span>
        <span>Singapore</span>
      </div>
    </div>
  );
}
