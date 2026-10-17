import GithubHeatmap from "./GithubHeatmap";
import styles from "./DeskStrip.module.css";

export default function DeskStrip() {
  return (
    <section className={styles.strip} aria-label="Activity">
      <GithubHeatmap className={styles.window} />
    </section>
  );
}
