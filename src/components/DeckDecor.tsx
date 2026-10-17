import styles from "./DeckDecor.module.css";

// Ink-print marks in the margins, like the edges of a print sheet: registration targets, crop
// marks, colour bars and a slug-line ruler.
type Mark = "reg" | "crop" | "bars" | "ruler";

// [mark, left %, top %, size px]
const MARKS: [Mark, number, number, number][] = [
  ["reg", 4, 2, 28],
  ["bars", 88, 3, 120],
  ["crop", 3, 12, 26],
  ["ruler", 1.5, 18, 160],
  ["crop", 93, 22, 26],
  ["reg", 94, 36, 24],
  ["ruler", 96, 44, 160],
  ["bars", 2, 47, 120],
  ["crop", 5, 56, 26],
  ["reg", 3, 68, 26],
  ["crop", 94, 76, 26],
  ["bars", 87, 86, 120],
  ["ruler", 1.5, 86, 160],
  ["reg", 93, 95, 28],
];

// Rulers are tall and thin, colour bars wide and short, the rest square.
const SIZE: Record<Mark, (n: number) => { width: number; height: number }> = {
  reg: (n) => ({ width: n, height: n }),
  crop: (n) => ({ width: n, height: n }),
  bars: (n) => ({ width: n, height: 14 }),
  ruler: (n) => ({ width: 10, height: n }),
};

const BAR_TONES = [4, 3, 2, 1, 0, 1, 2, 3];

function MarkSvg({ mark }: { mark: Mark }) {
  switch (mark) {
    case "reg":
      return (
        <svg viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="8" fill="none" stroke="currentColor" />
          <circle cx="14" cy="14" r="3" fill="currentColor" />
          <path d="M14 0V28M0 14H28" stroke="currentColor" />
        </svg>
      );
    case "crop":
      return (
        <svg viewBox="0 0 26 26">
          <path d="M0 8H18V26M8 0V18H26" fill="none" stroke="currentColor" />
        </svg>
      );
    case "bars":
      return (
        <span className={styles.bars}>
          {BAR_TONES.map((t, i) => (
            <span key={i} data-tone={t} />
          ))}
        </span>
      );
    default:
      return <span className={styles.ruler} />;
  }
}

export default function DeckDecor() {
  return (
    <div className={styles.decor} aria-hidden="true">
      {MARKS.map(([mark, left, top, size], i) => (
        <span key={i} className={styles.mark} style={{ left: `${left}%`, top: `${top}%`, ...SIZE[mark](size) }}>
          <MarkSvg mark={mark} />
        </span>
      ))}
    </div>
  );
}
