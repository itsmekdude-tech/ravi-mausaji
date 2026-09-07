import { useMemo } from 'react'
import type { SceneProps } from './registry'
import styles from './PrologueScene.module.css'

/** Opening: a starlit sea, a rising moon, a ship slipping out of harbour. */
export default function PrologueScene({ progress, reducedMotion }: SceneProps) {
  const p = reducedMotion ? 0.3 : progress
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }).map((_, i) => ({
        x: (i * 97.13) % 100,
        y: (i * 61.7) % 62,
        r: ((i * 13) % 3) * 0.4 + 0.3,
        tw: (i % 5) * 0.6,
      })),
    [],
  )

  return (
    <div className={styles.scene}>
      <div
        className={styles.sky}
        style={{ transform: `translateY(${p * -6}%)` }}
      >
        <svg viewBox="0 0 100 62" preserveAspectRatio="xMidYMid slice" className={styles.stars}>
          {stars.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              className={reducedMotion ? styles.star : `${styles.star} ${styles.twinkle}`}
              style={{ animationDelay: `${s.tw}s`, animationDuration: `${2 + s.tw}s` }}
            />
          ))}
          <circle cx="76" cy="16" r="7" className={styles.moon} />
          <circle cx="76" cy="16" r="12" className={styles.moonGlow} />
        </svg>
      </div>

      {/* horizon + moon-glitter sea */}
      <div className={styles.sea} style={{ transform: `translateY(${p * 4}%)` }}>
        <div className={styles.glitter} />
      </div>

      {/* ship silhouette drifting out with progress */}
      <svg
        viewBox="0 0 120 40"
        className={styles.ship}
        style={{ transform: `translate(${-20 + p * 60}%, ${Math.sin(p * 6) * 2}px)` }}
        aria-hidden="true"
      >
        <path
          d="M10,26 L54,26 L50,32 L16,32 Z M30,26 L30,8 L44,26 M32,24 L32,12 L41,24"
          className={styles.hull}
        />
        <line x1="30" y1="8" x2="30" y2="26" className={styles.mast} />
      </svg>

      <div className={styles.vignette} />
    </div>
  )
}
