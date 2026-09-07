import { Suspense, lazy } from 'react'
import type { SceneProps } from '../registry'
import { MessHallMenu } from './MessHallMenu'
import { hasWebGL } from '../../utils/webgl'
import styles from './CapstanScene.module.css'

const CapstanReel = lazy(() => import('./CapstanReel'))

/**
 * Chapter 4 — scroll winds the brass capstan and hauls a fish up
 * through the surface (3D). A flip-card contrasts the fresh catch
 * with the tinda ration.
 */
export default function CapstanScene({ progress, active, reducedMotion }: SceneProps) {
  const webgl = hasWebGL()
  const wound = Math.round(progress * 100)

  return (
    <div className={styles.scene}>
      <div className={styles.reel}>
        {webgl && active ? (
          <Suspense fallback={<StaticReel wound={wound} />}>
            <CapstanReel progress={progress} reducedMotion={reducedMotion} />
          </Suspense>
        ) : (
          <StaticReel wound={wound} />
        )}
        <div className={styles.gauge} aria-hidden="true">
          <span className={styles.gaugeLabel}>Capstan wound</span>
          <span className={styles.gaugeTrack}>
            <span className={styles.gaugeFill} style={{ width: `${wound}%` }} />
          </span>
          <span className={styles.gaugeVal}>{(progress * 2).toFixed(1)} km</span>
        </div>
      </div>

      <div className={styles.menu}>
        <MessHallMenu />
      </div>

      <div className={styles.vignette} />
    </div>
  )
}

/** SVG fallback: a drum with a rope coil that fills with scroll. */
function StaticReel({ wound }: { wound: number }) {
  return (
    <svg viewBox="0 0 120 160" className={styles.staticReel} aria-hidden="true">
      <ellipse cx="60" cy="30" rx="34" ry="10" className={styles.srCap} />
      <rect x="26" y="30" width="68" height="90" className={styles.srBody} />
      <ellipse cx="60" cy="120" rx="34" ry="10" className={styles.srCap} />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect
          key={i}
          x="26"
          y={112 - i * 9}
          width="68"
          height="6"
          className={styles.srCoil}
          opacity={i < (wound / 100) * 9 ? 1 : 0.12}
        />
      ))}
      <line x1="26" y1="120" x2="8" y2="150" className={styles.srRope} />
    </svg>
  )
}
