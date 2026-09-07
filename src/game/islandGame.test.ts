import { describe, it, expect } from 'vitest'
import {
  discover,
  allDiscovered,
  routeBetween,
  headingBetween,
} from './islandGame'
import { islands } from '../data/islands'

describe('discover', () => {
  it('adds ids immutably and dedupes', () => {
    const a = new Set<string>()
    const b = discover(a, 'port-blair')
    expect(a.size).toBe(0) // original untouched
    expect(b.has('port-blair')).toBe(true)
    const c = discover(b, 'port-blair')
    expect(c.size).toBe(1)
  })
})

describe('allDiscovered', () => {
  it('is false until every island is visited', () => {
    let visited = new Set<string>()
    expect(allDiscovered(islands, visited)).toBe(false)
    for (const isle of islands) visited = discover(visited, isle.id)
    expect(allDiscovered(islands, visited)).toBe(true)
  })

  it('is false for an empty island list', () => {
    expect(allDiscovered([], new Set())).toBe(false)
  })
})

describe('routeBetween', () => {
  it('returns a drawable path with positive length', () => {
    const [a, b] = islands
    const r = routeBetween(a, b, 800, 600)
    expect(r.d.startsWith('M')).toBe(true)
    expect(r.length).toBeGreaterThan(0)
  })
})

describe('headingBetween', () => {
  it('points east when the target is to the right', () => {
    const a = { ...islands[0], coords: [0.2, 0.5] as [number, number] }
    const b = { ...islands[0], coords: [0.8, 0.5] as [number, number] }
    expect(headingBetween(a, b)).toBeCloseTo(90, 0)
  })

  it('points north when the target is above', () => {
    const a = { ...islands[0], coords: [0.5, 0.8] as [number, number] }
    const b = { ...islands[0], coords: [0.5, 0.2] as [number, number] }
    expect(headingBetween(a, b)).toBeCloseTo(0, 0)
  })
})
