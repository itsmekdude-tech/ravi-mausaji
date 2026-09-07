import { useCallback, useEffect, useRef, useState } from 'react'
import { islands, START_ISLAND, type Island } from '../../data/islands'
import {
  discover,
  allDiscovered,
  routeBetween,
  loadVisited,
  saveVisited,
} from '../../game/islandGame'
import { pointAt } from '../../components/map/routeGeometry'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import styles from './IslandGame.module.css'

const W = 1000
const H = 640
const PAD = 22
const STORE_KEY = 'ravi-mausaji.islands.visited'

const byId = (id: string) => islands.find((i) => i.id === id)!
const chartPoint = (c: [number, number]): [number, number] => [
  PAD + c[0] * (W - PAD * 2),
  PAD + c[1] * (H - PAD * 2),
]
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function IslandGame({ onClose }: { onClose: () => void }) {
  const reducedMotion = useReducedMotion()
  const [current, setCurrent] = useState(START_ISLAND)
  const [visited, setVisited] = useState<Set<string>>(() => {
    const v = loadVisited(STORE_KEY)
    v.add(START_ISLAND)
    return v
  })
  const [openStory, setOpenStory] = useState<string | null>(START_ISLAND)
  const [sailing, setSailing] = useState(false)
  const [route, setRoute] = useState<{ d: string; length: number } | null>(null)
  const [ship, setShip] = useState(() => {
    const [x, y] = chartPoint(byId(START_ISLAND).coords)
    return { x, y, angle: 0 }
  })

  const raf = useRef(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // persist visits, focus on open, Esc to close, lock body scroll
  useEffect(() => saveVisited(STORE_KEY, visited), [visited])
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      cancelAnimationFrame(raf.current)
    }
  }, [onClose])

  const finish = useCallback((id: string) => {
    const [x, y] = chartPoint(byId(id).coords)
    setShip((s) => ({ ...s, x, y }))
    setCurrent(id)
    setSailing(false)
    setRoute(null)
    setVisited((v) => discover(v, id))
    setOpenStory(id)
  }, [])

  const select = useCallback(
    (id: string) => {
      if (sailing) return
      if (id === current) {
        setOpenStory(id)
        return
      }
      const from = byId(current)
      const to = byId(id)
      setOpenStory(null)
      if (reducedMotion) {
        finish(id)
        return
      }
      const r = routeBetween(from, to, W, H)
      setRoute(r)
      setSailing(true)
      const dist = Math.hypot(to.coords[0] - from.coords[0], to.coords[1] - from.coords[1])
      const dur = 500 + dist * 1100
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / dur)
        const e = easeInOut(t)
        const p = pointAt(r.d, r.length, e)
        setShip({ x: p.x, y: p.y, angle: p.angle })
        if (t < 1) raf.current = requestAnimationFrame(step)
        else finish(id)
      }
      raf.current = requestAnimationFrame(step)
    },
    [sailing, current, reducedMotion, finish],
  )

  const done = allDiscovered(islands, visited)
  const story = openStory ? byId(openStory) : null

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Chart the Islands — an interactive map of Mausaji's stories"
      ref={dialogRef}
    >
      <div className={styles.chartWrap}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart} preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="igGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="var(--blueprint-line)" strokeWidth="0.6" opacity="0.28" />
            </pattern>
            <radialGradient id="igSea" cx="50%" cy="42%" r="75%">
              <stop offset="0%" stopColor="#123a44" />
              <stop offset="100%" stopColor="#061019" />
            </radialGradient>
            <radialGradient id="igIsle" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#8aa06f" />
              <stop offset="100%" stopColor="#4c6a44" />
            </radialGradient>
          </defs>

          <rect width={W} height={H} fill="url(#igSea)" />
          <rect width={W} height={H} fill="url(#igGrid)" />

          {/* decorative rhumb lines from centre */}
          <g stroke="var(--brass-shadow)" strokeWidth="0.5" opacity="0.18">
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i / 16) * Math.PI * 2
              return (
                <line key={i} x1={W / 2} y1={H / 2} x2={W / 2 + Math.cos(a) * 900} y2={H / 2 + Math.sin(a) * 900} />
              )
            })}
          </g>

          {/* active sailing route */}
          {route && (
            <path d={route.d} className={styles.route} strokeDasharray={route.length} strokeDashoffset={0} />
          )}

          {/* islands */}
          {islands.map((isle) => (
            <IslandMarker
              key={isle.id}
              isle={isle}
              visited={visited.has(isle.id)}
              current={isle.id === current}
              disabled={sailing}
              onSelect={() => select(isle.id)}
            />
          ))}

          {/* the ship */}
          <g transform={`translate(${ship.x} ${ship.y}) rotate(${ship.angle})`} className={styles.ship}>
            <path d="M-13,-7 L7,-7 L17,0 L7,7 L-13,7 Z" />
            <circle cx="-4" cy="0" r="2.4" className={styles.shipLamp} />
          </g>
        </svg>
      </div>

      {/* top bar */}
      <header className={styles.bar}>
        <div>
          <p className={styles.kicker}>Bonus · Set sail</p>
          <h2 className={styles.title}>Chart the Islands</h2>
        </div>
        <div className={styles.log}>
          <span className={styles.logNum}>
            {visited.size} / {islands.length}
          </span>
          <span className={styles.logLabel}>islands charted</span>
        </div>
        <button ref={closeRef} className={styles.close} onClick={onClose} aria-label="Close the map">
          ✕
        </button>
      </header>

      <p className={styles.hint}>
        {sailing ? 'Sailing…' : 'Tap an island to sail there and read its story'}
      </p>

      {/* completion badge */}
      {done && (
        <div className={styles.badge}>
          <span className={styles.badgeMark}>🧭</span>
          <p>Every island charted. That’s the whole voyage — well sailed.</p>
        </div>
      )}

      {/* story card */}
      {story && (
        <aside className={`${styles.card} parchment-surface paper-grain`}>
          <button className={styles.cardClose} onClick={() => setOpenStory(null)} aria-label="Close story">
            ✕
          </button>
          <p className={styles.cardKicker}>
            <span className={styles.cardMotif}>{story.motif}</span>
            {story.kind === 'port' ? 'Port of call' : 'Island'}
          </p>
          <h3 className={styles.cardTitle}>{story.label}</h3>
          {story.blurb.map((para, i) => (
            <p key={i} className={styles.cardBody}>
              {para}
            </p>
          ))}
          <blockquote className={`hand ${styles.cardQuote}`}>“{story.quote.text}”</blockquote>
        </aside>
      )}
    </div>
  )
}

function IslandMarker({
  isle,
  visited,
  current,
  disabled,
  onSelect,
}: {
  isle: Island
  visited: boolean
  current: boolean
  disabled: boolean
  onSelect: () => void
}) {
  const [x, y] = chartPoint(isle.coords)
  return (
    <g
      transform={`translate(${x} ${y})`}
      role="button"
      tabIndex={0}
      aria-label={`${isle.label} — read story`}
      className={`${styles.marker} ${disabled ? styles.markerDisabled : ''}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      {/* hit target */}
      <circle r="26" fill="transparent" />
      {/* island body */}
      <ellipse cx="0" cy="2" rx="16" ry="7" className={styles.isleShadow} />
      <ellipse cx="0" cy="0" rx="14" ry="9" fill="url(#igIsle)" className={styles.isle} />
      {current && <circle r="20" className={styles.currentRing} />}
      {visited && (
        <circle cx="12" cy="-9" r="5" className={styles.tick} />
      )}
      {visited && (
        <path d="M9.6,-9 l1.6,1.8 l3.2,-3.8" className={styles.tickMark} />
      )}
      <text x="0" y="24" className={styles.markerLabel}>
        {isle.label}
      </text>
    </g>
  )
}
