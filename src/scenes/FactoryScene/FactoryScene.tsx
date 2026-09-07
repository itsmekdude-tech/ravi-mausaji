import { Suspense, lazy, useEffect, useState } from 'react'
import type { SceneProps } from '../registry'
import { FactoryCutaway } from './FactoryCutaway'
import { hasWebGL } from '../../utils/webgl'
import styles from './FactoryScene.module.css'

const RadarScene = lazy(() => import('./RadarScene'))

/**
 * Chapter 1 — the fish-factory cutaway (2.5D) with an interactive
 * radar scope (3D). Click the red contact to send a patrol boat in
 * and cut the trawler's nets.
 */
export default function FactoryScene({ progress, active, reducedMotion }: SceneProps) {
  const [cut, setCut] = useState(false)
  const [snipped, setSnipped] = useState(false)
  const webgl = hasWebGL()

  // Reset the vignette if the reader scrolls the chapter fully out of view.
  useEffect(() => {
    if (!active && progress > 0.98) {
      setCut(false)
      setSnipped(false)
    }
  }, [active, progress])

  return (
    <div className={styles.scene}>
      <div className={styles.grid}>
        {/* left: the radar scope */}
        <div className={styles.radarWrap}>
          <div className={styles.radar}>
            {webgl && !reducedMotion && active ? (
              <Suspense fallback={<StaticRadar />}>
                <RadarScene
                  reducedMotion={reducedMotion}
                  cut={cut}
                  onContact={() => setCut(true)}
                  onSnipped={() => setSnipped(true)}
                />
              </Suspense>
            ) : (
              <StaticRadar />
            )}

            {/* interaction prompt / result overlay */}
            <div className={styles.overlay}>
              {!cut && webgl && !reducedMotion && (
                <p className={styles.prompt}>
                  <span className={styles.dotRed} /> Tap the contact to cut its nets
                </p>
              )}
              {snipped && (
                <p className={styles.stamp}>NET CUT · ESCORTED OUT</p>
              )}
            </div>
          </div>
          <p className={styles.scopeLabel}>Scope · Port Blair approaches · 108 islands</p>
        </div>

        {/* the factory ship cutaway drifts gently with scroll */}
        <div className={styles.cutawayWrap}>
          <FactoryCutaway drift={reducedMotion ? 0 : (progress - 0.5) * 26} />
        </div>
      </div>
      <div className={styles.vignette} />
    </div>
  )
}

/** SVG stand-in radar for reduced-motion / no-WebGL / while loading. */
function StaticRadar() {
  return (
    <svg viewBox="0 0 100 100" className={styles.staticRadar} aria-hidden="true">
      <circle cx="50" cy="50" r="46" className={styles.srFace} />
      {[12, 24, 36, 46].map((r) => (
        <circle key={r} cx="50" cy="50" r={r} className={styles.srRing} />
      ))}
      <line x1="4" y1="50" x2="96" y2="50" className={styles.srCross} />
      <line x1="50" y1="4" x2="50" y2="96" className={styles.srCross} />
      <path d="M50 50 L50 6 A44 44 0 0 1 82 24 Z" className={styles.srSweep} />
      <circle cx="70" cy="38" r="2.4" className={styles.srContact} />
    </svg>
  )
}
