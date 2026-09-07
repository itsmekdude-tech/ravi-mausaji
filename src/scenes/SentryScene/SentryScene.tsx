import type { SceneProps } from '../registry'
import styles from './SentryScene.module.css'

const PANELS = [
  { id: 'gate', cap: 'One night, the naval checkpoint. A drunk man tries to enter; the sentries are women.' },
  { id: 'slap', cap: 'Two tight slaps. He staggers back — and comes again.', pow: 'SLAP!' },
  { id: 'ear', cap: 'She takes him by the ears and hauls him inside.', pow: 'OW!' },
]

/**
 * Chapter 3 — the sentry's discipline, told in cel-shaded comic panels
 * revealed one by one as you scroll.
 */
export default function SentryScene({ progress, reducedMotion }: SceneProps) {
  const p = reducedMotion ? 1 : progress
  const shown = Math.min(PANELS.length, Math.floor(p * 3.4) + 1)

  return (
    <div className={styles.scene}>
      <div className={styles.harbourGlow} aria-hidden="true" />

      <div className={styles.strip}>
        {PANELS.map((panel, i) => (
          <figure
            key={panel.id}
            className={`${styles.panel} ${i < shown ? styles.on : ''}`}
          >
            <div className={`${styles.art} ${styles[panel.id]}`}>
              <SentryArt kind={panel.id} />
              {panel.pow && i < shown && <span className={styles.pow}>{panel.pow}</span>}
            </div>
            <figcaption className={styles.cap}>{panel.cap}</figcaption>
          </figure>
        ))}
      </div>

      <div className={styles.translation}>
        <span className={styles.translationLabel}>Translation</span>
        “That bloody idiot is my husband!”
      </div>

      <div className={styles.vignette} />
    </div>
  )
}

function SentryArt({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 100 100" className={styles.svg} aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" className={styles.bg} />
      <circle cx="50" cy="24" r="10" className={styles.lamp} />
      <rect x="46" y="34" width="8" height="40" className={styles.post} />
      {/* sentry */}
      <g className={styles.sentry}>
        <circle cx="34" cy="52" r="7" className={styles.head} />
        <rect x="28" y="59" width="12" height="24" className={styles.body} />
        {kind !== 'gate' && (
          <line x1="40" y1="64" x2="58" y2="58" className={styles.arm} />
        )}
      </g>
      {/* drunk */}
      <g className={styles.drunk} transform={kind === 'ear' ? 'translate(-6 4) rotate(-8 60 60)' : ''}>
        <circle cx="64" cy="56" r="6" className={styles.head2} />
        <rect x="59" y="62" width="10" height="22" className={styles.body2} />
      </g>
    </svg>
  )
}
