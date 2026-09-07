import type { MapNode } from '../../data/types'

/** A smooth catmull-rom-ish cubic path through the (normalized) nodes. */
export function buildRoutePath(
  nodes: MapNode[],
  width: number,
  height: number,
): { d: string; length: number } {
  const pad = 22
  const pts = nodes.map((n) => ({
    x: pad + n.coords[0] * (width - pad * 2),
    y: pad + n.coords[1] * (height - pad * 2),
  }))

  if (pts.length < 2) {
    const d = pts.length ? `M${pts[0].x},${pts[0].y}` : ''
    return { d, length: measure(d) }
  }

  let d = `M ${pts[0].x},${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const t = 0.18
    const c1x = p1.x + (p2.x - p0.x) * t
    const c1y = p1.y + (p2.y - p0.y) * t
    const c2x = p2.x - (p3.x - p1.x) * t
    const c2y = p2.y - (p3.y - p1.y) * t
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`
  }
  return { d, length: measure(d) }
}

/** Point + travel angle (degrees) at fraction t along a path string. */
export function pointAt(
  d: string,
  length: number,
  t: number,
): { x: number; y: number; angle: number } {
  const el = getMeasurer()
  if (!el || !d) return { x: 0, y: 0, angle: 0 }
  el.setAttribute('d', d)
  const clamped = Math.min(1, Math.max(0, t))
  const p = el.getPointAtLength(clamped * length)
  const ahead = el.getPointAtLength(Math.min(length, clamped * length + 1))
  const angle = (Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI
  return { x: p.x, y: p.y, angle }
}

// --- shared hidden measuring path (browser only) ---
let measurer: SVGPathElement | null = null
function getMeasurer(): SVGPathElement | null {
  if (typeof document === 'undefined') return null
  if (measurer) return measurer
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.style.position = 'absolute'
  svg.style.visibility = 'hidden'
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  svg.appendChild(path)
  document.body.appendChild(svg)
  measurer = path
  return measurer
}

function measure(d: string): number {
  const el = getMeasurer()
  if (!el || !d) return 1
  el.setAttribute('d', d)
  return el.getTotalLength() || 1
}
