import type { SceneProps } from './registry'
import styles from './EpilogueScene.module.css'

/** Closing: sea gives way to a warm kitchen; the logbook closes. */
export default function EpilogueScene({ progress, reducedMotion }: SceneProps) {
  const p = reducedMotion ? 0.6 : progress
  return (
    <div className={styles.scene} style={{ ['--warm' as string]: String(p) }}>
      <div className={styles.glow} />

      <svg viewBox="0 0 200 140" className={styles.table} aria-hidden="true">
        <defs>
          <linearGradient id="eWood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a4f2b" />
            <stop offset="100%" stopColor="#5a3a1e" />
          </linearGradient>
          <linearGradient id="eLeather" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8c332a" />
            <stop offset="55%" stopColor="#6f271f" />
            <stop offset="100%" stopColor="#511a14" />
          </linearGradient>
          <linearGradient id="eBrass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e6c878" />
            <stop offset="45%" stopColor="#c9a24b" />
            <stop offset="60%" stopColor="#8a6b28" />
            <stop offset="100%" stopColor="#c9a24b" />
          </linearGradient>
          <radialGradient id="eJamun" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#a5632f" />
            <stop offset="60%" stopColor="#6a3b1e" />
            <stop offset="100%" stopColor="#48260f" />
          </radialGradient>
        </defs>

        {/* table surface with grain */}
        <rect x="0" y="96" width="200" height="44" fill="url(#eWood)" />
        <g stroke="#4a2f18" strokeWidth="0.5" opacity="0.5">
          <path d="M0,104 Q100,101 200,104" fill="none" />
          <path d="M0,114 Q100,118 200,114" fill="none" />
          <path d="M0,126 Q100,123 200,126" fill="none" />
        </g>
        <line x1="0" y1="96" x2="200" y2="96" stroke="#301d0e" strokeWidth="1" />

        {/* closed leather logbook with page edge + emboss */}
        <g filter="url(#dropSoft)">
          <rect x="68" y="60" width="60" height="8" rx="1.5" fill="#efe6cf" />
          <line x1="70" y1="62" x2="126" y2="62" stroke="#cbbd97" strokeWidth="0.6" />
          <line x1="70" y1="64.5" x2="126" y2="64.5" stroke="#cbbd97" strokeWidth="0.6" />
          <rect x="70" y="66" width="58" height="34" rx="2.5" fill="url(#eLeather)" stroke="#3a120d" strokeWidth="0.8" />
          <rect x="73" y="69" width="52" height="28" rx="1.5" fill="none" stroke="#e6c878" strokeWidth="0.5" opacity="0.55" />
          {/* gold crest */}
          <circle cx="99" cy="83" r="7" fill="none" stroke="url(#eBrass)" strokeWidth="1.2" />
          <path d="M99 77 l1.8 4.6 l-1.8 4.6 l-1.8 -4.6 z" fill="url(#eBrass)" />
        </g>

        {/* brass compass beside it */}
        <g filter="url(#dropSoft)" transform="translate(150 84)">
          <circle r="10" fill="url(#eBrass)" />
          <circle r="8.4" fill="#20303a" />
          <circle r="8.4" fill="none" stroke="#8a6b28" strokeWidth="0.5" />
          <path d="M0 -7 L1.8 0 L0 7 L-1.8 0 Z" fill="var(--soviet-red)" />
          <path d="M0 -7 L1.8 0 L0 0 Z" fill="#d65a44" />
          <circle r="1.4" fill="url(#eBrass)" />
          <ellipse cx="-3" cy="-3.5" rx="3" ry="1.6" fill="#fff7e6" opacity="0.25" />
        </g>

        {/* plate of glossy gulab jamuns */}
        <g filter="url(#dropSoft)" transform="translate(30 84)">
          <ellipse cx="16" cy="9" rx="22" ry="6.5" fill="#d8cbb0" />
          <ellipse cx="16" cy="8" rx="22" ry="6" fill="#e7dcc2" />
          <ellipse cx="16" cy="8.5" rx="16" ry="3.6" fill="#c9a24b" opacity="0.18" />
          {[
            [6, 6],
            [14, 5],
            [22, 6],
            [26, 8],
            [10, 8],
            [18, 8],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="3.1" fill="url(#eJamun)" />
              <circle cx={cx - 1} cy={cy - 1} r="0.9" fill="#f0d8b0" opacity="0.7" />
            </g>
          ))}
        </g>

        {/* rising steam */}
        {!reducedMotion && (
          <g className={styles.steam} stroke="#f3ead4" strokeWidth="0.8" fill="none" opacity="0.3">
            <path d="M40,80 q3,-6 0,-12 q-3,-6 0,-12" />
            <path d="M52,80 q3,-6 0,-12 q-3,-6 0,-12" />
          </g>
        )}
      </svg>

      <p className={styles.count} aria-hidden="true">
        uno · dos · tres…
      </p>
      <div className={styles.vignette} />
    </div>
  )
}
