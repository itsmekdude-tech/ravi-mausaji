import { describe, it, expect } from 'vitest'
import { tapes, formatTime } from './tapes'

describe('tapes', () => {
  it('lists the three recordings under the base path', () => {
    expect(tapes).toHaveLength(3)
    for (const t of tapes) {
      expect(t.src).toContain('/audio/')
      expect(t.src.endsWith('.m4a')).toBe(true)
      expect(t.duration).toBeGreaterThan(0)
    }
  })
})

describe('formatTime', () => {
  it('formats seconds as m:ss', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(9)).toBe('0:09')
    expect(formatTime(75)).toBe('1:15')
    expect(formatTime(975)).toBe('16:15')
  })

  it('guards against non-finite input', () => {
    expect(formatTime(NaN)).toBe('0:00')
    expect(formatTime(Infinity)).toBe('0:00')
  })
})
