"use client";

import SectionReveal from "./SectionReveal";

export default function About() {
  return (
    <section style={{ padding: "140px 0 100px" }}>
      <div
        style={{
          maxWidth: 900,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        <SectionReveal>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#ff6600",
              marginBottom: 48,
            }}
          >
            About
          </p>
        </SectionReveal>

        <div
          style={{
            display: "flex",
            gap: 56,
            alignItems: "flex-start",
            flexWrap: "wrap" as const,
          }}
        >
          {/* Text */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <SectionReveal delay={100}>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  lineHeight: 1.35,
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  color: "#f5f5f7",
                }}
              >
                Year 1 CS student at NUS.
              </h2>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  lineHeight: 1.35,
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  color: "#48484a",
                  marginTop: 4,
                }}
              >
                I build AI-powered tools and ship fast.
              </h2>
            </SectionReveal>

            <SectionReveal delay={200}>
              <div style={{ marginTop: 40 }}>
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.8,
                    fontWeight: 300,
                    color: "#98989d",
                    marginBottom: 20,
                  }}
                >
                  Currently a Research Assistant under Prof. Ooi Wei Tsang working on 3D Gaussian
                  Splatting optimization, CCSGP fellow building assistive tech for special needs
                  assessment, and a hackathon regular who builds to win.
                </p>
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.8,
                    fontWeight: 300,
                    color: "#98989d",
                  }}
                >
                  Interested in AI infrastructure, developer tools, healthtech,
                  neuroevolution, and quality-diversity algorithms.
                </p>
              </div>
            </SectionReveal>
          </div>

          {/* Profile Photo */}
          <SectionReveal delay={300}>
            <div style={{ flexShrink: 0 }}>
              <img
                src="/images/profile.jpg"
                alt="Pranav Pappu"
                style={{
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid rgba(255,102,0,0.3)",
                }}
              />
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
