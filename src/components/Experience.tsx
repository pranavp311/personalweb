"use client";

import { useState } from "react";
import SectionReveal from "./SectionReveal";

const experiences = [
  {
    role: "Founder",
    org: "Tweakler",
    description: (
      <>
        Building an agent-driven system that turns permissioned website references into distinct,
        brand-oriented sites with deterministic validation and human approval gates; already being used
        and tested by a few studios, including{" "}
        <a
          href="https://brightsea.framer.website/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecorationColor: "rgba(255,102,0,0.5)" }}
        >
          Brightsea Studio
        </a>
        .
      </>
    ),
  },
  {
    role: "Research Assistant",
    org: "Prof. Ooi Wei Tsang, NUS School of Computing",
    description:
      "Built a dynamic 3D Gaussian Splatting benchmark across multiple methods and datasets with repeatable quality and performance reports.",
  },
  {
    role: "CCSGP Fellow",
    org: "NUS Centre for Computing for Social Good",
    description:
      "Building AssessMate, an AI case-notes copilot for structured documentation with early childhood intervention assessors.",
  },
];

const hackathons = [
  {
    place: "1st Place",
    event: "Replit Agent Hackathon (Singapore)",
    description:
      "Built Remember \u2014 an AR smart glasses simulator for dementia patients with real-time face recognition, contextual information overlay, and a personal knowledge graph powered by live speech extraction.",
    github: "https://github.com/Fiyxxx/remember",
  },
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
        display: "inline-flex",
        alignItems: "center",
        color: hovered ? "#ff6600" : "#48484a",
        textDecoration: "none",
        transition: "color 0.3s ease",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
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
                <div
                  onClick={hack.github ? () => window.open(hack.github, "_blank", "noopener,noreferrer") : undefined}
                  style={{ cursor: hack.github ? "pointer" : "default" }}
                >
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
                        {hack.place.toUpperCase()} {"//"}
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
