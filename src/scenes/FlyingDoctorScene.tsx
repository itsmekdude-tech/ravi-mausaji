import { useMemo } from 'react'
import type { SceneProps } from './registry'
import styles from './FlyingDoctorScene.module.css'

const ISLANDS = [
  { x: 18, y: 70, icon: '🦷' },
  { x: 42, y: 40, icon: '👁' },
  { x: 66, y: 66, icon: '🦷' },
  { x: 86, y: 34, icon: '👁' },
]

const PATH = 'M18,70 Q30,30 42,40 T66,66 Q78,40 86,34'

/**
 * Chapter 5 — the flying doctors. A helicopter traces a path between
 * atolls; a thought-bubble (tooth / eye) pops over each island it visits.
 */
export default function FlyingDoctorScene({ progress, reducedMotion }: SceneProps) {
  const p = reducedMotion ? 0.5 : progress
  const heli = useMemo(() => pointOnPath(PATH, p), [p])

  return (
    <div className={styles.scene}>
      <svg viewBox="0 0 100 100" className={styles.chart} preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="fdgrid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M8 0H0V8" fill="none" stroke="var(--blueprint-line)" strokeWidth="0.2" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#fdgrid)" />

        {/* dashed flight path */}
        <path d={PATH} className={styles.route} />

        {/* islands */}
        {ISLANDS.map((is, i) => {
          const reached = p >= i / (ISLANDS.length - 1) - 0.05
          return (
            <g key={i}>
              <ellipse cx={is.x} cy={is.y} rx="7" ry="4" className={styles.island} />
              <circle cx={is.x} cy={is.y} r="1.2" className={styles.palm} />
              {reached && (
                <g className={styles.bubble}>
                  <circle cx={is.x + 5} cy={is.y - 8} r="4.5" className={styles.bubbleFill} />
                  <text x={is.x + 5} y={is.y - 6.4} className={styles.bubbleIcon}>
                    {is.icon}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* helicopter */}
        <g transform={`translate(${heli.x} ${heli.y})`} className={styles.heli}>
          <ellipse cx="0" cy="0" rx="3" ry="1.6" className={styles.heliBody} />
          <rect x="-0.4" y="-3" width="0.8" height="3" className={styles.heliMast} />
          <line
            x1="-4"
            y1="-3"
            x2="4"
            y2="-3"
            className={reducedMotion ? styles.rotorStill : styles.rotor}
          />
          <line x1="3" y1="0" x2="7" y2="-0.4" className={styles.tail} />
        </g>
      </svg>

      <p className={styles.note}>
        <span className={styles.noteLabel}>Margin note</span>
        Great Nicobar sits at the mouth of the Malacca Strait — a map for another
        evening.
      </p>

      <div className={styles.vignette} />
    </div>
  )
}

/** Approximate a point along the SVG path string via the shared measurer. */
function pointOnPath(d: string, t: number): { x: number; y: number } {
  if (typeof document === 'undefined') return { x: 0, y: 0 }
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  const len = path.getTotalLength()
  const pt = path.getPointAtLength(Math.min(1, Math.max(0, t)) * len)
  return { x: pt.x, y: pt.y }
}
