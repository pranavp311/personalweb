"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import styles from "./SiteHeader.module.css";

const HEADER_HEIGHT = 56;

export default function SiteHeader() {
  const [pastHero, setPastHero] = useState(false);
  const pathname = usePathname();
  const onBlog = pathname === "/blog" || pathname.startsWith("/blog/");

  // Only pages with the hero menu use this (see SiteHeader.module.css).
  useEffect(() => {
    function updateVisibility() {
      setPastHero(window.scrollY > window.innerHeight - HEADER_HEIGHT);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <header className={styles.header} data-past-hero={pastHero}>
      <nav className={styles.nav} aria-label="Primary">
        <Link href={onBlog ? "/" : "/blog"} className={styles.link}>
          {onBlog ? "Home" : "Blog"}
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
