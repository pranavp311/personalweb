"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
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
    name: "LOCAL SMALL LM",
    accent: ["#2f5bd3", "#8fb0ff"],
    text: "Built a custom GPT-2 124M variant from scratch in PyTorch on local hardware, including the tokenizer, transformer blocks, optimizer, mixed-precision training, and FineWeb-Edu evaluation. Trained on 10B tokens.",
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
    points: [
      "Built meeting intelligence that turns recordings into secure transcripts, action items, and searchable company knowledge for Launchpad, Mission Systems' AI operations platform for hospitality businesses.",
      "Building a secure internal workflow automation platform to replace fourteen production n8n workflows.",
    ],
  },
  {
    role: "Co-founder & CTO",
    org: "/AssessMate",
    points: [
      "Building an AI case-notes copilot for structured documentation with early childhood intervention assessors.",
      <>
        <ExternalLink href="https://www.ccsgp.comp.nus.edu.sg/">CCSGP Fellow</ExternalLink> at NUS Computing for
        Social Good.
      </>,
    ],
  },
  {
    role: "Research Assistant",
    org: "/Prof. Ooi Wei Tsang, NUS Computing",
    points: ["Built a dynamic 3D Gaussian Splatting benchmark across multiple methods and datasets with repeatable quality and performance reports."],
  },
  {
    role: "Founder",
    org: "/Tweakler",
    points: [
      "Building an agent-driven system that turns permissioned website references into distinct, brand-oriented sites with deterministic validation and human approval gates.",
      <>
        Already being used and tested by a few studios, including{" "}
        <ExternalLink href="https://brightseastudio.com/">Brightsea Studio</ExternalLink>.
      </>,
    ],
  },
];

const hackathons = [
  {
    event: "Replit Agent Hackathon (Singapore)",
    place: "1ST",
    points: ["Built Remember \u2014 an AR smart glasses simulator for dementia patients with real-time face recognition, contextual information overlay, and a personal knowledge graph powered by live speech extraction."],
    github: "https://github.com/Fiyxxx/remember",
    win: true,
  },
  {
    event: "Google DeepMind \u00d7 Cactus Compute Hackathon",
    place: "2ND",
    points: ["Built SecureClaw \u2014 a privacy-first on-device AI assistant using FunctionGemma with smart cloud fallback, PII detection, and local-vs-cloud routing."],
    github: "https://github.com/pranavp311/secureclaw",
    win: true,
  },
  {
    event: "NVIDIA Nemotron Model Reasoning Challenge",
    place: "TOP 30%",
    points: [
      "Used a MAP-Elites-style search over fine-tuning recipes, then trained a rank-32 attention LoRA on 14,400 solver-generated reasoning traces for Nemotron-3-Nano-30B.",
      "Placed in the 70th percentile in a field of 5,223 participants.",
    ],
    win: false,
  },
  {
    event: "Hack&Roll 2026",
    place: "\u2014",
    points: ["Built JustPromptBro \u2014 a VSCode extension with event-driven keystroke tracking, real-time behavioural feedback, and a Solana smart contract for on-chain game logic."],
    github: "https://github.com/Fiyxxx/justpromptbro",
    win: false,
  },
  {
    event: "Jane Street Kaggle Competition",
    place: "\u2014",
    points: ["Built a neural network from scratch and leveraged XGBoost for time-series forecasting on unlabelled market data to predict prices 6 months ahead."],
    win: false,
  },
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

// A section in the style of a print panel: a black label chip, a left rule, and a dot-textured
// field the cards sit on.
function Panel({ id, label, bodyClass, children }: { id: string; label: string; bodyClass: string; children: ReactNode }) {
  return (
    <section id={id} className={styles.panel}>
      <span className={styles.panelLabel}>{label}</span>
      <div className={`${styles.panelBody} ${bodyClass}`}>{children}</div>
    </section>
  );
}

function Points({ items }: { items: ReactNode[] }) {
  return (
    <ul className={styles.points}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

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
      <div className={styles.stack}>
        <Panel id="about" label="About" bodyClass={styles.pair}>
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
        </Panel>

        <Panel id="projects" label="Projects" bodyClass={styles.projects}>
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
        </Panel>

        <Panel id="experience" label="Experience" bodyClass={styles.pair}>
          {card(
            "wins",
            "CARD_09",
            ["C9", "WINS"],
            <div className={styles.rows}>
              {hackathons.map((hack) => (
                <div key={hack.event} className={styles.row}>
                  <div className={styles.rowHead}>
                    <span className={hack.win ? styles.chipSolid : styles.chip}>{hack.place}</span>
                    <span>{hack.event}</span>
                  </div>
                  <Points items={hack.points} />
                  {hack.github && (
                    <div className={styles.rowLink}>
                      <ExternalLink href={hack.github}>/github ↗</ExternalLink>
                    </div>
                  )}
                </div>
              ))}
            </div>,
            { className: styles.lead },
          )}
          {card(
            "roles",
            "CARD_10",
            ["C10", "ROLES"],
            <div className={styles.rows}>
              {roles.map((entry) => (
                <div key={entry.role} className={styles.row}>
                  <div className={styles.rowHead}>
                    <span className={styles.chipSolid}>{entry.role}</span>
                    {entry.href ? (
                      <ExternalLink href={entry.href}>{entry.org.slice(1)} ↗</ExternalLink>
                    ) : (
                      <span>{entry.org.slice(1)}</span>
                    )}
                  </div>
                  <Points items={entry.points} />
                </div>
              ))}
            </div>,
            { className: styles.follow },
          )}
        </Panel>

        <Panel id="contact" label="Contact" bodyClass={styles.center}>
          {card(
            "contact",
            "CARD_11",
            ["C11", "GET_IN_TOUCH"],
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
        </Panel>
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
