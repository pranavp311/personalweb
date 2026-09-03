"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import styles from "./SiteHeader.module.css";

const REVEAL_OFFSET = 32;

export default function SiteHeader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      setIsVisible(window.scrollY > REVEAL_OFFSET);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <header className={styles.header} data-visible={isVisible}>
      <nav className={styles.nav} aria-label="Primary">
        <Link href="/blog" className={styles.link}>
          Blog
        </Link>
        <a
          href="/pranav-pappu-resume.pdf"
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>
      </nav>
      <span className={styles.divider} aria-hidden="true" />
      <ThemeToggle />
    </header>
  );
}
