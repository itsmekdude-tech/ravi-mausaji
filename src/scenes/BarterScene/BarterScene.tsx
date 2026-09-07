import { useRef, useState } from 'react'
import type { SceneProps } from '../registry'
import styles from './BarterScene.module.css'

const TOTAL = 3 // three pairs of jeans to trade

/**
 * Chapter 2 — the Singapore run and the jeans-for-vodka barter.
 * Drag a pair of Levi's across to the Soviet side to trade it for
 * vodka and chocolate; the three-currency scale tips in his favour.
 * Everything here traces to the transcript: jeans, vodka, chocolate,
 * Singapore dollars → roubles at a fifty-percent discount.
 */
export default function BarterScene({ reducedMotion }: SceneProps) {
  const [traded, setTraded] = useState(0)
  const [dragId, setDragId] = useState<number | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const sceneRef = useRef<HTMLDivElement>(null)
  const zoneRef = useRef<HTMLDivElement>(null)

  const remaining = TOTAL - traded
  const savings = Math.round((traded / TOTAL) * 50)
  const tip = (traded / TOTAL) * 12 // scale lean, degrees

  const onPointerDown = (id: number) => (e: React.PointerEvent) => {
    e.preventDefault()
    const rect = sceneRef.current?.getBoundingClientRect()
    if (!rect) return
    setDragId(id)
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragId === null) return
    const rect = sceneRef.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragId === null) return
    const zone = zoneRef.current?.getBoundingClientRect()
    const overZone =
      zone &&
      e.clientX >= zone.left &&
      e.clientX <= zone.right &&
      e.clientY >= zone.top &&
      e.clientY <= zone.bottom
    if (overZone) setTraded((t) => Math.min(TOTAL, t + 1))
    setDragId(null)
  }

  return (
    <div
      ref={sceneRef}
      className={styles.scene}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div className={styles.suitcase}>
        {/* Singapore side — jeans, walkman, dollars */}
        <div className={`${styles.half} ${styles.left}`}>
          <span className={styles.itemLabel}>Singapore</span>
          <div className={styles.denim}>
            {Array.from({ length: remaining }).map((_, i) => {
              const id = traded + i
              if (dragId === id) return <span key={id} className={styles.jeansSlot} />
              return (
                <button
                  key={id}
                  className={styles.jeans}
                  onPointerDown={onPointerDown(id)}
                  aria-label="A pair of jeans — drag to trade"
                />
              )
            })}
          </div>
          <div className={styles.walkman}>WALKMAN</div>
          <div className={styles.cash}>S$</div>
        </div>

        {/* Soviet side — the drop zone; fills with vodka & chocolate */}
        <div ref={zoneRef} className={`${styles.half} ${styles.right} ${dragId !== null ? styles.armed : ''}`}>
          <span className={styles.itemLabel}>Soviet Union</span>
          <div className={styles.bottles}>
            {Array.from({ length: traded }).map((_, i) => (
              <span key={i} className={styles.vodka} />
            ))}
          </div>
          <div className={styles.choc}>CHOCOLATE ×{traded}</div>
          <div className={styles.camera}>◉ camera</div>
          {dragId !== null && <span className={styles.dropHint}>trade here</span>}
        </div>
      </div>

      {/* prompt */}
      <p className={styles.prompt}>
        {traded < TOTAL
          ? '“They want your jeans” — drag a pair across to trade for vodka'
          : 'Every pair traded for vodka and chocolate.'}
      </p>

      {/* currency scale */}
      <div className={styles.scaleWrap}>
        <div className={styles.pivot}>
          <div
            className={styles.beam}
            style={{ transform: `rotate(${reducedMotion ? 0 : tip}deg)` }}
          >
            <div className={styles.pan}>
              <span className={styles.coin}>S$ 1</span>
            </div>
            <div className={styles.pan}>
              <span className={styles.coin}>₽ 6</span>
            </div>
          </div>
          <div className={styles.post} />
        </div>
        <p className={styles.savings}>
          <span className={styles.savingsNum}>{savings}%</span>
          <span className={styles.savingsLabel}>saved on roubles</span>
        </p>
      </div>

      {/* floating drag ghost, positioned in scene coords */}
      {dragId !== null && (
        <span
          className={`${styles.jeans} ${styles.ghost}`}
          style={{ left: pos.x, top: pos.y }}
          aria-hidden="true"
        />
      )}

      <div className={styles.vignette} />
    </div>
  )
}
