import styles from './SetSailButton.module.css'

/** HUD launcher for the island mini-game. */
export function SetSailButton({ onClick }: { onClick: () => void }) {
  return (
    <button className={styles.btn} onClick={onClick} title="Explore the islands">
      <span className={styles.anchor} aria-hidden="true">
        ⚓
      </span>
      <span className={styles.label}>Set sail</span>
    </button>
  )
}
