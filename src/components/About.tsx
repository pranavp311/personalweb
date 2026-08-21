"use client";

import SectionReveal from "./SectionReveal";
import AsciiPortrait from "./AsciiPortrait";

export default function About() {
  return (
    <section id="about" style={{ padding: "140px 0 100px" }}>
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
              fontFamily: "var(--font-ui-mono)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "var(--color-accent)",
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
            alignItems: "center",
            flexWrap: "wrap" as const,
          }}
        >
          {/* Text */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <SectionReveal delay={100}>
              <h2
                style={{
                  fontFamily: "var(--font-content-heading)",
                  fontSize: "clamp(32px, 5vw, 52px)",
                  lineHeight: 1.2,
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  color: "var(--color-text-primary)",
                }}
              >
                Year 2 CS student at NUS.
              </h2>
              <h2
                style={{
                  fontFamily: "var(--font-ui-mono)",
                  fontSize: "clamp(14px, 1.8vw, 18px)",
                  lineHeight: 1.6,
                  fontWeight: 400,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  color: "var(--color-text-muted)",
                  marginTop: 20,
                }}
              >
                I build AI-powered tools and ship fast.
              </h2>
            </SectionReveal>

            <SectionReveal delay={200}>
              {/* Accent rule */}
              <div
                style={{
                  width: 48,
                  height: 1,
                  background: "var(--color-accent-rule)",
                  marginTop: 36,
                  marginBottom: 32,
                }}
              />

              <div>
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.8,
                    fontWeight: 300,
                    color: "var(--color-text-secondary)",
                    marginBottom: 20,
                  }}
                >
                  Currently building Tweakler, working as a Research Assistant under Prof. Ooi Wei Tsang
                  on dynamic 3D Gaussian Splatting benchmarking, and serving as a CCSGP Fellow building
                  AssessMate for early childhood intervention assessors.
                </p>
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.8,
                    fontWeight: 300,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Interested in AI infrastructure, developer tools, healthtech,
                  neuroevolution, and quality-diversity algorithms.
                </p>
              </div>
            </SectionReveal>
          </div>

          {/* ASCII Portrait */}
          <SectionReveal delay={300}>
            <div style={{ flexShrink: 0 }}>
              <AsciiPortrait />
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
