"use client";

import { useState } from "react";
import SectionReveal from "./SectionReveal";

function TypoLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-ui-mono)",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: hovered ? "var(--color-accent)" : "var(--color-text-secondary)",
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
              fontFamily: "var(--font-ui-mono)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              color: "var(--color-accent)",
              marginBottom: 40,
            }}
          >
            Get in Touch
          </p>

          <p
            style={{
              fontFamily: "var(--font-content-heading)",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 400,
              color: "var(--color-text-primary)",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              marginBottom: 24,
            }}
          >
            Let&apos;s build something together.
          </p>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              fontWeight: "var(--font-weight-body-copy)",
              color: "var(--color-text-secondary)",
              marginBottom: 48,
              maxWidth: 460,
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
            <TypoLink href="mailto:pranavpappu@u.nus.edu">Email</TypoLink>
            <span
              style={{
                fontFamily: "var(--font-ui-mono)",
                fontSize: 13,
                color: "var(--color-text-secondary)",
                letterSpacing: "0.1em",
              }}
            >
              /
            </span>
            <TypoLink href="https://www.linkedin.com/in/pranav-pappu/">
              LinkedIn
            </TypoLink>
            <span
              style={{
                fontFamily: "var(--font-ui-mono)",
                fontSize: 13,
                color: "var(--color-text-secondary)",
                letterSpacing: "0.1em",
              }}
            >
              /
            </span>
            <TypoLink href="/blog">Blog</TypoLink>
          </div>

          {/* ASCII dot strip — bookend motif */}
          <p
            style={{
              fontFamily: "var(--font-ui-mono)",
              fontSize: 7,
              letterSpacing: "0.4em",
              color: "var(--color-accent-divider-soft)",
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
