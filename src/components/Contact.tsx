"use client";

import { useState } from "react";
import SectionReveal from "./SectionReveal";

function LinkButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
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
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 24px",
        borderRadius: 6,
        border: "1px solid",
        borderColor: hovered ? "rgba(255,102,0,0.4)" : "rgba(255,255,255,0.08)",
        background: hovered ? "rgba(255,102,0,0.06)" : "transparent",
        color: hovered ? "#ff6600" : "#a1a1a6",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.02em",
        textDecoration: "none",
        transition: "all 0.3s ease",
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
        }}
      >
        <SectionReveal>
          <div
            style={{
              padding: "60px 48px",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 6,
              background: "rgba(255,255,255,0.015)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: "#ff6600",
                marginBottom: 20,
              }}
            >
              Get in Touch
            </p>

            <p
              style={{
                fontSize: 26,
                fontWeight: 500,
                color: "#f5f5f7",
                marginBottom: 12,
                letterSpacing: "-0.02em",
              }}
            >
              Let&apos;s build something together.
            </p>

            <p
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                fontWeight: 300,
                color: "#6e6e73",
                marginBottom: 40,
                maxWidth: 420,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Whether you&apos;re a fellow builder or just want to chat - I&apos;d love to hear from you.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
              }}
            >
            <LinkButton href="mailto:pappupranav311@gmail.com">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Email
            </LinkButton>
            <LinkButton href="https://www.linkedin.com/in/pranav-pappu-2a6bba1bb/">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </LinkButton>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
