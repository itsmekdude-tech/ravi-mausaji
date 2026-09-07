import { useMemo } from 'react'
import { voyageNodes } from '../../data/chapters'
import { buildRoutePath, pointAt } from './routeGeometry'
import styles from './VoyageChart.module.css'

interface Props {
  /** Global scroll progress 0→1. */
  progress: number
  /** Index of the active chapter (to highlight the nearest port). */
  activeNodeId?: string
}

const W = 260
const H = 190

/**
 * A stylized nautical minimap. A golden route inks itself across the
 * chart as you scroll, and the ship rides the line coast to coast.
 */
export function VoyageChart({ progress, activeNodeId }: Props) {
  const path = useMemo(() => buildRoutePath(voyageNodes, W, H), [])
  const ship = pointAt(path.d, path.length, progress)
  const dash = path.length * (1 - progress)

  return (
    <aside className={`${styles.chart} parchment-surface paper-grain`} aria-hidden="true">
      <div className={styles.frame}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg}>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="var(--blueprint-line)" strokeWidth="0.4" opacity="0.35" />
            </pattern>
            <radialGradient id="shipGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--gold-route)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--gold-route)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={W} height={H} fill="url(#grid)" />

          {/* faint stylized landmasses */}
          <path
            className={styles.land}
            d="M8,150 q30,-18 62,-8 q40,12 30,40 l-92,0 z"
          />
          <path className={styles.land} d="M150,10 q40,-6 70,14 q10,30 -20,34 q-50,-4 -50,-48 z" />

          {/* the full route, faint */}
          <path d={path.d} className={styles.routeGhost} />
          {/* the inked portion */}
          <path
            d={path.d}
            className={styles.routeInk}
            strokeDasharray={path.length}
            strokeDashoffset={dash}
          />

          {/* ports */}
          {voyageNodes.map((n, i) => {
            const p = pointAt(path.d, path.length, i / (voyageNodes.length - 1))
            const reached = progress >= i / (voyageNodes.length - 1) - 0.02
            const isActive = n.id === activeNodeId
            return (
              <g key={n.id} className={styles.port}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 4.5 : 3}
                  className={reached ? styles.portDotOn : styles.portDot}
                />
                {isActive && (
                  <circle cx={p.x} cy={p.y} r={8} className={styles.portRing} />
                )}
                <text
                  x={p.x + 7}
                  y={p.y + 3}
                  className={`${styles.portLabel} ${isActive ? styles.portLabelOn : ''}`}
                >
                  {n.label}
                </text>
              </g>
            )
          })}

          {/* the ship + wake */}
          <circle cx={ship.x} cy={ship.y} r={11} fill="url(#shipGlow)" />
          <g transform={`translate(${ship.x} ${ship.y}) rotate(${ship.angle})`}>
            <path d="M-3,-3 L-14,-6 M-3,3 L-14,6" className={styles.wake} />
            <path d="M-4,3 L4,3 L6,-1 L0,-6 L-6,-1 Z" className={styles.ship} />
          </g>
        </svg>
      </div>
      <p className={styles.caption}>
        <span className={styles.captionLabel}>The Voyage</span>
        <span className={styles.captionPct}>{Math.round(progress * 100)}°</span>
      </p>
    </aside>
  )
}
