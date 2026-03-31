"use client";

import { useState } from "react";
import SectionReveal from "./SectionReveal";

const projects = [
  {
    name: "Brushstroke",
    description:
      "A frontend MCP tool that lets AI agents generate and iterate on UI components in real time. Bringing animated illustration generation to agentic workflows.",
    image: "/images/proj-brushstroke.png",
    private: true,
  },
  {
    name: "Agent Island",
    status: "WIP" as const,
    description:
      "A visual interface for watching CLI and swarm agents work in real time, with quick approval flows for agent requests.",
    image: "/images/proj-agentisland.png",
    imagePosition: "center center",
    private: true,
  },
  {
    name: "AssessMate",
    status: "WIP" as const,
    description:
      "AI case note copilot for early childhood intervention assessors, helping special needs children get attention faster.",
    image: "/images/proj-assessmate.jpg",
  },
  {
    name: "SecureClaw",
    description:
      "Multi-agent LLM routing with MAP-Elites and UCB1 bandit policies for intelligent, privacy-aware model selection.",
    image: "/images/proj-secureclaw.png",
    github: "https://github.com/pranavp311/secureclaw",
  },
  {
    name: "Moltlytics",
    description:
      "Analytics platform rivaling PostHog that lets website owners automatically adapt their sites based on real customer behavior data.",
    image: "/images/proj-moltlytics.png",
    imagePosition: "top center",
    private: true,
  },
  {
    name: "GPT-2 from Scratch",
    description:
      "Full PyTorch implementation surpassing standard benchmarks, plus a custom BPE tokenizer.",
    image: "/images/proj-gpt2.jpg",
    imagePosition: "center center",
    github: "https://github.com/pranavp311/learning_nn",
  },
];

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const hasImage = !!project.image;

  return (
    <SectionReveal delay={index * 80}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={project.github ? () => window.open(project.github, "_blank", "noopener,noreferrer") : undefined}
        style={{
          background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
          border: "1px solid",
          borderColor: hovered ? "rgba(255,102,0,0.2)" : "rgba(255,255,255,0.06)",
          borderRadius: 6,
          overflow: "hidden",
          cursor: project.github ? "pointer" : "default",
          transition: "background 0.3s ease, border-color 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Image */}
        <div
          style={{
            width: "100%",
            height: 280,
            overflow: "hidden",
            background: "#111",
          }}
        >
          {hasImage ? (
            <img
              src={project.image}
              alt={project.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: project.imagePosition || "center",
                display: "block",
                transition: "none",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 28,
                color: "rgba(255,102,0,0.15)",
                letterSpacing: "0.05em",
              }}
            >
              {project.name[0]}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "20px 22px 24px", flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <h3
              style={{
                fontSize: 17,
                fontWeight: 600,
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
                  padding: "2px 8px",
                  borderRadius: 999,
                  color: "#ff6600",
                  background: "rgba(255,102,0,0.07)",
                  border: "1px solid rgba(255,102,0,0.15)",
                }}
              >
                {project.status}
              </span>
            )}

            <div style={{ flex: 1 }} />

            {project.private ? (
              <span
                title="Private repo — soon to be commercial"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  color: hovered ? "rgba(255,255,255,0.4)" : "#48484a",
                  transition: "color 0.3s ease",
                  cursor: "default",
                }}
              >
                <LockIcon />
                Private
              </span>
            ) : project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: hovered ? "#ff6600" : "#48484a",
                  transition: "color 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <GitHubIcon />
              </a>
            ) : null}
          </div>

          <p
            style={{
              marginTop: 10,
              fontSize: 13,
              lineHeight: 1.65,
              fontWeight: 300,
              color: "#6e6e73",
            }}
          >
            {project.description}
          </p>
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
          maxWidth: 1200,
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
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
