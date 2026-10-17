import type { ReactNode } from "react";
import styles from "./ProjectVisuals.module.css";

// Ink follows the theme; accent is the project's colour in colour mode and ink in mono mode.
const INK = { fill: "var(--deck-ink)" };
const ACCENT = { fill: "var(--accent)" };

// Ordered-dither dot patterns at four densities, in ink and accent.
function Dither({ id }: { id: string }) {
  const levels = [
    [[0, 0]],
    [[0, 0], [2, 2]],
    [[0, 0], [2, 2], [2, 0]],
    [[0, 0], [2, 2], [2, 0], [0, 2]],
  ];
  return (
    <defs>
      {(["ink", "accent"] as const).map((tone) =>
        levels.map((dots, i) => (
          <pattern key={`${tone}${i}`} id={`${id}-${tone}${i + 1}`} width="4" height="4" patternUnits="userSpaceOnUse">
            {dots.map(([x, y]) => (
              <rect key={`${x}${y}`} x={x} y={y} width="1.6" height="1.6" style={tone === "ink" ? INK : ACCENT} />
            ))}
          </pattern>
        )),
      )}
    </defs>
  );
}

function Mock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.mock} aria-hidden="true">
      <div className={styles.mockBar}>{title}</div>
      <div className={styles.mockBody}>{children}</div>
    </div>
  );
}

// Reference site in, three deterministic stages, a distinct brand site out, approved by a human.
const CARD = { fill: "var(--deck-card)" };
const STAGES = ["clone", "adapt", "check"];

function SiteWireframe({ x, label, brand }: { x: number; label: string; brand: boolean }) {
  const tone = (level: number) => ({ fill: `url(#tw-${brand ? "accent" : "ink"}${level})` });
  return (
    <g>
      <text x={x} y="34" className={styles.svgSmall}>{label}</text>
      <rect x={x} y="42" width="112" height="156" style={CARD} stroke="var(--deck-ink)" strokeWidth="2" />
      <rect x={x} y="42" width="112" height="14" style={brand ? ACCENT : INK} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 8 + i * 8} cy="49" r="2.2" style={CARD} />
      ))}
      <rect x={x + 10} y="66" width={brand ? 74 : 62} height="11" style={INK} />
      <rect x={x + 10} y="82" width="86" height="4" style={INK} opacity="0.45" />
      <rect x={x + 10} y="90" width="70" height="4" style={INK} opacity="0.45" />
      <rect x={x + 10} y="102" width={brand ? 44 : 92} height="46" style={tone(2)} stroke="var(--deck-ink)" strokeOpacity="0.5" />
      {brand && <rect x={x + 60} y="102" width="42" height="46" style={tone(1)} stroke="var(--deck-ink)" strokeOpacity="0.5" />}
      <rect x={x + 10} y="156" width="42" height="32" style={tone(1)} stroke="var(--deck-ink)" strokeOpacity="0.5" />
      <rect x={x + 60} y="156" width="42" height="32" style={brand ? ACCENT : tone(1)} stroke="var(--deck-ink)" strokeOpacity="0.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={x + i * 23}
          y="214"
          width="19"
          height="19"
          style={brand && i === 0 ? ACCENT : i === 4 ? CARD : tone(4 - i)}
          stroke="var(--deck-ink)"
        />
      ))}
    </g>
  );
}

function Tweakler() {
  return (
    <>
      <svg className={styles.layer} viewBox="0 0 400 300" role="img" aria-label="Tweakler: a reference site goes through clone, adapt and check stages and comes out as a distinct, human-approved brand site">
        <Dither id="tw" />
        <SiteWireframe x={12} label="reference" brand={false} />
        <SiteWireframe x={276} label="brand site" brand />
        <rect x="140" y="42" width="120" height="156" style={CARD} stroke="var(--deck-ink)" strokeWidth="2" />
        <rect x="140" y="42" width="120" height="20" style={INK} />
        <text x="200" y="57" textAnchor="middle" className={styles.svgSmall} style={{ fill: "var(--deck-card)" }}>tweakler</text>
        {STAGES.map((stage, i) => {
          const y = 74 + i * 38;
          return (
            <g key={stage}>
              <rect x="150" y={y} width="100" height="26" style={CARD} stroke="var(--deck-ink)" strokeWidth="1.5" />
              <rect x="151" y={y + 1} width="9" height="24" style={{ fill: `url(#tw-ink${i + 2})` }} />
              <text x="168" y={y + 18} className={styles.svgSmall}>{stage}</text>
              <path d={`M232 ${y + 13} l4 5 l8 -10`} fill="none" stroke="var(--deck-ink)" strokeWidth="2" />
              {i < 2 && <path d={`M200 ${y + 26} V${y + 38}`} stroke="var(--deck-ink)" strokeWidth="1.5" />}
            </g>
          );
        })}
        <path d="M124 120 H140 M260 120 H276" stroke="var(--deck-ink)" strokeWidth="2" />
        <path d="M269 114 L276 120 L269 126" fill="none" stroke="var(--deck-ink)" strokeWidth="2" />
        <path d="M120 224 C 170 262, 230 262, 276 224" fill="none" stroke="var(--deck-ink)" strokeDasharray="2 3" />
        <path d="M268 222 L277 223 L273 231" fill="none" stroke="var(--deck-ink)" strokeWidth="1.5" />
        <text x="200" y="268" textAnchor="middle" className={styles.svgSmall}>palette remap</text>
      </svg>
      <Mock title="REVIEW">
        <div className={styles.compare}>
          <div className={styles.thumb}>
            <span className={styles.thumbBar} />
            <span className={styles.thumbLine} />
            <span className={styles.thumbBlock} />
            <span className={styles.dim}>reference</span>
          </div>
          <span aria-hidden="true">→</span>
          <div className={`${styles.thumb} ${styles.thumbBrand}`}>
            <span className={styles.thumbBar} />
            <span className={styles.thumbLine} />
            <span className={styles.thumbBlock} />
            <span className={styles.dim}>new site</span>
          </div>
        </div>
        <div className={styles.actions}>
          <span className={styles.ghostButton}>changes</span>
          <span className={styles.solidButton}>approve ✓</span>
        </div>
      </Mock>
    </>
  );
}

const PII_TYPES = ["NAME", "PHONE", "EMAIL", "NRIC", "ADDR", "CARD", "DOB", "IBAN", "IP", "PASS", "MED", "GEO"];
const DETECTED = new Set(["NAME", "PHONE"]);

function SecureClaw() {
  return (
    <>
      <svg className={styles.layer} viewBox="0 0 400 300" role="img" aria-label="SecureClaw: personal data in a prompt is detected and kept on device; prompts without it go to the cloud">
        <Dither id="sc" />
        <rect x="64" y="12" width="272" height="30" style={{ fill: "var(--deck-card)" }} stroke="var(--deck-ink)" strokeWidth="2" />
        <text x="76" y="32" className={styles.svgSmall}>text</text>
        <rect x="108" y="19" width="34" height="16" style={ACCENT} />
        <text x="112" y="32" className={styles.svgSmall} style={{ fill: "var(--deck-card)" }}>Sam</text>
        <text x="148" y="32" className={styles.svgSmall}>at</text>
        <rect x="168" y="19" width="88" height="16" style={ACCENT} />
        <text x="172" y="32" className={styles.svgSmall} style={{ fill: "var(--deck-card)" }}>+65 9•••</text>
        <text x="262" y="32" className={styles.svgSmall}>today</text>
        <path d="M125 42 V50 M212 42 V50" stroke="var(--accent)" strokeWidth="1.5" />
        <rect x="104" y="50" width="42" height="13" fill="none" stroke="var(--accent)" />
        <text x="108" y="60" className={styles.svgTiny}>NAME</text>
        <rect x="190" y="50" width="44" height="13" fill="none" stroke="var(--accent)" />
        <text x="193" y="60" className={styles.svgTiny}>PHONE</text>
        <path d="M200 63 V84" stroke="var(--deck-ink)" strokeWidth="2" />
        <path d="M200 84 L232 108 L200 132 L168 108 Z" style={{ fill: "url(#sc-ink2)" }} stroke="var(--deck-ink)" strokeWidth="2" />
        <rect x="184" y="99" width="32" height="18" style={{ fill: "var(--deck-card)" }} />
        <text x="188" y="113" className={styles.svgSmall}>PII?</text>
        <path d="M168 108 H82 V156" fill="none" stroke="var(--accent)" strokeWidth="4" />
        <text x="96" y="100" className={styles.svgSmall}>yes · local</text>
        <path d="M232 108 H316 V164" fill="none" stroke="var(--deck-ink)" strokeWidth="2" strokeDasharray="4 4" />
        <text x="246" y="100" className={styles.svgSmall}>no · cloud</text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x="308" y={118 + i * 12} width="16" height="8" style={{ fill: "url(#sc-ink3)" }} stroke="var(--deck-ink)" />
        ))}
        <rect x="44" y="156" width="76" height="110" rx="10" style={{ fill: "var(--deck-card)" }} stroke="var(--deck-ink)" strokeWidth="2" />
        <rect x="54" y="172" width="56" height="70" style={{ fill: "url(#sc-accent1)" }} stroke="var(--deck-ink)" />
        <path d="M54 186 H68 V194 M110 186 H96 M54 228 H66 V220 M110 230 H98 V222 M82 172 V180 M82 242 V234" fill="none" stroke="var(--deck-ink)" strokeWidth="1.5" />
        <rect x="68" y="194" width="28" height="26" style={ACCENT} />
        <path d="M74 194 v-4 M82 194 v-4 M90 194 v-4 M74 220 v4 M82 220 v4 M90 220 v4" stroke="var(--deck-ink)" strokeWidth="2" />
        <path d="M72 254 H92" stroke="var(--deck-ink)" strokeWidth="2" />
        <text x="30" y="288" className={styles.svgSmall}>on-device 270M</text>
        <path d="M100 150 l10 -5 l10 5 v8 q0 8 -10 13 q-10 -5 -10 -13 Z" style={{ fill: "var(--deck-card)" }} stroke="var(--deck-ink)" strokeWidth="2" />
        <path d="M105 158 l4 4 l7 -8" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <path d="M274 212 a18 18 0 0 1 12 -30 a26 26 0 0 1 50 4 a18 18 0 0 1 4 34 H286 a14 14 0 0 1 -12 -8 Z" style={{ fill: "url(#sc-ink1)" }} stroke="var(--deck-ink)" strokeWidth="2" />
        <text x="282" y="248" className={styles.svgSmall}>cloud model</text>
        <text x="142" y="190" className={styles.svgSmall}>12 pii types</text>
        {PII_TYPES.map((type, i) => {
          const x = 142 + (i % 3) * 38;
          const y = 198 + Math.floor(i / 3) * 21;
          const hit = DETECTED.has(type);
          return (
            <g key={type}>
              <rect x={x} y={y} width="34" height="17" style={hit ? ACCENT : { fill: "url(#sc-ink1)" }} stroke="var(--deck-ink)" />
              <rect x={x + 2} y={y + 3} width="30" height="11" style={hit ? ACCENT : { fill: "var(--deck-card)" }} />
              <text x={x + 17} y={y + 12} textAnchor="middle" className={styles.svgTiny} style={hit ? { fill: "var(--deck-card)" } : undefined}>
                {type}
              </text>
            </g>
          );
        })}
      </svg>
      <Mock title="SECURECLAW · CHAT">
        <div className={styles.bubble}>
          <span>text Sam at +65 9…</span>
          <b className={styles.local}>LOCAL</b>
        </div>
        <div className={styles.bubble}>
          <span>summarise this paper</span>
          <b className={styles.cloud}>CLOUD</b>
        </div>
        <div className={styles.bubble}>
          <span>my NRIC is S…</span>
          <b className={styles.local}>LOCAL</b>
        </div>
      </Mock>
    </>
  );
}

// Fixed "fitness" landscape for the quality-diversity archive.
const ARCHIVE = Array.from({ length: 70 }, (_, i) => {
  const x = i % 10;
  const y = Math.floor(i / 10);
  const v = Math.sin(x * 0.7) + Math.cos(y * 0.9 + x * 0.3) + (6 - y) * 0.35;
  return { x, y, level: Math.max(0, Math.min(4, Math.round(v + 1))) };
});
const ELITES = new Set([13, 26, 41, 58]);

function EvoServe() {
  return (
    <>
      <svg className={styles.layer} viewBox="0 0 400 300" role="img" aria-label="Quality-diversity archive of policy candidates">
        <Dither id="evo" />
        {ARCHIVE.map(({ x, y, level }, i) => {
          const elite = ELITES.has(i);
          return (
            <rect
              key={i}
              x={54 + x * 32}
              y={22 + y * 32}
              width="28"
              height="28"
              style={elite ? ACCENT : level ? { fill: `url(#evo-ink${level})` } : undefined}
              fill={elite || level ? undefined : "none"}
              stroke="var(--deck-ink)"
              strokeOpacity={elite ? 1 : 0.25}
            />
          );
        })}
        <text x="54" y="16" className={styles.svgText}>↑ quality</text>
        <text x="54" y="270" className={styles.svgText}>diversity →</text>
      </svg>
      <Mock title="EVOSERVE · CANDIDATES">
        <div className={`${styles.row} ${styles.dim}`}>
          <span>recipe</span>
          <span>score</span>
          <span>check</span>
        </div>
        {[
          ["recipe-a", 0.9, true],
          ["recipe-b", 0.72, true],
          ["recipe-c", 0.46, false],
        ].map(([name, width, ok]) => (
          <div key={name as string} className={`${styles.row} ${ok ? "" : styles.flag}`}>
            <span>{name}</span>
            <span className={styles.bar}>
              <span style={{ width: `${(width as number) * 100}%` }} />
            </span>
            <b className={ok ? styles.ok : styles.bad}>{ok ? "✓" : "✗"}</b>
          </div>
        ))}
      </Mock>
    </>
  );
}

// Causal attention weights: strong on the diagonal, fading into the past.
const ATTENTION = Array.from({ length: 144 }, (_, i) => {
  const r = Math.floor(i / 12);
  const c = i % 12;
  if (c > r) return { r, c, level: -1 };
  const w = Math.exp(-(r - c) / 3) * (0.6 + 0.4 * Math.abs(Math.sin(c * 1.7 + r * 0.4)));
  return { r, c, level: Math.min(4, Math.round(w * 4)) };
});
const TOKENS = ["Hello", ",", "I'm", "a", "lang", "model"];

function Gpt2() {
  const plate = (y: number) => `M206 ${y} H326 L352 ${y - 14} H232 Z`;
  return (
    <>
      <svg className={styles.layer} viewBox="0 0 400 300" role="img" aria-label="GPT-2: causal attention matrix feeding a 12-layer transformer stack">
        <Dither id="gpt" />
        <text x="24" y="40" className={styles.svgText}>attn · causal</text>
        {ATTENTION.map(({ r, c, level }) => (
          <rect
            key={r * 12 + c}
            x={24 + c * 12}
            y={50 + r * 12}
            width="11"
            height="11"
            style={level === 4 ? ACCENT : level > 0 ? { fill: `url(#gpt-ink${level})` } : undefined}
            fill={level > 0 ? undefined : "none"}
            stroke="var(--deck-ink)"
            strokeOpacity={level < 0 ? 0.12 : 0.3}
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => {
          const y = 236 - i * 14;
          return (
            <g key={i}>
              <path d={`M206 ${y} V${y + 5} H326 V${y}`} style={INK} />
              <path d={plate(y)} style={i === 7 ? ACCENT : { fill: `url(#gpt-ink${i % 2 ? 1 : 2})` }} stroke="var(--deck-ink)" />
              <path d={`M266 ${y} L292 ${y - 14}`} stroke="var(--deck-ink)" strokeOpacity="0.5" />
            </g>
          );
        })}
        <text x="358" y="230" className={styles.svgText}>×12</text>
        <path d="M192 236 V84 M186 94 L192 84 L198 94" fill="none" stroke="var(--deck-ink)" strokeWidth="2" />
        <rect x="240" y="44" width="84" height="22" style={ACCENT} />
        <text x="250" y="60" className={styles.svgText} style={{ fill: "var(--deck-card)" }}>next tok</text>
        <path d="M280 66 V74" stroke="var(--deck-ink)" strokeWidth="2" />
        {TOKENS.map((t, i) => (
          <g key={t + i}>
            <rect x={24 + i * 60} y="258" width="54" height="22" style={{ fill: "var(--deck-card)" }} stroke="var(--deck-ink)" strokeWidth="1.5" />
            <text x={32 + i * 60} y="274" className={styles.svgText}>{t}</text>
          </g>
        ))}
        <path d="M24 252 H372 M266 252 V242" fill="none" stroke="var(--deck-ink)" strokeDasharray="2 3" />
      </svg>
      <Mock title="GPT2 · SAMPLE">
        <span>&gt; Hello, I&apos;m a language model,</span>
        <span className={styles.dim}>next token</span>
        {[
          ["and", 0.82],
          ["but", 0.55],
          ["not", 0.34],
          ["so", 0.2],
        ].map(([token, p]) => (
          <div key={token as string} className={styles.row}>
            <span className={styles.token}>{token}</span>
            <span className={styles.bar}>
              <span style={{ width: `${(p as number) * 100}%` }} />
            </span>
          </div>
        ))}
      </Mock>
    </>
  );
}

const DOMAINS = ["motor", "language", "social", "cognitive", "self-care"];
const SCORES = [0.82, 0.55, 0.7, 0.46, 0.64];
const point = (i: number, r: number) => {
  const a = (-90 + i * 72) * (Math.PI / 180);
  return [150 + Math.cos(a) * r * 60, 136 + Math.sin(a) * r * 60];
};
const ring = (r: number) => DOMAINS.map((_, i) => point(i, r).map((n) => n.toFixed(1)).join(" ")).join(" ");

function AssessMate() {
  const profile = SCORES.map((v, i) => point(i, v).map((n) => n.toFixed(1)).join(" ")).join(" ");
  return (
    <>
      <svg className={styles.layer} viewBox="0 0 400 300" role="img" aria-label="AssessMate: a five-domain development profile beside stacked case notes">
        <Dither id="am" />
        {[0.33, 0.66, 1].map((r) => (
          <polygon key={r} points={ring(r)} fill="none" stroke="var(--deck-ink)" strokeOpacity="0.45" strokeDasharray={r < 1 ? "3 3" : undefined} />
        ))}
        {DOMAINS.map((_, i) => {
          const [x, y] = point(i, 1);
          return <path key={i} d={`M150 136 L${x.toFixed(1)} ${y.toFixed(1)}`} stroke="var(--deck-ink)" strokeOpacity="0.35" />;
        })}
        <polygon points={profile} style={{ fill: "url(#am-accent3)" }} stroke="var(--accent)" strokeWidth="2.5" />
        {SCORES.map((v, i) => {
          const [x, y] = point(i, v);
          return <rect key={i} x={x - 3} y={y - 3} width="6" height="6" style={INK} />;
        })}
        {DOMAINS.map((d, i) => {
          const [x, y] = point(i, 1.16);
          const side = x - 150;
          return (
            <text key={d} x={x} y={y + 4} textAnchor={side > 20 ? "start" : side < -20 ? "end" : "middle"} className={styles.svgSmall}>
              {d}
            </text>
          );
        })}
        <rect x="308" y="30" width="84" height="150" style={{ fill: "url(#am-ink1)" }} stroke="var(--deck-ink)" />
        <rect x="296" y="44" width="88" height="150" style={{ fill: "url(#am-ink2)" }} stroke="var(--deck-ink)" />
        <rect x="284" y="58" width="92" height="160" style={{ fill: "var(--deck-card)" }} stroke="var(--deck-ink)" strokeWidth="2" />
        <rect x="284" y="58" width="92" height="18" style={INK} />
        <text x="290" y="72" className={styles.svgSmall} style={{ fill: "var(--deck-card)" }}>NOTE_03</text>
        {[88, 104, 120, 136, 152, 168, 184, 200].map((y, i) => (
          <g key={y}>
            <rect x="290" y={y} width="8" height="8" fill="none" stroke="var(--deck-ink)" />
            {i < 5 && <path d={`M291 ${y + 4} l2 3 l4 -6`} fill="none" stroke="var(--deck-ink)" strokeWidth="1.5" />}
            <rect x="304" y={y + 2} width={[62, 48, 64, 40, 56, 60, 44, 52][i]} height="5" style={i === 3 ? ACCENT : INK} opacity={i === 3 ? 1 : 0.7} />
          </g>
        ))}
        <path d="M28 266 H380" stroke="var(--deck-ink)" strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={40 + i * 66}
            y="259"
            width="14"
            height="14"
            style={i < 3 ? INK : i === 3 ? ACCENT : { fill: "var(--deck-card)" }}
            stroke="var(--deck-ink)"
            strokeWidth="1.5"
          />
        ))}
        <text x="28" y="292" className={styles.svgSmall}>sessions →</text>
      </svg>
      <Mock title="ASSESSMATE · NOTE">
        <div className={styles.field}>
          <span className={styles.dim}>domain</span>
          <span>Fine motor</span>
        </div>
        <div className={styles.field}>
          <span className={styles.dim}>observed</span>
          <span className={styles.mark}>Stacks blocks with support</span>
        </div>
        <div className={styles.field}>
          <span className={styles.dim}>next</span>
          <span>Practise pincer grasp</span>
        </div>
        <div className={styles.actions}>
          <span className={styles.ghostButton}>edit</span>
          <span className={styles.solidButton}>sign off ✓</span>
        </div>
      </Mock>
    </>
  );
}

function Moltlytics() {
  const trails = [
    "M44 250 C70 200 90 210 120 170 S170 120 196 104",
    "M286 236 C260 200 250 170 236 150 S214 116 204 108",
    "M60 120 C90 116 130 130 150 118 S186 104 198 104",
  ];
  return (
    <>
      <svg className={styles.layer} viewBox="0 0 400 300" role="img" aria-label="Moltlytics: click trails and heatmap on a page, with the adapted variant">
        <Dither id="mol" />
        <rect x="20" y="22" width="284" height="252" style={{ fill: "var(--deck-card)" }} stroke="var(--deck-ink)" strokeWidth="2" />
        <rect x="20" y="22" width="284" height="20" style={INK} />
        {[32, 44, 56].map((x) => (
          <circle key={x} cx={x} cy="32" r="3.5" style={{ fill: "var(--deck-card)" }} />
        ))}
        <rect x="72" y="27" width="150" height="10" style={{ fill: "var(--deck-card)" }} opacity="0.85" />
        <rect x="36" y="58" width="132" height="12" style={INK} />
        <rect x="36" y="76" width="104" height="7" style={INK} opacity="0.45" />
        <rect x="36" y="88" width="118" height="7" style={INK} opacity="0.45" />
        <rect x="170" y="94" width="66" height="22" fill="none" stroke="var(--deck-ink)" strokeWidth="2" />
        <rect x="200" y="52" width="88" height="34" style={{ fill: "url(#mol-ink1)" }} stroke="var(--deck-ink)" strokeOpacity="0.5" />
        {[36, 124, 212].map((x) => (
          <g key={x}>
            <rect x={x} y="150" width="76" height="62" fill="none" stroke="var(--deck-ink)" strokeOpacity="0.55" />
            <rect x={x + 8} y="196" width="40" height="5" style={INK} opacity="0.45" />
          </g>
        ))}
        <rect x="36" y="226" width="252" height="34" style={{ fill: "url(#mol-ink1)" }} opacity="0.7" />
        <circle cx="203" cy="105" r="44" style={{ fill: "url(#mol-accent1)" }} />
        <circle cx="203" cy="105" r="26" style={{ fill: "url(#mol-accent3)" }} />
        <circle cx="203" cy="105" r="12" style={ACCENT} />
        <circle cx="96" cy="70" r="24" style={{ fill: "url(#mol-accent2)" }} />
        <circle cx="160" cy="182" r="18" style={{ fill: "url(#mol-accent1)" }} />
        {trails.map((d) => (
          <path key={d} d={d} fill="none" stroke="var(--deck-ink)" strokeWidth="1.5" strokeDasharray="1 4" strokeLinecap="round" />
        ))}
        <path d="M200 100 l0 14 l4 -4 l3 6 l2 -1 l-3 -6 h5 z" style={INK} stroke="var(--deck-card)" strokeWidth="0.8" />
        <rect x="314" y="42" width="12" height="214" fill="none" stroke="var(--deck-ink)" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="315" y={43 + i * 53} width="10" height="53" style={{ fill: `url(#mol-ink${4 - i})` }} />
        ))}
        <path d="M308 116 H332" stroke="var(--accent)" strokeWidth="2" />
        <text x="334" y="120" className={styles.svgSmall}>fold</text>
        <rect x="342" y="160" width="40" height="44" fill="none" stroke="var(--deck-ink)" />
        <rect x="348" y="186" width="18" height="7" fill="none" stroke="var(--deck-ink)" />
        <text x="346" y="154" className={styles.svgSmall}>A</text>
        <path d="M362 210 V222 M357 217 L362 222 L367 217" fill="none" stroke="var(--deck-ink)" strokeWidth="1.5" />
        <rect x="342" y="228" width="40" height="44" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
        <rect x="348" y="236" width="18" height="7" style={ACCENT} />
        <text x="346" y="290" className={styles.svgSmall}>B</text>
      </svg>
      <Mock title="MOLTLYTICS · A/B">
        <div className={styles.row}>
          <span className={styles.token}>A</span>
          <span className={styles.bar}>
            <span style={{ width: "48%", background: "var(--deck-ink)" }} />
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.token}>B</span>
          <span className={styles.bar}>
            <span style={{ width: "86%" }} />
          </span>
        </div>
        <span className={styles.dim}>B: CTA above the fold</span>
      </Mock>
    </>
  );
}

const VISUALS: Record<string, () => ReactNode> = {
  tweakler: Tweakler,
  secureclaw: SecureClaw,
  evoserve: EvoServe,
  gpt2: Gpt2,
  assessmate: AssessMate,
  moltlytics: Moltlytics,
};

export default function ProjectVisual({ id }: { id: string }) {
  const Visual = VISUALS[id];
  return (
    <div className={styles.visual} data-visual>
      <Visual />
    </div>
  );
}
