"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import deck from "@/components/CardDeck.module.css";
import LearningWidget from "./LearningWidget";
import styles from "./blog.module.css";

type Note = {
  title: string;
  summary: string;
  category: string;
  tags: string[];
  image: string;
  accent: [string, string];
  kind: string;
};

const notes: Note[] = [
  {
    title: "Building Tweakler: cloning interfaces without guessing",
    summary:
      "What changes when a design reference becomes structured evidence instead of a screenshot prompt.",
    category: "Agents",
    tags: ["Design systems", "Tooling"],
    image: "tweakler",
    accent: ["#94a630", "#cdda81"],
    kind: "Build note",
  },
  {
    title: "The missing quality layer in coding-agent evaluations",
    summary:
      "Notes on separating policy performance, captured evidence, and the judgment that connects them.",
    category: "Evaluation",
    tags: ["Coding agents", "Benchmarks"],
    image: "evals",
    accent: ["#7ba630", "#bada81"],
    kind: "Field note",
  },
  {
    title: "Training GPT-2 on 10 billion tokens from scratch",
    summary:
      "The implementation details that made the jump from a readable transformer to a trainable one.",
    category: "Foundations",
    tags: ["Transformers", "Training"],
    image: "gpt2",
    accent: ["#1041c6", "#688ef3"],
    kind: "Learning log",
  },
  {
    title: "Routing sensitive data before it reaches the cloud",
    summary:
      "A practical model for classifying PII and choosing between on-device and cloud inference.",
    category: "AI systems",
    tags: ["Privacy", "Inference"],
    image: "cloud-routing",
    accent: ["#1043c6", "#688ff3"],
    kind: "Architecture",
  },
  {
    title: "Designing an AI copilot for sensitive case notes",
    summary:
      "What early-childhood assessors taught me about structured outputs, trust, and useful automation.",
    category: "Design",
    tags: ["Healthtech", "Human factors"],
    image: "copilot",
    accent: ["#c62810", "#f37b68"],
    kind: "Product note",
  },
  {
    title: "When product analytics can adapt the interface",
    summary:
      "Exploring the boundary between observing user behavior and automatically changing a product.",
    category: "AI systems",
    tags: ["Analytics", "Adaptation"],
    image: "adaptive-analytics",
    accent: ["#bd2f19", "#ec7f6f"],
    kind: "Research note",
  },
];

const categories = [
  "All",
  "AI systems",
  "Agents",
  "Evaluation",
  "Design",
  "Foundations",
] as const;

type Category = (typeof categories)[number];

export default function BlogDirectory() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");

  const visibleNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return notes.filter((note) => {
      const matchesCategory =
        activeCategory === "All" || note.category === activeCategory;
      const searchableText = [
        note.title,
        note.summary,
        note.category,
        ...note.tags,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return matchesCategory && searchableText.includes(normalizedQuery);
    });
  }, [activeCategory, query]);

  return (
    <main className={`deck-page ${styles.blogPage}`}>
      <div className={styles.stack}>
        <section className={deck.panel} aria-labelledby="blog-title">
          <span className={deck.panelLabel}>Blog</span>
          <div className={`${deck.panelBody} ${styles.heroBody}`}>
            <div className={`${deck.card} ${styles.titleCard}`}>
              <div className={deck.head}>
                <span>B0</span>
                <span>Pranav&apos;s learning log</span>
                <span />
              </div>
              <h1 id="blog-title" className={styles.heroTitle}>
                What I&apos;m learning.
              </h1>
              <p className={styles.heroCopy}>
                Notes from the things I build, and what I figure out along the way.
              </p>
            </div>
            <LearningWidget />
          </div>
        </section>

        <section className={deck.panel} aria-label="Learning notes">
          <span className={deck.panelLabel}>Notes</span>
          <div className={`${deck.panelBody} ${styles.notesBody}`}>
            <div className={styles.filters}>
              <label className={styles.searchBox}>
                <span className={styles.srOnly}>Search learning notes</span>
                <span aria-hidden="true">/</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="search"
                />
              </label>

              <div className={styles.categoryList} aria-label="Filter by category">
                {categories.map((category) => {
                  const count =
                    category === "All"
                      ? notes.length
                      : notes.filter((note) => note.category === category).length;

                  return (
                    <button
                      key={category}
                      type="button"
                      className={styles.categoryButton}
                      data-active={activeCategory === category}
                      aria-pressed={activeCategory === category}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category} {count}
                    </button>
                  );
                })}
              </div>
            </div>

            {visibleNotes.length > 0 ? (
              <div className={styles.noteGrid} aria-live="polite">
                {visibleNotes.map((note) => (
                  <article
                    className={`${deck.card} ${styles.noteCard}`}
                    key={note.title}
                    style={{ "--accent-light": note.accent[0], "--accent-dark": note.accent[1] } as CSSProperties}
                  >
                    <div className={deck.head}>
                      <span>N{notes.indexOf(note) + 1}</span>
                      <span>{note.kind.toUpperCase()}</span>
                      <span />
                    </div>
                    <div className={`${deck.imageFrame} ${styles.imageStage}`}>
                      <div
                        className={`${deck.image} ${styles.accentLayer}`}
                        style={
                          {
                            "--mask": `url(/images/blog/${note.image}-accent.png)`,
                            "--mask-dark": `url(/images/blog/${note.image}-accent-dark.png)`,
                          } as CSSProperties
                        }
                      />
                      <div
                        className={deck.image}
                        style={
                          {
                            "--mask": `url(/images/blog/${note.image}.png)`,
                            "--mask-dark": `url(/images/blog/${note.image}-dark.png)`,
                          } as CSSProperties
                        }
                      />
                    </div>
                    <h2 className={styles.noteTitle}>{note.title}</h2>
                    <p className={styles.summary}>{note.summary}</p>
                    <ul className={styles.tags} aria-label="Topics">
                      <li className={deck.chipSolid}>{note.category}</li>
                      {note.tags.map((tag) => (
                        <li key={tag} className={deck.chip}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <div className={deck.status}>/coming soon</div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState} aria-live="polite">
                No notes match that search yet.
              </div>
            )}
          </div>
        </section>

        <footer className={styles.blogFooter}>
          <Link href="/">/back to portfolio ↗</Link>
        </footer>
      </div>
    </main>
  );
}
