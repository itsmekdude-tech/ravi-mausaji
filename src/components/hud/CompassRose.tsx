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
        <circle cx="50" cy="50" r="46" className={styles.ring} />
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
        <g transform={`rotate(${display} 50 50)`} className={styles.needleGroup}>
          <polygon points="50,14 46,50 54,50" className={styles.needleN} />
          <polygon points="50,86 46,50 54,50" className={styles.needleS} />
        </g>
        <circle cx="50" cy="50" r="3.4" className={styles.hub} />
      </svg>
      <span className={styles.readout}>{Math.round((display + 360) % 360)}°</span>
    </div>
  )
}
