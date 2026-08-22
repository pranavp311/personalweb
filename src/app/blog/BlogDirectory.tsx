"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./blog.module.css";

type Note = {
  title: string;
  summary: string;
  category: string;
  tags: string[];
  image: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  kind: string;
};

const notes: Note[] = [
  {
    title: "Building Tweakler: cloning interfaces without guessing",
    summary:
      "What changes when a design reference becomes structured evidence instead of a screenshot prompt.",
    category: "Agents",
    tags: ["Design systems", "Tooling"],
    image: "/images/proj-brushstroke.png",
    kind: "Build note",
  },
  {
    title: "The missing quality layer in coding-agent evaluations",
    summary:
      "Notes on separating policy performance, captured evidence, and the judgment that connects them.",
    category: "Evaluation",
    tags: ["Coding agents", "Benchmarks"],
    image: "/images/blog-evals.jpg",
    imagePosition: "center 66%",
    kind: "Field note",
  },
  {
    title: "Training GPT-2 on 10 billion tokens from scratch",
    summary:
      "The implementation details that made the jump from a readable transformer to a trainable one.",
    category: "Foundations",
    tags: ["Transformers", "Training"],
    image: "/images/blog-gpt2-editorial.png",
    kind: "Learning log",
  },
  {
    title: "Routing sensitive data before it reaches the cloud",
    summary:
      "A practical model for classifying PII and choosing between on-device and cloud inference.",
    category: "AI systems",
    tags: ["Privacy", "Inference"],
    image: "/images/blog-cloud-routing-editorial.png",
    imagePosition: "center",
    kind: "Architecture",
  },
  {
    title: "Designing an AI copilot for sensitive case notes",
    summary:
      "What early-childhood assessors taught me about structured outputs, trust, and useful automation.",
    category: "Design",
    tags: ["Healthtech", "Human factors"],
    image: "/images/blog-copilot-editorial.png",
    imagePosition: "center",
    kind: "Product note",
  },
  {
    title: "When product analytics can adapt the interface",
    summary:
      "Exploring the boundary between observing user behavior and automatically changing a product.",
    category: "AI systems",
    tags: ["Analytics", "Adaptation"],
    image: "/images/blog-adaptive-analytics-editorial.png",
    imagePosition: "center",
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
    <main className={styles.blogPage}>
      <section className={styles.hero} aria-labelledby="blog-title">
        <p className={styles.eyebrow}>Pranav&apos;s learning log</p>
        <h1 id="blog-title" className={styles.heroTitle}>
          Notes from building, breaking, and{" "}
          <span>learning.</span>
        </h1>
        <p className={styles.heroCopy}>
          AI systems, developer tools, and the experiments between them.
        </p>
      </section>

      <section className={styles.directory} aria-label="Learning notes">
        <div className={styles.filterRail}>
          <div className={styles.filterInner}>
            <label className={styles.searchBox}>
              <span className={styles.srOnly}>Search learning notes</span>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="6.75" />
                <path d="m16 16 4 4" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search…"
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
                    <span>{category}</span>
                    <span className={styles.categoryCount}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {visibleNotes.length > 0 ? (
          <div className={styles.noteGrid} aria-live="polite">
            {visibleNotes.map((note, index) => (
              <article className={styles.noteCard} key={note.title}>
                <div className={styles.imageStage}>
                  <Image
                    src={note.image}
                    alt=""
                    fill
                    loading={index < 3 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.noteImage}
                    style={{
                      objectFit: note.imageFit ?? "cover",
                      objectPosition: note.imagePosition ?? "center",
                    }}
                  />
                  <span className={styles.draftBadge}>Draft</span>
                </div>

                <div className={styles.cardCopy}>
                  <div>
                    <p className={styles.noteKind}>{note.kind}</p>
                    <h2>{note.title}</h2>
                    <p className={styles.summary}>{note.summary}</p>
                  </div>

                  <div className={styles.cardMeta}>
                    <ul aria-label="Topics">
                      <li>{note.category}</li>
                      {note.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <span>Coming soon</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState} aria-live="polite">
            No notes match that search yet.
          </div>
        )}
      </section>

      <footer className={styles.blogFooter}>
        <p>Learning in public, one useful note at a time.</p>
        <Link href="/">Back to portfolio ↗</Link>
      </footer>
    </main>
  );
}
