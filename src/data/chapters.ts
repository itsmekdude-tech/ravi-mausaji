import type { Chapter } from './types'

/**
 * The whole keepsake, in words.
 * Every line traces to mausaji/2026-9-5-transcript.md — nothing invented.
 * Edit stories here; components never hardcode copy.
 */

export const SITE = {
  title: 'Logbook of the High Seas',
  subtitle: "An interactive keepsake of Ravi Mausaji's sailing years",
  epigraph: {
    text: "Everyone's life is a story, you know. And sometimes, when you grow old, you realize these experiences were unique. Not everybody gets them.",
    attribution: 'Mausaji, September 2026',
  },
}

export const chapters: Chapter[] = [
  {
    id: 'prologue',
    index: 0,
    kicker: 'Open sea · before anything was digital',
    dateStamp: 'The wardroom · night watch',
    title: 'Logbook of the High Seas',
    body: [
      'These are the true stories of a Navy doctor who sailed in the years before anything was digital — when a Walkman was a marvel and a ship could disappear for weeks into the Andaman Sea.',
      'Scroll to weigh anchor. The ship is you.',
    ],
    scene: 'prologue',
    technique: '2.5D',
    accent: 'brass',
  },
  {
    id: 'factory',
    index: 1,
    kicker: 'Andaman Sea · policing sovereign waters',
    dateStamp: '1980s · Patrol · 108 islands',
    title: 'The Leviathan Factory & the Net-Cutters',
    body: [
      'Three years patrolling the waters off Port Blair, among something like a hundred-odd islands. A column of smoke rising from an empty island meant only one thing — a foreign trawler had slipped in to fish. The naval ship was slow, so often it arrived a full two days late; still it went, found them, and simply cut their nets so they could not fish, and waved them back out to sea.',
      'No prisoners. To take prisoners, he explained, you must feed them, house them, care for them — and the islands had no cells for that. So the rule was mercy by design: cut the nets, escort them off, let them go.',
      'And offshore lay the thing that astonished him — the floating fish factory. A giant ship with conveyor belts running down both flanks, crews cleaning, cutting, canning and cold-storing the catch as they sailed, then selling the whole hold before they ever reached port. Not fishing. An industry, moving on the water.',
    ],
    quote: {
      text: 'We just cut the nets so they can’t fish. It was very human.',
    },
    node: { id: 'andaman', label: 'Andaman Sea', coords: [0.3, 0.6], heading: 135 },
    scene: 'factory',
    technique: '3D',
    accent: 'phosphor',
  },
  {
    id: 'barter',
    index: 2,
    kicker: '1980–81 · the run through the Malacca Strait',
    dateStamp: '1980–81 · Approaching Singapore · Fair seas',
    title: 'Singapore Arbitrage & the Levi’s Barter',
    body: [
      'In those years the government bought ships from Russia, and his ship’s job was to sail out, pick them up and bring them home to India — always routing through Singapore. Singapore was another world: no digital anything, the Walkman a craze, video cassettes a marvel. The crew pooled their money — eight, ten thousand dollars, everybody pulling in — and shopped for jeans, cameras, and dollars themselves.',
      'Then the quiet masterstroke. A hundred Indian rupees bought about ninety Singapore dollars. A rouble officially cost twelve rupees — but one Singapore dollar bought six roubles. So paying in Singapore dollars fetched roubles at a fifty-percent discount. "Six rupees saved," he grinned — and someone at the table gave it its name: arbitrage.',
    ],
    quote: {
      text: 'Instead of taking rupees, you take Singapore dollars — you get roubles at fifty percent discount.',
    },
    node: { id: 'singapore', label: 'Singapore', coords: [0.46, 0.74], heading: 20 },
    scene: 'barter',
    technique: '2.5D',
    accent: 'brass',
  },
  {
    id: 'sentry',
    index: 3,
    kicker: 'Soviet Russia · shore duty',
    dateStamp: 'Soviet naval port · one night ashore',
    title: 'The Soviet Pier & the Sentry’s Discipline',
    body: [
      'In the Soviet ports women and men served side by side — women flew aircraft, ran ship commands, stood every duty. "But the women considered the men useless," he laughed. His theory: a state that fed you whether you worked or not drained the ambition out of a person, until many just wanted to eat, drink vodka, and let the days pass.',
      'And the Russians were wild for denim — "give me your jeans, we want your jeans" — trading vodka and their famously good chocolate for a single pair of Levi’s or Wranglers.',
      'Then the story he tells best. One night the checkpoint sentries were women. A drunk man kept trying to shove his way through. A sentry slapped him twice, hard, and pushed him off; he came back, she hit him again, then seized him by the ears and hauled him inside. Why so rough on him? "That bloody idiot is my husband! I told him to work — he went to the vodka shop instead."',
    ],
    quote: {
      text: 'That bloody idiot is my husband! This is how they discipline their husbands.',
    },
    node: { id: 'ussr', label: 'Soviet Union', coords: [0.62, 0.26], heading: 350 },
    scene: 'sentry',
    technique: '2D',
    accent: 'soviet-red',
  },
  {
    id: 'capstan',
    index: 4,
    kicker: 'The doctor’s easy days at sea',
    dateStamp: 'At sea · a calm afternoon',
    title: 'The Capstan Catch & the Tinda Dilemma',
    body: [
      'As ship’s doctor with a healthy crew, he had little to do — "no work for me; I’ll be sitting with the Captain, playing cards, doing gup-shup." So the sailors taught him to fish. A great C-shaped hook with a barbed edge — the more the fish struggles, the deeper it sets — lashed to a thick rope wound on the capstan, that big rolling drum.',
      'Throw it over. Wait for the line to draw taut. Let the fish run and tire against the moving ship along a rope so long it could wind up two kilometres. Then turn the capstan, and up comes a fish this big. They’d empty a hundred-litre engine-oil tin, fill it with seawater, and keep the catch alive inside.',
      'The catch had a catch: cooking oil was rationed, and one big fish ate the whole day’s ration — so the cook would shrug and fry it dry on the tawa. Worse was the vegetarian ration: canned tinda, tomato-shaped and utterly tasteless. However much masala you added, yaar.',
    ],
    quote: {
      text: 'Sometimes the fish gets tired, it stops. Then you just move the capstan — and up comes a fish this big.',
    },
    node: { id: 'opensea', label: 'Open Water', coords: [0.72, 0.54], heading: 90 },
    scene: 'capstan',
    technique: '3D',
    accent: 'brass',
  },
  {
    id: 'flyingDoctor',
    index: 5,
    kicker: 'The multi-service island command',
    dateStamp: 'The islands · a helicopter month',
    title: 'Island Flying Doctors',
    body: [
      'In the islands the Navy coordinated Army, Air Force and all — the commander at Port Blair a naval man, everyone under him. And medicine there had its own charm. A toothache is a horrible thing, so his friend the base dentist was flown island to island: every month a helicopter would come, pick him up, and set him down before a grateful queue. His ophthalmologist friend caught the same free rides between the atolls.',
      'A gentle irony closes the reel. He sailed these islands free of cost, decades ago, and still didn’t much love the place. "Now they want a lakh of rupees for the same trip," he shrugged. "I said — I don’t want to go." Back then he also argued India should hold Great Nicobar, sitting at the mouth of the Malacca Strait — but that is a map for another evening.',
    ],
    quote: {
      text: 'Dental pain is horrible. So every month a helicopter would come and pick him up.',
    },
    node: { id: 'islands', label: 'The Islands', coords: [0.85, 0.66], heading: 110 },
    scene: 'flyingDoctor',
    technique: '2.5D',
    accent: 'copper-oxide',
  },
  {
    id: 'epilogue',
    index: 6,
    kicker: 'San Francisco · September 2026',
    dateStamp: 'Then & now · the kitchen table',
    title: 'The Logbook Closes',
    body: [
      'Full circle. The same man who once sailed to Soviet Russia now visits Alcatraz with the family — and skips the famous walk entirely, taking a golf cart straight to the top. "We didn’t walk at all," he says. "People walk all the way up and take photos. I don’t know why."',
      'At the table the grandchildren count gulab jamuns; a toddler practises uno, dos, tres. The adventuring is done, but the storytelling isn’t. The logbook closes on the same table it opened on.',
    ],
    quote: {
      text: "Everyone’s life is a story, you know.",
    },
    scene: 'epilogue',
    technique: '2.5D',
    accent: 'lamp-glow',
  },
]

/** Chapters that place a stop on the voyage chart (in order). */
export const voyageNodes = chapters
  .filter((c) => c.node)
  .map((c) => c.node!)
