import styles from './FactoryScene.module.css'

/**
 * 2.5D blueprint cutaway of the offshore fish-factory ship:
 * conveyor line, sorting stations, can-sealer, and the cold hold below.
 * Doubles as the static fallback when WebGL is unavailable.
 */
export function FactoryCutaway({ drift = 0 }: { drift?: number }) {
  return (
    <svg
      viewBox="0 0 420 240"
      className={styles.cutaway}
      style={{ transform: `translateY(${drift}px)` }}
      aria-hidden="true"
    >
      {/* sea line */}
      <path d="M0,150 H420" className={styles.waterline} />
      <path
        d="M0,150 q30,8 60,0 t60,0 t60,0 t60,0 t60,0 t60,0"
        className={styles.swell}
      />

      {/* hull */}
      <path
        d="M40,150 L360,150 L338,206 L70,206 Z"
        className={styles.hull}
      />
      <path d="M40,150 L360,150" className={styles.deck} />

      {/* superstructure */}
      <rect x="250" y="96" width="70" height="54" className={styles.house} />
      <rect x="262" y="104" width="14" height="12" className={styles.window} />
      <rect x="284" y="104" width="14" height="12" className={styles.window} />
      <line x1="300" y1="96" x2="300" y2="70" className={styles.mast} />
      <circle cx="300" cy="68" r="3" className={styles.beacon} />

      {/* conveyor belt across the deck */}
      <g>
        <rect x="60" y="132" width="170" height="10" rx="3" className={styles.belt} />
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={i}
            x1={66 + i * 17}
            y1="132"
            x2={66 + i * 17}
            y2="142"
            className={styles.beltTick}
          />
        ))}
        {/* fish on the belt */}
        {[80, 120, 168, 205].map((x, i) => (
          <ellipse key={i} cx={x} cy="130" rx="7" ry="3" className={styles.fish} />
        ))}
      </g>

      {/* sorting + can-sealer stations */}
      <rect x="62" y="112" width="26" height="20" className={styles.station} />
      <rect x="150" y="112" width="26" height="20" className={styles.station} />
      <rect x="196" y="108" width="30" height="24" className={styles.sealer} />
      <circle cx="211" cy="120" r="6" className={styles.sealerWheel} />

      {/* cold hold below deck with stacked cans */}
      <rect x="80" y="156" width="150" height="42" className={styles.hold} />
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 9 }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={86 + c * 16}
            y={160 + r * 8}
            width="12"
            height="6"
            rx="1"
            className={styles.can}
          />
        )),
      )}

      {/* hand-lettered labels */}
      <g className={styles.labels}>
        <line x1="146" y1="122" x2="146" y2="90" className={styles.lead} />
        <text x="146" y="84" className={styles.label}>CONVEYOR LINE</text>

        <line x1="211" y1="108" x2="211" y2="82" className={styles.lead} />
        <text x="211" y="76" className={styles.label}>CAN-SEALER</text>

        <line x1="155" y1="198" x2="155" y2="220" className={styles.lead} />
        <text x="155" y="232" className={styles.label}>COLD HOLD · SOLD AT SEA</text>
      </g>
    </svg>
  )
}
