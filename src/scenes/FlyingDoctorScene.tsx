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
  const geo = useMemo(() => pathGeometry(PATH), [])
  const heli = pointAtLen(geo, p)
  const drawn = geo.length * (1 - p)

  return (
    <div className={styles.scene}>
      <svg viewBox="0 0 100 100" className={styles.chart} preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="fdgrid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M8 0H0V8" fill="none" stroke="var(--blueprint-line)" strokeWidth="0.2" opacity="0.4" />
          </pattern>
          <pattern id="fdgridMajor" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="var(--blueprint-line)" strokeWidth="0.5" opacity="0.5" />
          </pattern>
          <radialGradient id="fdIsland" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#8aa06f" />
            <stop offset="100%" stopColor="#5c7a52" />
          </radialGradient>
          <radialGradient id="fdSea" cx="50%" cy="40%" r="75%">
            <stop offset="0%" stopColor="#12424a" />
            <stop offset="100%" stopColor="#081b23" />
          </radialGradient>
        </defs>

        <rect width="100" height="100" fill="url(#fdSea)" />
        <rect width="100" height="100" fill="url(#fdgrid)" />
        <rect width="100" height="100" fill="url(#fdgridMajor)" />

        {/* full route ghost + inked (drawing) trail */}
        <path d={PATH} className={styles.routeGhost} />
        <path
          d={PATH}
          className={styles.route}
          strokeDasharray={geo.length}
          strokeDashoffset={drawn}
        />

        {/* islands */}
        {ISLANDS.map((is, i) => {
          const reached = p >= i / (ISLANDS.length - 1) - 0.05
          return (
            <g key={i}>
              {/* coastline halo */}
              <ellipse cx={is.x} cy={is.y} rx="9" ry="5.4" fill="#0d2a30" opacity="0.5" />
              <ellipse cx={is.x} cy={is.y} rx="7" ry="4" fill="url(#fdIsland)" stroke="#3f5738" strokeWidth="0.4" />
              {/* palms */}
              <g stroke="#3f5738" strokeWidth="0.5" fill="none">
                <path d={`M${is.x - 1},${is.y - 0.5} q-1.4,-2 -2.6,-2.4`} />
                <path d={`M${is.x - 1},${is.y - 0.5} q0.4,-2.2 -0.4,-3`} />
                <path d={`M${is.x + 1.4},${is.y - 0.3} q1.6,-1.8 2.8,-2`} />
              </g>
              <circle cx={is.x - 1} cy={is.y - 0.5} r="0.6" fill="#3f5738" />

              {reached && (
                <g className={styles.bubble} filter="url(#dropSoft)">
                  <path
                    d={`M${is.x + 3},${is.y - 5} q0,-5 5,-5 q5,0 5,5 q0,4 -4,4.6 l-1.6 2.2 l-1 -2.2 q-3.4,-0.6 -3.4,-4.6 z`}
                    className={styles.bubbleFill}
                  />
                  <text x={is.x + 8} y={is.y - 3.4} className={styles.bubbleIcon}>
                    {is.icon}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* helicopter */}
        <g transform={`translate(${heli.x} ${heli.y}) rotate(${heli.angle * 0.15})`} className={styles.heli}>
          {/* tail boom */}
          <path d="M2,0 L8,-0.6 L8,0.6 Z" className={styles.heliBody} />
          <circle cx="8" cy="0" r="1.2" fill="none" className={styles.tailRotor} />
          {/* fuselage */}
          <ellipse cx="0" cy="0" rx="3.4" ry="2" className={styles.heliBody} />
          {/* canopy glass */}
          <path d="M-3.4,0 q-0.6,-1.8 1.4,-1.9 q1.2,0 1.6,1.1 z" className={styles.canopy} />
          {/* skids */}
          <line x1="-2.6" y1="2.2" x2="2.6" y2="2.2" className={styles.skid} />
          <line x1="-1.6" y1="2" x2="-1.8" y2="2.2" className={styles.skid} />
          <line x1="1.6" y1="2" x2="1.8" y2="2.2" className={styles.skid} />
          {/* mast + rotor disc */}
          <line x1="0" y1="-2" x2="0" y2="-3" className={styles.skid} />
          <ellipse cx="0" cy="-3.1" rx="5.5" ry="0.9" className={reducedMotion ? styles.rotorStill : styles.rotorDisc} />
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

// --- shared measurer (browser only) ---
interface Geo {
  el: SVGPathElement | null
  length: number
}
function pathGeometry(d: string): Geo {
  if (typeof document === 'undefined') return { el: null, length: 1 }
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  el.setAttribute('d', d)
  return { el, length: el.getTotalLength() || 1 }
}
function pathAt(geo: Geo, t: number) {
  if (!geo.el) return { x: 0, y: 0 }
  return geo.el.getPointAtLength(Math.min(1, Math.max(0, t)) * geo.length)
}
function pointAtLen(geo: Geo, t: number): { x: number; y: number; angle: number } {
  const p = pathAt(geo, t)
  const a = pathAt(geo, Math.min(1, t + 0.01))
  const angle = (Math.atan2(a.y - p.y, a.x - p.x) * 180) / Math.PI
  return { x: p.x, y: p.y, angle }
}
