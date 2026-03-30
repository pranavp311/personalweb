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
        fontSize: 13,
        fontWeight: 400,
        color: hovered ? "#ff6600" : "#636366",
        textDecoration: "none",
        transition: "color 0.3s ease",
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </a>
  );
}

export default function Footer() {
  return (
    <footer style={{ padding: "80px 0 48px" }}>
      <div
        style={{
          maxWidth: 720,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        <SectionReveal>
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.06)",
              marginBottom: 56,
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 28,
            }}
          >
            <p
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: "#48484a",
              }}
            >
              Pranav &mdash; CS @ NUS &middot; Singapore
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
              }}
            >
              <SocialLink href="https://github.com/pranavp311" label="GitHub" />
              <SocialLink
                href="https://www.linkedin.com/in/pranav-pappu-2a6bba1bb/"
                label="LinkedIn"
              />
              <SocialLink href="mailto:pranav@u.nus.edu" label="Email" />
            </div>

            <p
              style={{
                fontSize: 11,
                fontWeight: 300,
                color: "#2c2c2e",
                marginTop: 12,
              }}
            >
              Built with curiosity and too much caffeine.
            </p>
          </div>
        </SectionReveal>
      </div>
    </footer>
  );
}
