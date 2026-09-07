import type { SceneProps } from './registry'
import styles from './EpilogueScene.module.css'

/** Closing: sea gives way to a warm kitchen; the logbook closes. */
export default function EpilogueScene({ progress, reducedMotion }: SceneProps) {
  const p = reducedMotion ? 0.6 : progress
  return (
    <div className={styles.scene} style={{ ['--warm' as string]: String(p) }}>
      <div className={styles.glow} />
      <svg viewBox="0 0 200 140" className={styles.table} aria-hidden="true">
        {/* table surface */}
        <rect x="0" y="96" width="200" height="44" className={styles.wood} />
        <line x1="0" y1="96" x2="200" y2="96" className={styles.edge} />

        {/* closed logbook */}
        <g transform="translate(72 66)">
          <rect x="0" y="0" width="56" height="34" rx="2" className={styles.book} />
          <rect x="0" y="0" width="56" height="34" rx="2" className={styles.bookGrain} />
          <line x1="6" y1="6" x2="50" y2="6" className={styles.bookRule} />
          <circle cx="28" cy="18" r="7" className={styles.crest} />
          <path d="M28 13 l2 5 l-2 5 l-2 -5 z" className={styles.crestStar} />
        </g>

        {/* brass compass beside it */}
        <g transform="translate(140 78)">
          <circle r="9" className={styles.compass} />
          <circle r="6" className={styles.compassInner} />
          <path d="M0 -6 L1.6 0 L0 6 L-1.6 0 Z" className={styles.needle} />
        </g>

        {/* a plate of gulab jamuns being counted */}
        <g transform="translate(30 82)">
          <ellipse cx="14" cy="8" rx="20" ry="6" className={styles.plate} />
          {[4, 12, 20, 24, 10, 18].map((x, i) => (
            <circle key={i} cx={x} cy={6 - (i % 2)} r="3" className={styles.jamun} />
          ))}
        </g>
      </svg>

      <p className={styles.count} aria-hidden="true">
        uno · dos · tres…
      </p>
      <div className={styles.vignette} />
    </div>
  )
}
