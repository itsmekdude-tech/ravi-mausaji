import type { Quote } from './types'

/**
 * The islands & ports of Mausaji's chart, for the "Chart the Islands" game.
 * Every blurb and quote traces to mausaji/2026-9-5-transcript.md — nothing
 * invented. The grounding guard in islands.test.ts enforces this.
 */
export interface Island {
  id: string
  label: string
  kind: 'island' | 'port'
  /** normalized position on the stylized chart, 0–1 */
  coords: [number, number]
  /** short emblem shown on the story card */
  motif: string
  blurb: string[]
  quote: Quote
}

export const START_ISLAND = 'port-blair'

export const islands: Island[] = [
  {
    id: 'port-blair',
    label: 'Port Blair',
    kind: 'island',
    coords: [0.5, 0.54],
    motif: '⚓',
    blurb: [
      'Home base, among something like a hundred-odd islands. In this area the Navy coordinated everyone — Army and Air Force alike came under a naval commander, a “Fortan.”',
    ],
    quote: { text: 'For defense we require Army, Navy, Air Force — and the Navy is the well-coordinated one.' },
  },
  {
    id: 'smoke',
    label: 'Smoke-Signal Island',
    kind: 'island',
    coords: [0.32, 0.4],
    motif: '🔥',
    blurb: [
      'A column of smoke from an empty island meant a foreign trawler had crept in to fish. The ship was slow — often two days late — but it went, cut their nets, and waved them off.',
      'No prisoners: you would have to feed and house them, and the islands had no cells. So the rule was mercy by design.',
    ],
    quote: { text: 'We just cut the nets so they can’t fish. It was very human.' },
  },
  {
    id: 'factory',
    label: 'The Factory Grounds',
    kind: 'island',
    coords: [0.18, 0.66],
    motif: '🐟',
    blurb: [
      'Offshore lay the floating fish factory — conveyor belts down both flanks, crews cleaning, cutting and canning as they sailed, the whole hold sold before they ever reached port.',
    ],
    quote: { text: 'It was not just fishing. It was an industry.' },
  },
  {
    id: 'fishing',
    label: 'The Fishing Grounds',
    kind: 'island',
    coords: [0.4, 0.8],
    motif: '🎣',
    blurb: [
      'With a healthy crew the doctor had little to do, so the sailors taught him to fish — a C-hook on a rope so long the capstan could wind two kilometres.',
      'The fish tires, you turn the drum, and up it comes — kept alive in a hundred-litre seawater tin.',
    ],
    quote: { text: 'Sometimes the fish gets tired, it stops. Then up comes a fish this big.' },
  },
  {
    id: 'mess',
    label: 'The Mess',
    kind: 'island',
    coords: [0.64, 0.74],
    motif: '🥫',
    blurb: [
      'Cooking oil was rationed to fifty grams a day — one big fish ate it all, so the cook fried the catch dry on the tawa.',
      'The vegetarian ration was worse: canned tinda, tomato-shaped and utterly tasteless.',
    ],
    quote: { text: 'However much masala you add, yaar.' },
  },
  {
    id: 'airforce',
    label: 'The Air-Force Isle',
    kind: 'island',
    coords: [0.68, 0.34],
    motif: '🚁',
    blurb: [
      'A toothache is a horrible thing — so his friend the base dentist was flown island to island, fetched every month by helicopter to a grateful queue.',
      'His ophthalmologist friend caught the same free rides between the atolls.',
    ],
    quote: { text: 'Every month a helicopter would come and pick him up.' },
  },
  {
    id: 'nicobar',
    label: 'Great Nicobar',
    kind: 'island',
    coords: [0.5, 0.92],
    motif: '🧭',
    blurb: [
      'Back in ’82–’83 he argued India should hold Great Nicobar — it sits at the very mouth of the Malacca Strait.',
    ],
    quote: { text: 'It is sitting at the mouth of the Malacca Strait.' },
  },
  {
    id: 'singapore',
    label: 'Singapore',
    kind: 'port',
    coords: [0.82, 0.82],
    motif: '💱',
    blurb: [
      'Every run to collect ships from Russia went via Singapore — no digital anything, Walkmans a craze. They bought jeans, cameras and dollars.',
      'And worked the quiet arbitrage: rupees into Singapore dollars, then roubles at a fifty-percent discount.',
    ],
    quote: { text: 'You take Singapore dollars — you get roubles at fifty percent discount.' },
  },
  {
    id: 'alcatraz',
    label: 'Alcatraz',
    kind: 'island',
    coords: [0.86, 0.18],
    motif: '🛎️',
    blurb: [
      'Full circle, decades on: another island, another prison. Visiting Alcatraz with the family, he took the golf cart straight to the top and skipped the famous walk.',
    ],
    quote: { text: 'We didn’t walk at all.' },
  },
]
