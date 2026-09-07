import { describe, it, expect } from 'vitest'
import { buildRoutePath, pointAt } from './routeGeometry'
import type { MapNode } from '../../data/types'

const nodes: MapNode[] = [
  { id: 'a', label: 'A', coords: [0, 0], heading: 0 },
  { id: 'b', label: 'B', coords: [0.5, 0.5], heading: 90 },
  { id: 'c', label: 'C', coords: [1, 1], heading: 135 },
]

describe('buildRoutePath', () => {
  it('produces a cubic path string beginning with a moveto', () => {
    const { d, length } = buildRoutePath(nodes, 260, 190)
    expect(d.startsWith('M')).toBe(true)
    expect(d).toContain('C') // smooth cubic segments
    expect(length).toBeGreaterThan(0)
  })

  it('scales node coordinates inside the padded chart bounds', () => {
    const W = 260
    const H = 190
    const { d } = buildRoutePath(nodes, W, H)
    // first moveto point should sit at the top-left pad, not (0,0)
    const first = d.match(/M\s*([\d.]+),([\d.]+)/)
    expect(first).not.toBeNull()
    const [, x, y] = first!
    expect(Number(x)).toBeGreaterThan(0)
    expect(Number(y)).toBeGreaterThan(0)
    expect(Number(x)).toBeLessThan(W)
    expect(Number(y)).toBeLessThan(H)
  })

  it('handles a single-node degenerate route without throwing', () => {
    const { d } = buildRoutePath([nodes[0]], 100, 100)
    expect(d.startsWith('M')).toBe(true)
  })
})

describe('pointAt', () => {
  it('returns a point and travel angle along the path', () => {
    const { d, length } = buildRoutePath(nodes, 260, 190)
    const p = pointAt(d, length, 0.5)
    expect(typeof p.x).toBe('number')
    expect(typeof p.y).toBe('number')
    expect(typeof p.angle).toBe('number')
  })

  it('clamps t outside [0,1]', () => {
    const { d, length } = buildRoutePath(nodes, 260, 190)
    const under = pointAt(d, length, -1)
    const over = pointAt(d, length, 2)
    expect(Number.isFinite(under.x)).toBe(true)
    expect(Number.isFinite(over.x)).toBe(true)
  })
})
