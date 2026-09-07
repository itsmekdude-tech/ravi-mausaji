import type { Island } from '../data/islands'
import { buildRoutePath } from '../components/map/routeGeometry'
import type { MapNode } from '../data/types'

/** Add an island to the visited set (immutably, deduped). */
export function discover(visited: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(visited)
  next.add(id)
  return next
}

/** True once every island has been visited. */
export function allDiscovered(
  list: Island[],
  visited: ReadonlySet<string>,
): boolean {
  return list.length > 0 && list.every((i) => visited.has(i.id))
}

/** A smooth chart route between two islands, ready to draw/animate. */
export function routeBetween(
  a: Island,
  b: Island,
  width: number,
  height: number,
): { d: string; length: number } {
  const toNode = (isle: Island): MapNode => ({
    id: isle.id,
    label: isle.label,
    coords: isle.coords,
    heading: 0,
  })
  return buildRoutePath([toNode(a), toNode(b)], width, height)
}

/** Compass heading (deg, 0 = up/north) for sailing from a → b on the chart. */
export function headingBetween(a: Island, b: Island): number {
  const dx = b.coords[0] - a.coords[0]
  const dy = b.coords[1] - a.coords[1]
  // screen y grows downward; north (up) = 0°, east = 90°
  const deg = (Math.atan2(dx, -dy) * 180) / Math.PI
  return (deg + 360) % 360
}

/** Load the visited set from localStorage (safe on server / private mode). */
export function loadVisited(key: string): Set<string> {
  try {
    const raw = typeof localStorage !== 'undefined' && localStorage.getItem(key)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? new Set(arr.filter((x) => typeof x === 'string')) : new Set()
  } catch {
    return new Set()
  }
}

/** Persist the visited set. */
export function saveVisited(key: string, visited: ReadonlySet<string>): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify([...visited]))
    }
  } catch {
    /* ignore quota / private-mode errors */
  }
}
