import styles from "./DeskStrip.module.css";

const USER = "pranavp311";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

type Day = { date: string; level: number; count: number };
type Calendar = { year: string; total: number; weeks: (Day | null)[][] };

// GitHub's public contribution calendar, re-fetched at most once a day, trimmed to this year.
async function getCalendar(): Promise<Calendar | null> {
  try {
    const res = await fetch(`https://github.com/users/${USER}/contributions`, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const html = await res.text();
    const counts = new Map<string, number>();
    for (const m of html.matchAll(/for="(contribution-day-component-\d+-\d+)"[^>]*>(\d+) contributions? on/g)) {
      counts.set(m[1], Number(m[2]));
    }
    const cells = [...html.matchAll(/data-date="((\d{4})-\d\d-\d\d)" id="(contribution-day-component-(\d+)-(\d+))" data-level="(\d)"/g)];
    const year = cells.at(-1)?.[2];
    if (!year) return null;
    const firstWeek = Math.min(...cells.filter((c) => c[2] === year).map((c) => Number(c[5])));
    const weeks: (Day | null)[][] = [];
    let total = 0;
    for (const [, date, y, id, day, week, level] of cells) {
      const w = Number(week) - firstWeek;
      if (w < 0) continue;
      weeks[w] ??= Array(7).fill(null);
      if (y !== year) continue;
      const count = counts.get(id) ?? 0;
      weeks[w][Number(day)] = { date, level: Number(level), count };
      total += count;
    }
    return { year, total, weeks };
  } catch {
    return null;
  }
}

function label(day: Day) {
  const [, m, d] = day.date.split("-").map(Number);
  const what = day.count === 0 ? "No contributions" : `${day.count} contribution${day.count === 1 ? "" : "s"}`;
  return `${what} on ${MONTHS[m - 1]} ${d}`;
}

// Month label goes on the first week whose first real day is in a new month.
function monthLabels(weeks: (Day | null)[][]) {
  let last = -1;
  return weeks.map((week) => {
    const first = week.find(Boolean);
    const month = first ? Number(first.date.slice(5, 7)) - 1 : -1;
    if (month === last || month < 0) return "";
    last = month;
    return MONTHS[month];
  });
}

export default async function GithubHeatmap({ className }: { className: string }) {
  const calendar = await getCalendar();
  if (!calendar) return null;
  const months = monthLabels(calendar.weeks);
  const columns = { gridTemplateColumns: `28px repeat(${calendar.weeks.length}, minmax(0, 1fr))` };
  return (
    <div className={className}>
      <div className={styles.bar}>
        <span>Contributions · {calendar.year}</span>
        <a href={`https://github.com/${USER}`} className={styles.barLink} target="_blank" rel="noopener noreferrer">
          github ↗
        </a>
      </div>
      <div className={styles.body}>
        <span>
          {calendar.total.toLocaleString("en")} contributions in {calendar.year}
        </span>
        <div className={styles.scroll}>
          <div className={styles.calendar} style={columns}>
            <span />
            {months.map((m, w) => (
              <span key={w} className={styles.month}>
                {m}
              </span>
            ))}
            {DAYS.map((name, d) => (
              <div key={d} className={styles.calRow}>
                <span className={styles.weekday}>{name}</span>
                {calendar.weeks.map((week, w) => {
                  const day = week[d];
                  return day ? (
                    <span key={w} className={styles.day} data-level={day.level} data-tip={label(day)} aria-label={label(day)} />
                  ) : (
                    <span key={w} />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.legend}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={styles.day} data-level={level} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
