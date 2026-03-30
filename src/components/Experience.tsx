"use client";

import SectionReveal from "./SectionReveal";

const experiences = [
  {
    role: "Research Assistant",
    org: "Prof. Ooi Wei Tsang, NUS School of Computing",
    description:
      "3D Gaussian Splatting optimization and benchmarking.",
  },
  {
    role: "CCSGP Fellow",
    org: "NUS Centre for Community Service",
    description:
      "Building AssessMate to support early childhood intervention assessors working with special needs children.",
  },
  {
    role: "Research Collaborator",
    org: "Prof. Leong Tze Yun\u2019s RL Group",
    description:
      "Exploring neuroevolution, world models, MAP-Elites, and quality-diversity algorithms for clinical time-series and architecture search.",
  },
];

const hackathons = [
  {
    place: "2nd Place",
    event: "Google DeepMind \u00d7 Cactus Compute Hackathon",
    description:
      "Built a hybrid LLM routing system using embedding-based similarity matching with privacy and compute scoring.",
  },
];

export default function Experience() {
  return (
    <section style={{ padding: "100px 0" }}>
      <div
        style={{
          maxWidth: 720,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        {/* Experience */}
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
            Experience
          </p>
        </SectionReveal>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {experiences.map((exp, i) => (
            <SectionReveal key={exp.role} delay={i * 80}>
              <div
                style={{
                  padding: "32px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "#f5f5f7",
                  }}
                >
                  {exp.role}
                </h3>
                <p
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    fontWeight: 400,
                    color: "#48484a",
                  }}
                >
                  {exp.org}
                </p>
                <p
                  style={{
                    marginTop: 14,
                    fontSize: 15,
                    lineHeight: 1.7,
                    fontWeight: 300,
                    color: "#6e6e73",
                  }}
                >
                  {exp.description}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Hackathon Wins */}
        <div style={{ marginTop: 120 }}>
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
              Hackathon Wins
            </p>
          </SectionReveal>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {hackathons.map((hack, i) => (
              <SectionReveal key={hack.event} delay={i * 80}>
                <div
                  style={{
                    padding: "32px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase" as const,
                        padding: "4px 12px",
                        borderRadius: 999,
                        color: "#ff6600",
                        background: "rgba(255,102,0,0.07)",
                        border: "1px solid rgba(255,102,0,0.15)",
                      }}
                    >
                      {hack.place}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      color: "#f5f5f7",
                    }}
                  >
                    {hack.event}
                  </h3>
                  <p
                    style={{
                      marginTop: 14,
                      fontSize: 15,
                      lineHeight: 1.7,
                      fontWeight: 300,
                      color: "#6e6e73",
                    }}
                  >
                    {hack.description}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
