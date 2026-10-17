"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import DeckDecor from "./DeckDecor";
import ProjectVisual from "./ProjectVisuals";
import styles from "./CardDeck.module.css";

type Offset = [number, number];

const HOVER_LAYER = 100000;

type Drag = {
  id: string;
  startX: number;
  startY: number;
  origin: Offset;
};

const projects = [
  {
    id: "tweakler",
    name: "TWEAKLER",
    accent: ["#b45309", "#f0a35e"],
    text: (
      <>
        An agent-driven system that turns permissioned website references into distinct, brand-oriented sites
        through deterministic cloning, adaptation, validation, and human approval gates. Already being used and
        tested by a few studios, including <ExternalLink href="https://brightseastudio.com/">Brightsea Studio</ExternalLink>.
      </>
    ),
    status: "/private",
  },
  {
    id: "evoserve",
    name: "EVOSERVE",
    accent: ["#1f7a4d", "#6fd39b"],
    text: "A harness-quality and evaluation control plane for coding-agent systems that compares policy candidates, independently verifies captured-run evidence, and produces auditable quality and regression reports.",
    status: "/wip",
  },
  {
    id: "gpt2",
    name: "GPT-2",
    accent: ["#2f5bd3", "#8fb0ff"],
    text: "Recreated GPT-2 124M from scratch: tokenizer, transformer blocks, optimizer, mixed precision, and FineWeb Edu evaluation; trained on 10B tokens.",
    status: "/github ↗",
    href: "https://github.com/pranavp311/learning_nn/tree/main/NanoGPT_GPT2_124M",
  },
  {
    id: "secureclaw",
    name: "SECURECLAW",
    accent: ["#b45309", "#f0a35e"],
    text: "A privacy router for 12 PII types with three routing modes, on-device/cloud inference, and a 30-case benchmark.",
    status: "/github ↗",
    href: "https://github.com/pranavp311/secureclaw",
  },
  {
    id: "assessmate",
    name: "ASSESSMATE",
    accent: ["#b03a68", "#f29ac0"],
    text: "An AI case-notes copilot for structured documentation, piloted with two assessors to measure documentation-time reduction on PDPA-sensitive child-development data.",
    status: "/wip",
  },
  {
    id: "moltlytics",
    name: "MOLTLYTICS",
    accent: ["#157a86", "#6fd0dc"],
    text: "Analytics platform rivaling PostHog that lets website owners automatically adapt their sites based on real customer behavior data.",
    status: "/private",
  },
];

const roles = [
  {
    role: "AI Engineer Intern",
    org: "/Mission Systems",
    href: "https://www.missionsystems.ai/",
    text: "Built meeting intelligence that turns recordings into secure transcripts, action items, and searchable company knowledge for Launchpad, Mission Systems' AI operations platform for hospitality businesses. Building a secure internal workflow automation platform to replace fourteen production n8n workflows.",
  },
  {
    role: "Founder",
    org: "/Tweakler",
    text: (
      <>
        Building an agent-driven system that turns permissioned website references into distinct,
        brand-oriented sites with deterministic validation and human approval gates; already being used and
        tested by a few studios, including <ExternalLink href="https://brightseastudio.com/">Brightsea Studio</ExternalLink>.
      </>
    ),
  },
  {
    role: "Research Assistant",
    org: "/Prof. Ooi Wei Tsang, NUS Computing",
    text: "Built a dynamic 3D Gaussian Splatting benchmark across multiple methods and datasets with repeatable quality and performance reports.",
  },
  {
    role: "CCSGP Fellow",
    org: "/NUS Computing for Social Good",
    text: "Building AssessMate, an AI case-notes copilot for structured documentation with early childhood intervention assessors.",
  },
];

const hackathons = [
  { event: "Replit Agent Hackathon (Singapore)", place: "1ST", project: "Built Remember, an AR smart glasses simulator for dementia patients", win: true },
  { event: "Google DeepMind × Cactus Compute Hackathon", place: "2ND", project: "Built SecureClaw, a privacy-first on-device AI assistant", win: true },
  { event: "NVIDIA Nemotron Model Reasoning Challenge", place: "TOP 30%", project: "70th percentile in a field of 5,223 participants", win: false },
  { event: "Hack&Roll 2026", place: "—", project: "Built JustPromptBro, a VSCode extension", win: false },
];

// The custom cursor hides the hand pointer, so its tag says what a click will do.
function labelFor(target: Element) {
  const link = target.closest("a");
  if (link) return link.getAttribute("href")?.startsWith("#") ? "GO ↓" : "OPEN ↗";
  const code = target.closest<HTMLElement>("[data-code]")?.dataset.code ?? "";
  if (code && target.closest("[data-drag]")) return `${code} · DRAG`;
  return code;
}

// 11x11 outline icons drawn as pixel grids ("#" = ink), matching the 1-2px card strokes.
const ICON_ART = {
  mail: ["", "###########", "##.......##", "#.#.....#.#", "#..#...#..#", "#...###...#", "#.........#", "###########"],
  linkedin: ["###########", "#.........#", "#.#.......#", "#.........#", "#.#.##....#", "#.#.#.#...#", "#.#.#.#...#", "#.#.#.#...#", "#.........#", "###########"],
  github: ["..#.....#..", "..##...##..", "..#######..", ".#.......#.", ".#.#...#.#.", ".#.......#.", "..#.....#..", "...#####...", "...#.#.#...", "....#.#...."],
  blog: ["#########..", "#.......#..", "#.#####.#..", "#.......#..", "#.#####.#..", "#.......#..", "#.###...#..", "#.......#..", "#########.."],
  resume: ["######.....", "#....##....", "#....#.#...", "#....####..", "#.......#..", "#.####..#..", "#.......#..", "#.####..#..", "#.......#..", "#########.."],
} as const;

const ICONS = Object.fromEntries(
  Object.entries(ICON_ART).map(([name, rows]) => [
    name,
    rows.flatMap((row, y) => [...row].map((cell, x) => (cell === "#" ? `M${x} ${y}h1v1h-1z` : ""))).join(""),
  ]),
) as Record<keyof typeof ICON_ART, string>;

function PixelIcon({ name }: { name: keyof typeof ICON_ART }) {
  return (
    <svg className={styles.pixelIcon} viewBox="0 0 11 11" shapeRendering="crispEdges" aria-hidden="true">
      <path d={ICONS[name]} fill="currentColor" />
    </svg>
  );
}

const CONTACTS = [
  { label: "LinkedIn", detail: "/in/pranav-pappu", href: "https://www.linkedin.com/in/pranav-pappu/", icon: "linkedin", external: true },
  { label: "GitHub", detail: "pranavp311", href: "https://github.com/pranavp311", icon: "github", external: true },
  { label: "Blog", detail: "", href: "/blog", icon: "blog", external: false },
  { label: "Resume", detail: "", href: "/pranav-pappu-resume.pdf", icon: "resume", external: true },
] as const;

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className={styles.link} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

// Light mode masks mark dark pixels; dark mode masks mark light ones, so the image always reads
// the right way round (as the hero's ASCII does).
function DitherImage({ src, darkSrc, label, ratio }: { src: string; darkSrc: string; label: string; ratio: string }) {
  return (
    <div className={styles.imageFrame} data-visual role="img" aria-label={label} style={{ aspectRatio: ratio }}>
      <div
        className={styles.image}
        style={{ "--mask": `url(${src})`, "--mask-dark": `url(${darkSrc})` } as CSSProperties}
      />
    </div>
  );
}

export default function CardDeck() {
  const [offsets, setOffsets] = useState<Record<string, Offset>>({});
  const [layers, setLayers] = useState<Record<string, number>>({});
  const [cursorOn, setCursorOn] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const [hovered, setHovered] = useState("");
  const topLayer = useRef(1);
  const topCard = useRef("");
  const drag = useRef<Drag | null>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const lastPoint = useRef<[number, number] | null>(null);
  const finePointer = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    finePointer.current = query.matches;

    function handleChange(event: MediaQueryListEvent) {
      finePointer.current = event.matches;
      if (!event.matches) setCursorOn(false);
    }

    // Scrolling moves the page under a still pointer, so re-read what it is over.
    function handleScroll() {
      const point = lastPoint.current;
      if (!point || !deckRef.current) return;
      const target = document.elementFromPoint(point[0], point[1]);
      if (!target || !deckRef.current.contains(target)) {
        setCursorOn(false);
        return;
      }
      setCursorLabel(labelFor(target));
    }

    query.addEventListener("change", handleChange);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      query.removeEventListener("change", handleChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function raise(id: string) {
    if (topCard.current === id) return;
    topCard.current = id;
    topLayer.current += 1;
    setLayers((current) => ({ ...current, [id]: topLayer.current }));
  }

  function startDrag(id: string, event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      origin: offsets[id] ?? [0, 0],
    };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current) return;
    const next: Offset = [
      current.origin[0] + event.clientX - current.startX,
      current.origin[1] + event.clientY - current.startY,
    ];
    setOffsets((all) => ({ ...all, [current.id]: next }));
  }

  function endDrag() {
    drag.current = null;
  }

  function trackCursor(event: PointerEvent<HTMLElement>) {
    if (!finePointer.current || event.pointerType !== "mouse") return;
    lastPoint.current = [event.clientX, event.clientY];
    if (!cursorOn) setCursorOn(true);
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${event.clientX - 10}px, ${event.clientY - 10}px)`;
    }
    const label = labelFor(event.target as Element);
    if (label !== cursorLabel) setCursorLabel(label);
  }

  function card(
    id: string,
    code: string,
    head: [string, string, ReactNode?],
    children: ReactNode,
    extra?: { className?: string; style?: CSSProperties },
  ) {
    const [x, y] = offsets[id] ?? [0, 0];
    return (
      <article
        key={id}
        className={`${styles.card} ${extra?.className ?? ""}`}
        data-code={code}
        onPointerDown={() => raise(id)}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse" && !drag.current) setHovered(id);
        }}
        onPointerLeave={() => setHovered((current) => (current === id ? "" : current))}
        style={{
          ...extra?.style,
          // Only dragged cards get a transform: an identity transform on every card makes Chrome
          // re-composite large areas on hover, which can leave stale background-coloured tiles.
          transform: x || y ? `translate(${x}px, ${y}px)` : undefined,
          // Hover lifts a card only while hovered; clicking or dragging moves it to the front for good.
          zIndex: hovered === id ? HOVER_LAYER : layers[id] ?? 1,
        }}
      >
        <div
          className={styles.head}
          data-drag
          onPointerDown={(event) => startDrag(id, event)}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span>{head[0]}</span>
          <span>{head[1]}</span>
          <span>{head[2] ?? ""}</span>
        </div>
        {children}
      </article>
    );
  }

  return (
    <div
      ref={deckRef}
      className={styles.deck}
      data-cursor={cursorOn ? "on" : "off"}
      onPointerMove={trackCursor}
      onPointerLeave={() => setCursorOn(false)}
    >
      <DeckDecor />
      <div className={styles.bar}>
        <nav className={styles.nav} aria-label="Sections">
          <a href="#projects" className={styles.link}>/PROJECTS</a>
          <a href="#experience" className={styles.link}>/EXPERIENCE</a>
          <a href="#contact" className={styles.link}>/CONTACT</a>
        </nav>
      </div>

      <div className={styles.stack}>
        <section id="about" className={styles.pair}>
          <div className={`${styles.col} ${styles.lead}`}>
            {card(
              "about",
              "CARD_01",
              ["C1", "ABOUT"],
              <>
                <DitherImage
                  src="/images/deck/portrait.png"
                  darkSrc="/images/deck/portrait-dark.png"
                  label="Pranav Pappu in front of a temple in Kyoto"
                  ratio="1 / 1"
                />
                <p className={styles.text}>
                  Year 2 CS student at NUS. I build AI-powered tools and ship fast.
                </p>
                <p className={styles.text}>
                  Currently building Tweakler, working as a Research Assistant under Prof. Ooi Wei Tsang on dynamic
                  3D Gaussian Splatting benchmarking, and serving as a CCSGP Fellow building AssessMate for early
                  childhood intervention assessors.
                </p>
              </>,
            )}
          </div>
          <div className={`${styles.col} ${styles.follow}`}>
            {card(
              "interests",
              "CARD_02",
              ["C2", "INTERESTS"],
              <ul className={styles.list}>
                <li>AI infrastructure</li>
                <li>Developer tools</li>
                <li>Healthtech</li>
                <li>Neuroevolution</li>
                <li>Quality-diversity algorithms</li>
              </ul>,
            )}
          </div>
        </section>

        <section id="projects" className={styles.projects}>
          {[0, 2, 4].map((start) => (
            <div key={start} className={styles.pair}>
              {projects.slice(start, start + 2).map((project, i) => {
                const index = start + i + 3;
                return card(
                  project.id,
                  `CARD_0${index}`,
                  [`C${index}`, project.name],
                  <>
                    <ProjectVisual id={project.id} />
                    <p className={styles.text}>{project.text}</p>
                    <div className={styles.status}>
                      {project.href ? <ExternalLink href={project.href}>{project.status}</ExternalLink> : project.status}
                    </div>
                  </>,
                  {
                    className: i === 0 ? styles.lead : styles.follow,
                    style: { "--accent-light": project.accent[0], "--accent-dark": project.accent[1] } as CSSProperties,
                  },
                );
              })}
            </div>
          ))}
        </section>

        <section id="experience" className={styles.center}>
          {card(
            "chronology",
            "CARD_09",
            ["C9", "EXPERIENCE"],
            <>
              <p className={styles.sectionLabel}>/WINS</p>
              <div className={styles.wins}>
                {hackathons.map((hack) => (
                  <div key={hack.event} className={styles.win}>
                    <span className={hack.win ? styles.placeWin : styles.place}>{hack.place}</span>
                    <span className={styles.winText}>
                      <span>{hack.event}</span>
                      <span className={styles.muted}>{hack.project}</span>
                    </span>
                  </div>
                ))}
              </div>
              <p className={styles.sectionLabel}>/ROLES</p>
              <div className={styles.roles}>
                {roles.map((entry) => (
                  <div key={entry.role} className={styles.role}>
                    <div className={styles.roleHead}>
                      <span>{entry.role}</span>
                      {entry.href ? (
                        <a href={entry.href} className={`${styles.org} ${styles.link}`} target="_blank" rel="noopener noreferrer">
                          {entry.org} ↗
                        </a>
                      ) : (
                        <span className={styles.org}>{entry.org}</span>
                      )}
                    </div>
                    <p className={`${styles.text} ${styles.muted}`}>{entry.text}</p>
                  </div>
                ))}
              </div>
            </>,
            { style: { width: "min(100%, 680px)" } },
          )}
        </section>

        <section id="contact" className={styles.center}>
          {card(
            "contact",
            "CARD_10",
            ["C10", "GET_IN_TOUCH"],
            <>
              <h2 className={styles.heading}>Let&apos;s build something together.</h2>
              <p className={styles.text}>Whether you&apos;re a fellow builder or just want to chat, I&apos;d love to hear from you.</p>
              <a href="mailto:pranavpappu@u.nus.edu" className={styles.emailButton}>
                <PixelIcon name="mail" />
                <span className={styles.contactText}>
                  <span>Email</span>
                  <span className={styles.contactSub}>pranavpappu@u.nus.edu</span>
                </span>
                <span aria-hidden="true">→</span>
              </a>
              <div className={styles.contactList}>
                {CONTACTS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={styles.contactRow}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                  >
                    <PixelIcon name={item.icon} />
                    <span className={styles.contactText}>
                      <span>{item.label}</span>
                      <span className={styles.contactSub}>{item.detail}</span>
                    </span>
                    <span aria-hidden="true">{item.external ? "↗" : "→"}</span>
                  </a>
                ))}
              </div>
            </>,
            { style: { width: "min(100%, 520px)" } },
          )}
        </section>
      </div>

      <div ref={cursorRef} className={styles.cursor} data-visible={cursorOn} aria-hidden="true">
        <svg width="21" height="21" viewBox="0 0 7 7" shapeRendering="crispEdges">
          <path d="M3 0h1v3H3zM3 4h1v3H3zM0 3h3v1H0zM4 3h3v1H4z" fill="currentColor" />
        </svg>
        {cursorLabel && <span className={styles.cursorTag}>{cursorLabel}</span>}
      </div>
    </div>
  );
}
