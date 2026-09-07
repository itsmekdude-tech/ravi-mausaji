import type { SceneProps } from '../registry'
import styles from './SentryScene.module.css'

const PANELS = [
  { id: 'gate', cap: 'One night, the naval checkpoint. A drunk man tries to enter; the sentries are women.' },
  { id: 'slap', cap: 'Two tight slaps. He staggers back — and comes again.', pow: 'SLAP!' },
  { id: 'ear', cap: 'She takes him by the ears and hauls him inside.', pow: 'OW!' },
]

/**
 * Chapter 3 — the sentry's discipline, told in cel-shaded comic panels
 * revealed one by one as you scroll.
 */
export default function SentryScene({ progress, reducedMotion }: SceneProps) {
  const p = reducedMotion ? 1 : progress
  const shown = Math.min(PANELS.length, Math.floor(p * 3.4) + 1)

  return (
    <div className={styles.scene}>
      <div className={styles.harbourGlow} aria-hidden="true" />

      <div className={styles.strip}>
        {PANELS.map((panel, i) => (
          <figure key={panel.id} className={`${styles.panel} ${i < shown ? styles.on : ''}`}>
            <div className={styles.art}>
              <SentryArt kind={panel.id} />
              {panel.pow && i < shown && (
                <span className={styles.pow} data-kind={panel.id}>
                  {panel.pow}
                </span>
              )}
            </div>
            <figcaption className={styles.cap}>{panel.cap}</figcaption>
          </figure>
        ))}
      </div>

      <div className={styles.translation}>
        <span className={styles.translationLabel}>Translation</span>
        “That bloody idiot is my husband!”
      </div>

      <div className={styles.vignette} />
    </div>
  )
}

/** One cel-shaded comic panel. */
function SentryArt({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 100 100" className={styles.svg} aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c2a34" />
          <stop offset="70%" stopColor="#33414c" />
          <stop offset="100%" stopColor="#3d4a52" />
        </linearGradient>
        <radialGradient id={`lamp-${kind}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--lamp-glow)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--lamp-glow)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`coatF-${kind}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5a6b52" />
          <stop offset="55%" stopColor="#48583f" />
          <stop offset="100%" stopColor="#374531" />
        </linearGradient>
        <linearGradient id={`coatM-${kind}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3f5f86" />
          <stop offset="60%" stopColor="#2f4a6b" />
          <stop offset="100%" stopColor="#243a55" />
        </linearGradient>
      </defs>

      {/* sky + ground */}
      <rect x="0" y="0" width="100" height="100" fill={`url(#sky-${kind})`} />
      <rect x="0" y="72" width="100" height="28" fill="#2a353d" />
      <line x1="0" y1="72" x2="100" y2="72" stroke="#1a232a" strokeWidth="0.8" />

      {/* ben-day dot wash on the sky */}
      <rect x="0" y="0" width="100" height="72" className={styles.dots} />

      {/* streetlamp + warm pool */}
      <g>
        <circle cx="78" cy="20" r="16" fill={`url(#lamp-${kind})`} />
        <rect x="76.4" y="20" width="3.2" height="52" fill="#20282e" />
        <ellipse cx="78" cy="18" rx="4" ry="5" fill="var(--lamp-glow)" filter="url(#softGlow)" />
        <ellipse cx="70" cy="80" rx="26" ry="6" fill="var(--lamp-glow)" opacity="0.12" />
      </g>

      {/* --- figures per panel --- */}
      {kind === 'gate' && (
        <>
          <Sentry x={34} kind={kind} arm="rest" />
          <Drunk x={64} kind={kind} lean={6} />
        </>
      )}
      {kind === 'slap' && (
        <>
          <Sentry x={34} kind={kind} arm="slap" />
          <Drunk x={66} kind={kind} lean={16} />
          <g stroke="#e9ddc3" strokeWidth="0.8" opacity="0.8">
            <line x1="52" y1="42" x2="59" y2="40" />
            <line x1="52" y1="45" x2="60" y2="45" />
            <line x1="52" y1="48" x2="59" y2="50" />
          </g>
        </>
      )}
      {kind === 'ear' && (
        <>
          <Sentry x={38} kind={kind} arm="grab" />
          <Drunk x={58} kind={kind} lean={-12} />
        </>
      )}
    </svg>
  )
}

/** The woman sentry: peaked cap, greatcoat, belt. */
function Sentry({ x, kind, arm }: { x: number; kind: string; arm: 'rest' | 'slap' | 'grab' }) {
  return (
    <g filter="url(#dropSoft)">
      <ellipse cx={x} cy="90" rx="9" ry="2.4" fill="#141b20" opacity="0.5" />
      {/* greatcoat */}
      <path
        d={`M${x - 7},90 L${x - 6},52 Q${x},46 ${x + 6},52 L${x + 7},90 Z`}
        fill={`url(#coatF-${kind})`}
        stroke="#232d22"
        strokeWidth="0.7"
      />
      <line x1={x - 6.4} y1="70" x2={x + 6.4} y2="70" stroke="#232d22" strokeWidth="1.2" />
      <rect x={x - 1} y="68" width="2" height="4" rx="0.5" fill="var(--brass)" />
      {/* head + cap */}
      <circle cx={x} cy="47" r="5" fill="#e6c9a0" stroke="#232d22" strokeWidth="0.6" />
      <path d={`M${x - 6},44 Q${x},38 ${x + 6},44 L${x + 6},45 L${x - 6},45 Z`} fill="#374531" stroke="#232d22" strokeWidth="0.6" />
      <rect x={x - 6.5} y="44.5" width="13" height="1.8" rx="0.9" fill="#2a3327" />
      <circle cx={x} cy="41.5" r="1.1" fill="var(--soviet-red)" />
      {/* arm varies by pose */}
      {arm === 'rest' && (
        <path d={`M${x + 5},55 q6,2 7,10`} stroke="#e6c9a0" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
      {arm === 'slap' && (
        <path d={`M${x + 5},55 q10,-6 17,-9`} stroke="#e6c9a0" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
      {arm === 'grab' && (
        <path d={`M${x + 5},55 q8,-4 13,-2`} stroke="#e6c9a0" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
    </g>
  )
}

/** The drunk husband: ushanka, coat, wobble. */
function Drunk({ x, kind, lean }: { x: number; kind: string; lean: number }) {
  return (
    <g filter="url(#dropSoft)" transform={`rotate(${lean} ${x} 78)`}>
      <ellipse cx={x} cy="90" rx="8" ry="2.2" fill="#141b20" opacity="0.5" />
      <path
        d={`M${x - 6},90 L${x - 5},54 Q${x},49 ${x + 5},54 L${x + 6},90 Z`}
        fill={`url(#coatM-${kind})`}
        stroke="#1a2735"
        strokeWidth="0.7"
      />
      <line x1={x - 5} y1="72" x2={x + 5} y2="72" stroke="#1a2735" strokeWidth="1" />
      {/* head */}
      <circle cx={x} cy="49" r="4.6" fill="#e6c9a0" stroke="#1a2735" strokeWidth="0.6" />
      {/* ushanka */}
      <path d={`M${x - 5.4},47 Q${x},40 ${x + 5.4},47 L${x + 5},49 L${x - 5},49 Z`} fill="#6a5844" stroke="#1a2735" strokeWidth="0.6" />
      <rect x={x - 5.6} y="47.5" width="2.4" height="4" rx="1" fill="#5a4a38" />
      <rect x={x + 3.2} y="47.5" width="2.4" height="4" rx="1" fill="#5a4a38" />
      {/* rosy drunk cheek */}
      <circle cx={x - 1.6} cy="51" r="1" fill="var(--soviet-red)" opacity="0.5" />
      {/* dangling arm */}
      <path d={`M${x - 4},56 q-5,4 -4,11`} stroke="#e6c9a0" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </g>
  )
}
