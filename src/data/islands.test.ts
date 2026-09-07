import { describe, it, expect } from 'vitest'
import { islands, START_ISLAND } from './islands'

describe('islands data', () => {
  it('has unique ids and a valid start island', () => {
    const ids = new Set(islands.map((i) => i.id))
    expect(ids.size).toBe(islands.length)
    expect(islands.length).toBeGreaterThanOrEqual(8)
    expect(ids.has(START_ISLAND)).toBe(true)
  })

  it('places every island on the chart with content', () => {
    for (const isle of islands) {
      const [x, y] = isle.coords
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(1)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(1)
      expect(isle.label.trim().length).toBeGreaterThan(0)
      expect(isle.blurb.length).toBeGreaterThan(0)
      expect(isle.blurb.every((p) => p.trim().length > 0)).toBe(true)
      expect(isle.quote.text.trim().length).toBeGreaterThan(0)
      expect(['island', 'port']).toContain(isle.kind)
    }
  })
})

/**
 * Grounding regression guard — the transcript is the source of truth.
 * These embellishments were removed from the story copy; they must never
 * appear in the island content either.
 */
describe('islands grounding: no hallucinated terms', () => {
  const haystack = JSON.stringify(islands).toLowerCase()
  const banned = ['warship', 'by radio', 'winter', 'snow', 'cold war']

  it.each(banned)('does not contain "%s"', (term) => {
    expect(haystack).not.toContain(term)
  })

  it('attributes the 50g ration to oil, not tinda', () => {
    const mess = islands.find((i) => i.id === 'mess')!
    const text = mess.blurb.join(' ').toLowerCase()
    expect(text).toContain('oil')
    expect(text).toContain('fifty grams')
    // the gram figure must sit with oil, never with tinda
    expect(text).not.toMatch(/tinda[^.]*fifty grams/)
  })
})
