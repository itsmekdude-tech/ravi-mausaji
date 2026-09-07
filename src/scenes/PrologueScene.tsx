import { useMemo } from 'react'
import type { SceneProps } from './registry'
import styles from './PrologueScene.module.css'

const TIERS = [
  { n: 46, rMin: 0.15, rMax: 0.5, op: 0.5, par: 2 },
  { n: 30, rMin: 0.3, rMax: 0.8, op: 0.75, par: 5 },
  { n: 14, rMin: 0.5, rMax: 1.1, op: 1, par: 9 },
]

/** Opening: a starlit sea, a rising moon, a ship slipping out of harbour. */
export default function PrologueScene({ progress, reducedMotion }: SceneProps) {
  const p = reducedMotion ? 0.25 : progress

  const layers = useMemo(
    () =>
      TIERS.map((L, li) =>
        Array.from({ length: L.n }).map((_, i) => ({
          x: (i * 71.3 + li * 37) % 100,
          y: (i * 43.7 + li * 19) % 60,
          r: L.rMin + (((i * 13) % 10) / 10) * (L.rMax - L.rMin),
          op: L.op,
          tw: (i % 6) * 0.5,
        })),
      ),
    [],
  )

  return (
    <div className={styles.scene}>
      <svg viewBox="0 0 100 62" preserveAspectRatio="xMidYMid slice" className={styles.sky}>
        <defs>
          <radialGradient id="pMoon" cx="38%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#fff7e6" />
            <stop offset="55%" stopColor="#f0e6cc" />
            <stop offset="100%" stopColor="#cdbf9c" />
          </radialGradient>
          <radialGradient id="pMoonHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f3ead4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f3ead4" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pHaze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a4a55" stopOpacity="0" />
            <stop offset="100%" stopColor="#2a4a55" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* moon halo + disc with a soft terminator */}
        <circle cx="76" cy="15" r="13" fill="url(#pMoonHalo)" />
        <circle cx="76" cy="15" r="6.5" fill="url(#pMoon)" />
        <circle cx="78.4" cy="13.5" r="6" fill="#0b1f2a" opacity="0.18" />

        {/* drifting cloud band */}
        <g className={reducedMotion ? undefined : styles.clouds} fill="#12303b" opacity="0.5">
          <ellipse cx="30" cy="18" rx="16" ry="2.6" />
          <ellipse cx="58" cy="24" rx="12" ry="2" />
          <ellipse cx="14" cy="28" rx="10" ry="1.8" />
        </g>

        {/* star tiers with depth parallax */}
        {layers.map((tier, li) => (
          <g key={li} style={{ transform: `translateY(${p * -TIERS[li].par}px)` }}>
            {tier.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r}
                className={reducedMotion ? styles.star : `${styles.star} ${styles.twinkle}`}
                style={{
                  opacity: s.op,
                  animationDelay: `${s.tw}s`,
                  animationDuration: `${2 + s.tw}s`,
                }}
              />
            ))}
          </g>
        ))}

        <rect x="0" y="30" width="100" height="10" fill="url(#pHaze)" />
      </svg>

      {/* sea with a moonlight glitter path */}
      <div className={styles.sea} style={{ transform: `translateY(${p * 4}%)` }}>
        <div className={styles.glitter} />
        <div className={styles.moonPath} />
      </div>

      {/* ship silhouette drifting out with progress */}
      <svg
        viewBox="0 0 160 60"
        className={styles.ship}
        style={{ transform: `translate(${-16 + p * 52}%, ${Math.sin(p * 6) * 3}px)` }}
        aria-hidden="true"
      >
        <path
          d="M18,44 Q20,50 30,50 L120,50 Q132,50 138,42 L128,42 Q120,44 30,42 Z"
          className={styles.hull}
        />
        <rect x="70" y="32" width="22" height="10" className={styles.hull} />
        <rect x="74" y="34" width="4" height="4" className={styles.port} />
        <rect x="82" y="34" width="4" height="4" className={styles.port} />
        <line x1="48" y1="42" x2="48" y2="10" className={styles.mast} />
        <line x1="104" y1="42" x2="104" y2="16" className={styles.mast} />
        <path
          d="M48,10 L30,42 M48,10 L70,34 M104,16 L92,42 M104,16 L120,42"
          className={styles.rigging}
        />
        <circle cx="48" cy="9" r="1.6" className={styles.runningLight} />
      </svg>

      <div className={styles.vignette} />
    </div>
  )
}
