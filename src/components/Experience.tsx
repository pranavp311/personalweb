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

function ArrowLink({ href }: { href: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => e.stopPropagation()}
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 11,
        fontWeight: 400,
        letterSpacing: "0.05em",
        color: hovered ? "#ff6600" : "#48484a",
        textDecoration: "none",
        transition: "color 0.3s ease",
      }}
    >
      -&gt;
    </a>
  );
}

export default function Experience() {
  return (
    <section style={{ padding: "100px 0" }}>
      <div
        style={{
          maxWidth: 800,
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
              marginBottom: 40,
            }}
          >
            Experience
          </p>
        </SectionReveal>

        <div
          style={{
            borderLeft: "1px solid rgba(255,102,0,0.15)",
            paddingLeft: 32,
            display: "flex",
            flexDirection: "column",
            gap: 48,
          }}
        >
          {experiences.map((exp, i) => (
            <SectionReveal key={exp.role} delay={i * 100}>
              <div>
                <h3
                  style={{
                    fontSize: 21,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    color: "#f5f5f7",
                    marginBottom: 6,
                  }}
                >
                  {exp.role}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 11,
                    fontWeight: 400,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    color: "#636366",
                    marginBottom: 14,
                  }}
                >
                  {exp.org}
                </p>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.75,
                    fontWeight: 300,
                    color: "#8e8e93",
                  }}
                >
                  {exp.description}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Hackathons */}
        <div style={{ marginTop: 80 }}>
          <SectionReveal>
            <p
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: "#ff6600",
                marginBottom: 40,
              }}
            >
              Hackathons
            </p>
          </SectionReveal>

          <div
            style={{
              borderLeft: "1px solid rgba(255,102,0,0.15)",
              paddingLeft: 32,
              display: "flex",
              flexDirection: "column",
              gap: 48,
            }}
          >
            {hackathons.map((hack, i) => (
              <SectionReveal key={hack.event} delay={i * 100}>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 6,
                    }}
                  >
                    {hack.place && (
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                          fontSize: 11,
                          fontWeight: 500,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase" as const,
                          color: "#4ade80",
                        }}
                      >
                        {hack.place.toUpperCase()} //
                      </span>
                    )}
                    <h3
                      style={{
                        fontSize: 21,
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        color: "#f5f5f7",
                      }}
                    >
                      {hack.event}
                    </h3>
                    {hack.github && (
                      <div style={{ marginLeft: "auto" }}>
                        <ArrowLink href={hack.github} />
                      </div>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 14,
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
