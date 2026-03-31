"use client";

import { useState } from "react";
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
      "Built SecureClaw — a privacy-first on-device AI assistant using FunctionGemma with smart cloud fallback, PII detection, and local-vs-cloud routing.",
    github: "https://github.com/pranavp311/secureclaw",
  },
  {
    event: "Hack&Roll 2026",
    description:
      "Built JustPromptBro — a VSCode extension with event-driven keystroke tracking, real-time behavioural feedback, and a Solana smart contract for on-chain game logic.",
    github: "https://github.com/Fiyxxx/justpromptbro",
  },
  {
    event: "Jane Street Kaggle Competition",
    description:
      "Built a neural network from scratch and leveraged XGBoost for time-series forecasting on unlabelled market data to predict prices 6 months ahead.",
  },
];

function Card({
  children,
  index,
  accent,
  href,
}: {
  children: React.ReactNode;
  index: number;
  accent?: boolean;
  href?: string;
}) {
  const [hovered, setHovered] = useState(false);

  const content = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "24px 28px",
        background: hovered
          ? accent
            ? "rgba(255,102,0,0.04)"
            : "rgba(255,255,255,0.03)"
          : "rgba(255,255,255,0.015)",
        border: "1px solid",
        borderColor: hovered
          ? accent
            ? "rgba(255,102,0,0.2)"
            : "rgba(255,255,255,0.1)"
          : "rgba(255,255,255,0.05)",
        borderRadius: 6,
        transition: "background 0.3s ease, border-color 0.3s ease",
        height: "100%",
        cursor: href ? "pointer" : "default",
      }}
      onClick={href ? () => window.open(href, "_blank", "noopener,noreferrer") : undefined}
    >
      {children}
    </div>
  );

  return <SectionReveal delay={index * 100}>{content}</SectionReveal>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <SectionReveal>
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          color: "#ff6600",
          marginBottom: 24,
        }}
      >
        {children}
      </p>
    </SectionReveal>
  );
}

export default function Experience() {
  return (
    <section style={{ padding: "100px 0" }}>
      <div
        style={{
          maxWidth: 1000,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: 32,
          paddingRight: 32,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "start",
        }}
      >
        {/* Experience — left column */}
        <div>
          <SectionLabel>Experience</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {experiences.map((exp, i) => (
              <Card key={exp.role} index={i}>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "#f5f5f7",
                  }}
                >
                  {exp.role}
                </h3>
                <p
                  style={{
                    marginTop: 5,
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 11,
                    fontWeight: 400,
                    color: "#48484a",
                    letterSpacing: "0.02em",
                  }}
                >
                  {exp.org}
                </p>
                <p
                  style={{
                    marginTop: 12,
                    fontSize: 13,
                    lineHeight: 1.7,
                    fontWeight: 300,
                    color: "#6e6e73",
                  }}
                >
                  {exp.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Hackathons — right column */}
        <div>
          <SectionLabel>Hackathons</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {hackathons.map((hack, i) => (
              <Card key={hack.event} index={i} accent={!!hack.place} href={hack.github}>
                {hack.place && (
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase" as const,
                      padding: "3px 10px",
                      borderRadius: 999,
                      color: "#4ade80",
                      background: "rgba(74,222,128,0.07)",
                      border: "1px solid rgba(74,222,128,0.15)",
                      marginBottom: 14,
                    }}
                  >
                    {hack.place}
                  </span>
                )}
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "#f5f5f7",
                  }}
                >
                  {hack.event}
                </h3>
                <p
                  style={{
                    marginTop: 12,
                    fontSize: 13,
                    lineHeight: 1.7,
                    fontWeight: 300,
                    color: "#6e6e73",
                  }}
                >
                  {hack.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
