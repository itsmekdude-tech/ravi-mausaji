import { useEffect, useRef, useState } from 'react'
import styles from './CompassRose.module.css'

/** Needle eases toward the active heading (shortest angular path). */
export function CompassRose({ heading }: { heading: number }) {
  const [display, setDisplay] = useState(heading)
  const raf = useRef(0)

  useEffect(() => {
    const animate = () => {
      setDisplay((prev) => {
        let delta = heading - prev
        while (delta > 180) delta -= 360
        while (delta < -180) delta += 360
        const next = prev + delta * 0.12
        if (Math.abs(delta) < 0.1) return heading
        raf.current = requestAnimationFrame(animate)
        return next
      })
    }
    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [heading])

  return (
    <div className={styles.wrap} aria-hidden="true">
      <svg viewBox="0 0 100 100" className={styles.rose}>
        <defs>
          <radialGradient id="roseFace" cx="42%" cy="36%" r="72%">
            <stop offset="0%" stopColor="#183039" />
            <stop offset="100%" stopColor="#08161d" />
          </radialGradient>
          <linearGradient id="roseBezel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e6c878" />
            <stop offset="45%" stopColor="#c9a24b" />
            <stop offset="62%" stopColor="#8a6b28" />
            <stop offset="100%" stopColor="#d8b45e" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#roseBezel)" />
        <circle cx="50" cy="50" r="46" fill="url(#roseFace)" className={styles.ring} />
        <circle cx="50" cy="50" r="38" className={styles.ringInner} />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2
          const long = i % 6 === 0
          const r1 = long ? 32 : 36
          return (
            <line
              key={i}
              x1={50 + Math.cos(a) * r1}
              y1={50 + Math.sin(a) * r1}
              x2={50 + Math.cos(a) * 40}
              y2={50 + Math.sin(a) * 40}
              className={long ? styles.tickLong : styles.tick}
            />
          )
        })}
        {['N', 'E', 'S', 'W'].map((c, i) => {
          const a = (i / 4) * Math.PI * 2 - Math.PI / 2
          return (
            <text
              key={c}
              x={50 + Math.cos(a) * 25}
              y={50 + Math.sin(a) * 25 + 3}
              className={styles.cardinal}
            >
              {c}
            </text>
          )
        })}
        <g transform={`rotate(${display} 50 50)`} className={styles.needleGroup} filter="url(#softGlow)">
          <polygon points="50,15 46.5,50 53.5,50" className={styles.needleN} />
          <polygon points="50,85 46.5,50 53.5,50" className={styles.needleS} />
        </g>
        <circle cx="50" cy="50" r="3.4" className={styles.hub} />
        {/* glass reflection */}
        <ellipse cx="40" cy="34" rx="20" ry="12" className={styles.glass} />
      </svg>
      <span className={styles.readout}>{Math.round((display + 360) % 360)}°</span>
    </div>
  )
}
