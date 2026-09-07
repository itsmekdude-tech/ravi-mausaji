/**
 * Mausaji's original recordings, played in the local "family edition".
 * Files live in public/audio/ and are gitignored — so they work on
 * localhost but are not published to the public site. The TapeDeck
 * auto-hides when these are absent (e.g. on the deployed build).
 */
export interface Tape {
  id: string
  title: string
  src: string
  /** length in seconds (from afinfo) */
  duration: number
  /** what he talks about, loosely — for the listener */
  topics: string
}

const base = import.meta.env.BASE_URL

export const tapes: Tape[] = [
  {
    id: 'part1',
    title: 'Tape I',
    src: `${base}audio/part1.m4a`,
    duration: 975,
    topics: 'Singapore & Russia · the arbitrage, the jeans-for-vodka barter, the sentry',
  },
  {
    id: 'part2',
    title: 'Tape II',
    src: `${base}audio/part2.m4a`,
    duration: 1935,
    topics: 'The fish factory & net-cutters · the capstan catch · the island doctors',
  },
  {
    id: 'part3',
    title: 'Tape III',
    src: `${base}audio/part3.m4a`,
    duration: 399,
    topics: 'On the road · exercise, badminton, the drive to the temple',
  },
]

export function formatTime(sec: number): string {
  if (!isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
