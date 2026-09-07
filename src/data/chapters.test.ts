import { describe, it, expect } from 'vitest'
import { chapters, voyageNodes, SITE } from './chapters'

describe('chapters data', () => {
  it('has all seven sections in order with unique ids', () => {
    expect(chapters).toHaveLength(7)
    chapters.forEach((c, i) => expect(c.index).toBe(i))
    const ids = new Set(chapters.map((c) => c.id))
    expect(ids.size).toBe(7)
  })

  it('gives every chapter a title and non-empty body', () => {
    for (const c of chapters) {
      expect(c.title.trim().length).toBeGreaterThan(0)
      expect(c.body.length).toBeGreaterThan(0)
      expect(c.body.every((p) => p.trim().length > 0)).toBe(true)
    }
  })

  it('places valid voyage nodes for the story chapters', () => {
    // prologue + epilogue have no node; the five story chapters do
    expect(voyageNodes.length).toBe(5)
    for (const n of voyageNodes) {
      const [x, y] = n.coords
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(1)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(1)
      expect(n.heading).toBeGreaterThanOrEqual(0)
      expect(n.heading).toBeLessThanOrEqual(360)
    }
  })

  it('every scene key maps to a known scene', () => {
    const keys = [
      'prologue',
      'factory',
      'barter',
      'sentry',
      'capstan',
      'flyingDoctor',
      'epilogue',
    ]
    for (const c of chapters) expect(keys).toContain(c.scene)
  })

  it('keeps the closing epigraph', () => {
    expect(SITE.epigraph.text.toLowerCase()).toContain(
      "everyone's life is a story",
    )
  })
})

/**
 * Grounding regression guard.
 * The transcript is the source of truth. These terms were embellishments
 * that we removed; if any reappears in the on-screen copy, fail loudly.
 */
describe('grounding: no hallucinated terms', () => {
  const haystack = JSON.stringify(chapters).toLowerCase()

  const banned = [
    'warship', // he said "ships", not warships
    'by radio', // sold before port, never "by radio"
    'winter', // no season stated
    'snowing', // no snow in the transcript
    'cold war', // his framing was "socialist", not "cold war"
  ]

  it.each(banned)('does not contain "%s"', (term) => {
    expect(haystack).not.toContain(term)
  })

  it('does not attribute the tinda ration a gram figure (50g was oil)', () => {
    const capstan = chapters.find((c) => c.id === 'capstan')!
    const text = capstan.body.join(' ').toLowerCase()
    // tinda described, but no "50g" claim in the chapter body
    expect(text).toContain('tinda')
    expect(text).not.toContain('50g')
    expect(text).not.toContain('50 g')
  })
})
