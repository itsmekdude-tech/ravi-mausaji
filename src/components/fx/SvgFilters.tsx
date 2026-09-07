/**
 * A single hidden SVG holding reusable <filter> defs, mounted once in App.
 * Scenes reference these by id, e.g. filter="url(#softGlow)".
 * Keeping them global avoids re-declaring turbulence/blur per scene.
 */
export function SvgFilters() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none' }}
    >
      <defs>
        {/* soft phosphor / lamp glow */}
        <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* stronger bloom for hero glows */}
        <filter id="bigGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* grounding drop shadow for figures / props */}
        <filter id="dropSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#050d13" floodOpacity="0.5" />
        </filter>

        {/* organic paper/ink edge displacement */}
        <filter id="paperFiber">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" />
        </filter>

        {/* comic ben-day halftone wash */}
        <filter id="halftone" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1" result="a" />
          <feComponentTransfer in="a" result="dots">
            <feFuncA type="discrete" tableValues="0 0 0 1" />
          </feComponentTransfer>
          <feComposite in="dots" in2="SourceGraphic" operator="in" />
        </filter>

        {/* subtle ink bleed for hand lettering */}
        <filter id="inkBleed" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.4" result="s" />
          <feColorMatrix in="s" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 -0.2" />
        </filter>

        {/* brushed-metal sheen gradient (referenced as fill) */}
        <linearGradient id="brassSheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brass-hi)" />
          <stop offset="42%" stopColor="var(--brass)" />
          <stop offset="58%" stopColor="var(--brass-shadow)" />
          <stop offset="100%" stopColor="var(--brass)" />
        </linearGradient>
      </defs>
    </svg>
  )
}
