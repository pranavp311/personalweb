"use client";

import { useState } from "react";
import SectionReveal from "./SectionReveal";

const projects = [
  {
    name: "Tweakler",
    description:
      "An agent-driven system that turns permissioned website references into distinct, brand-oriented sites through deterministic cloning, adaptation, validation, and human approval gates.",
    image: "/images/proj-brushstroke.png",
    private: true,
  },
  {
    name: "EvoServe",
    status: "WIP" as const,
    description:
      "A harness-quality and evaluation control plane for coding-agent systems that compares policy candidates, independently verifies captured-run evidence, and produces auditable quality and regression reports.",
    image: "/images/proj-agentisland.png",
    private: true,
  },
  {
    name: "GPT-2 from Scratch",
    description:
      "Recreated GPT-2 124M from scratch: tokenizer, transformer blocks, optimizer, mixed precision, and FineWeb Edu evaluation; trained on 10B tokens.",
    image: "/images/proj-gpt2.png",
    github: "https://github.com/pranavp311/learning_nn/tree/main/NanoGPT_GPT2_124M",
  },
  {
    name: "SecureClaw",
    description:
      "A privacy router for 12 PII types with three routing modes, on-device/cloud inference, and a 30-case benchmark.",
    image: "/images/proj-secureclaw.png",
    imagePosition: "90% center",
    imageSize: "contain" as const,
    github: "https://github.com/pranavp311/secureclaw",
  },
  {
    name: "AssessMate",
    status: "WIP" as const,
    description:
      "An AI case-notes copilot for structured documentation, piloted with two assessors to measure documentation-time reduction on PDPA-sensitive child-development data.",
    image: "/images/proj-assessmate.png",
    imagePosition: "93% center",
    imageSize: "contain" as const,
  },
  {
    name: "Moltlytics",
    description:
      "Analytics platform rivaling PostHog that lets website owners automatically adapt their sites based on real customer behavior data.",
    image: "/images/proj-moltlytics.png",
    imagePosition: "93% center",
    imageSize: "contain" as const,
    private: true,
  },
];

function ProjectCell({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <SectionReveal delay={index * 80} style={{ display: "flex" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={
          project.github
            ? () => window.open(project.github, "_blank", "noopener,noreferrer")
            : undefined
        }
        style={{
          position: "relative",
          padding: "28px 24px",
          cursor: project.github ? "pointer" : "default",
          overflow: "hidden",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          borderRight: index % 2 === 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Ghost image on hover */}
        {project.image && (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${project.image})`,
                backgroundSize: project.imageSize || "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: project.imagePosition || "center",
                opacity: hovered ? 0.07 : 0,
                transition: "opacity 0.5s ease",
                pointerEvents: "none",
              }}
            />
            {/* ASCII dot-grid overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle, rgba(128,128,128,0.4) 0.5px, transparent 0.5px)",
                backgroundSize: "3px 3px",
                opacity: hovered ? 0.4 : 0,
                transition: "opacity 0.5s ease",
                pointerEvents: "none",
              }}
            />
          </>
        )}

        {/* Index number */}
        <span
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: 36,
            fontWeight: 400,
            lineHeight: 1,
            color: "rgba(255,255,255,0.05)",
            position: "absolute",
            top: 24,
            right: 24,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Content */}
        <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <h3
              style={{
                fontSize: 21,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: hovered ? "#ff6600" : "#f5f5f7",
                transition: "color 0.3s ease",
              }}
            >
              {project.name}
            </h3>

            {project.status && (
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#ff6600",
                  opacity: 0.6,
                }}
              >
                {project.status}
              </span>
            )}
          </div>

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.75,
              fontWeight: 300,
              color: "#8e8e93",
              marginBottom: 16,
            }}
          >
            {project.description}
          </p>

          {/* Bottom meta */}
          <div style={{ marginTop: "auto", paddingTop: 16 }}>
          {project.private ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                fontWeight: 400,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "#2c2c2e",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Private
            </span>
          ) : project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                color: hovered ? "#ff6600" : "#48484a",
                transition: "color 0.3s ease",
                textDecoration: "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          ) : null}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

export default function Projects() {
  return (
    <section style={{ padding: "100px 0" }}>
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
            Projects
          </p>
        </SectionReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            borderLeft: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {projects.map((project, i) => (
            <ProjectCell key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
