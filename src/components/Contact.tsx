"use client";

import { useState } from "react";
import SectionReveal from "./SectionReveal";

function TypoLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const isMailto = href.startsWith("mailto");

  return (
    <a
      href={href}
      target={isMailto ? undefined : "_blank"}
      rel={isMailto ? undefined : "noopener noreferrer"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.15em",
        textTransform: "uppercase" as const,
        color: hovered ? "#ff6600" : "#98989d",
        textDecoration: "none",
        transition: "color 0.3s ease",
      }}
    >
      {children}
    </a>
  );
}

export default function Contact() {
  return (
    <section style={{ padding: "100px 0" }}>
      <div
        style={{
          maxWidth: 800,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: 32,
          paddingRight: 32,
          textAlign: "center",
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
              marginBottom: 40,
            }}
          >
            Get in Touch
          </p>

          <p
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 400,
              color: "#f5f5f7",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              marginBottom: 24,
            }}
          >
            Let&apos;s build something together.
          </p>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              fontWeight: 300,
              color: "#8e8e93",
              marginBottom: 48,
              maxWidth: 420,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Whether you&apos;re a fellow builder or just want to chat &mdash; I&apos;d love to hear from you.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
            }}
          >
            <TypoLink href="mailto:pappupranav311@gmail.com">Email</TypoLink>
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 12,
                color: "#2c2c2e",
                letterSpacing: "0.1em",
              }}
            >
              /
            </span>
            <TypoLink href="https://www.linkedin.com/in/pranav-pappu/">
              LinkedIn
            </TypoLink>
          </div>

          {/* ASCII dot strip — bookend motif */}
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 7,
              letterSpacing: "0.4em",
              color: "rgba(255,102,0,0.08)",
              marginTop: 64,
              userSelect: "none",
            }}
          >
            · · · · · · · · · · · · · · · · · · ·
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
