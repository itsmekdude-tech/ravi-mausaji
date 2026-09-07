import styles from './SceneFallback.module.css'

/** Quiet placeholder shown while a lazy scene chunk loads. */
export function SceneFallback() {
  return (
    <div className={styles.fallback} aria-hidden="true">
      <div className={styles.compass} />
    </div>
  )
}
