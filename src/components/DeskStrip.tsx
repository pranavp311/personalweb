import GithubHeatmap from "./GithubHeatmap";
import deck from "./CardDeck.module.css";
import styles from "./DeskStrip.module.css";

export default function DeskStrip() {
  return (
    <div className={styles.strip}>
      <section className={deck.panel} aria-label="Activity">
        <span className={deck.panelLabel}>Activity</span>
        <div className={deck.panelBody}>
          <GithubHeatmap className={styles.window} />
        </div>
      </section>
    </div>
  );
}
