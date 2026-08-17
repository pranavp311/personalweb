"use client";

import { useState } from "react";
import SectionReveal from "./SectionReveal";

function SocialLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 11,
        fontWeight: 400,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: hovered ? "#ff6600" : "#636366",
        textDecoration: "none",
        transition: "color 0.3s ease",
      }}
    >
      {label}
    </a>
  );
}

export default function Footer() {
  return (
    <footer style={{ padding: "60px 0 48px" }}>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap" as const,
              gap: 24,
            }}
          >
            {/* Left — identity */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontSize: 18,
                  fontWeight: 400,
                  color: "#48484a",
                  marginBottom: 6,
                }}
              >
                Pranav Pappu
              </p>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  fontWeight: 400,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase" as const,
                  color: "#2c2c2e",
                }}
              >
                CS @ NUS / Singapore
              </p>
            </div>

            {/* Right — links */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <SocialLink href="https://github.com/pranavp311" label="GitHub" />
              <span style={{ color: "#2c2c2e", fontSize: 10 }}>·</span>
              <SocialLink
                href="https://www.linkedin.com/in/pranav-pappu/"
                label="LinkedIn"
              />
              <span style={{ color: "#2c2c2e", fontSize: 10 }}>·</span>
              <SocialLink href="mailto:pappupranav311@gmail.com" label="Email" />
            </div>
          </div>
        </SectionReveal>
      </div>
    </footer>
  );
}
