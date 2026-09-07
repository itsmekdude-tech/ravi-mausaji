# Logbook of the High Seas

### An interactive keepsake of Mausaji's sailing years

> *"Everyone's life is a story, you know. And sometimes, when you grow old, you realize these experiences were unique. Not everybody gets them."*
> — Mausaji, September 2026

---

## 1. What this is

A single-page, scroll-driven web experience that turns a retired Indian Navy doctor's dinner-table stories into a living picture book.

It fuses two ideas:

- **The Voyage** — the spine. As you scroll, a small ship sails across a stylized ocean chart, stopping at the real ports of his career: **Vizag → Singapore → the Soviet Union → the Andaman & Nicobar Islands**. Each stop opens a chapter.
- **The Logbook of the High Seas** — the skin. The whole thing looks and feels like a naval officer's personal journal crossed with a vintage documentary: weathered parchment, radar-green phosphor, blueprint diagrams, Soviet-constructivist type, and watercolor-washed archival sketches.

It is meant to be **memorabilia** — something the family can open on a phone or laptop years from now and hear him again.

---

## 2. Mood & aesthetic

| Element | Direction |
|---|---|
| **Palette** | Aged parchment & ink; radar/phosphor green `#00ff9c` accents; naval blueprint blue; brass & oxidized copper; a single warm lamp-glow for "now." |
| **Typography** | A worn serif for prose (the logbook hand); a condensed constructivist sans for labels, dates, and Russian/nautical signage. |
| **Texture** | Paper grain, coffee-ring stains, fold creases, faint grid lines, hand-drawn margin doodles. |
| **Motion** | Slow and weighty — swelling parallax waves, drifting clouds, a compass needle that settles, a route line that inks itself across the chart as you scroll. Nothing bounces; everything *sails*. |
| **Sound (optional layer)** | Ambient swell, distant ship horns, radio static and Morse chirps on chapter entry. His **real** laugh and voice fade in per scene — *pending the source audio; we only have the transcript today.* |

**Guiding principle:** every visual is anchored to something he actually said. No invented history. Where we can, his own words appear as pull-quotes in his "handwriting."

---

## 3. The through-line

The reader *is* the ship. A thin golden route line inks itself across a dark sea-chart as they scroll, the compass rose spinning to each new heading. Ports rise out of the fog as you approach; the logbook page on the side fills in with the day's entry. Between chapters, the sea deepens (color and parallax) then shallows again at landfall — a breathing rhythm of open water and arrival.

Framing device: a **date-stamped logbook entry** opens each chapter (e.g. *"1980–81 · Approaching Singapore · Fair seas"*), grounding it in his timeline.

---

## 4. The chapters

Each chapter below has: the **story** (polished from his own telling), a **pull-quote**, and the **visual + interactive treatment** with its build technique per our *hybrid* decision — mostly 2.5D parchment/parallax, with **real React Three Fiber 3D reserved for two hero moments** (the radar sweep and the capstan reel).

---

### Prologue — "Everyone's life is a story"

A dark sea under stars. The logbook lies closed on a wardroom table, brass compass beside it. The cover opens; the title inks itself. A short line sets the frame: *these are the true stories of a Navy doctor who sailed in the years before anything was digital.*

- **Treatment:** parchment + parallax starfield, book-open animation. 2.5D.

---

### Chapter 1 — The Leviathan Factory & the Net-Cutters
*Andaman Sea · policing sovereign waters*

**Story.** Three years patrolling the waters off Port Blair, among something like a hundred-odd islands. A column of smoke from an empty island meant a foreign trawler had crept in to fish. The naval ship — slow, so often arriving 48 hours late — would find them, and simply **cut their nets** so they couldn't fish, and wave them back out. No prisoners: *"To take prisoners, you have to feed them, take care of them… it was very human, you know. There was no fighting."* And offshore, the thing that astonished him — the **floating fish factory**: a giant ship with conveyor belts running down both sides, crews cleaning, cutting, canning and cold-storing as they went, then **selling the whole catch by radio before they even reached port.** *"It was not just fishing. It was an industry."*

> *"We just cut the nets so they can't fish. It was very human."*

- **Visual:** an **isometric 2.5D cutaway** of the factory ship — conveyor belts, sorting stations, can-sealers, the cold hold glowing below deck. Layered blueprint art, parts labeled by hand.
- **★ Hero interactive (real 3D):** a glowing **green radar screen** sweeps across the 108 islands. A blip trailing smoke appears; click it and a mini-animation plays — the naval vessel approaches, the net is cut, the trawler is escorted out. *React Three Fiber.*

---

### Chapter 2 — Singapore Arbitrage & the Levi's Barter
*1980–81 · the run through the Malacca Strait*

**Story.** In those years the government bought warships from the Soviet Union, and his ship's job was to **sail out and bring them home** — always routing through Singapore. Singapore was another world: no digital anything, the Walkman a craze, video cassettes a marvel. The crew pooled money — *"8 to 10 thousand dollars, everybody would pull in"* — and shopped: jeans, cameras, and **dollars themselves.** Then the quiet masterstroke, the **arbitrage**: 100 Indian rupees ≈ 90 Singapore dollars; a rouble officially cost 12 rupees, but 1 Singapore dollar bought 6 roubles — so paying in Singapore dollars got roubles at roughly **half price.** *"Six rupaye ka fayda ho gaya."* (*"Arbitrage,"* someone at the table said. *"Arbitrage,"* he agreed.)

> *"Instead of taking rupees, you take Singapore dollars — you get roubles at fifty percent discount."*

- **Visual:** a **golden route line** inks itself from the Indian coast through the Malacca Strait into Singapore and on toward Soviet ports — the Voyage map at its most literal.
- **Interactive — "The Barter Board":** a vintage split suitcase. Left: blue denim (Levi's / Wranglers), Sony Walkmans, Singapore dollars. Right: vodka bottles, Soviet chocolate bars, a bulky manual Russian camera. **Drag denim across to trade**, and watch a three-currency exchange scale (₹ → S$ → ₽) tip in his favor. 2.5D drag-toy + animated SVG currency flow.

---

### Chapter 3 — The Soviet Pier & the Sentry's Discipline
*Cold War Russia · shore duty*

**Story.** Soviet ports, where women and men served side by side — women flew aircraft, ran ship commands, stood every duty. *"But the women considered the men useless."* His theory: a socialist state fed you whether you worked or not, so ambition drained away — *"they just want to eat, have vodka, and enjoy life."* And the Russians were **wild for jeans** — *"Give me your jeans, we want your jeans"* — trading vodka and their famously good chocolate for a pair of Levi's. Then the story he tells best: one night at the naval checkpoint, the sentries were women. A drunk man kept trying to push through. A sentry slapped him twice, hard, and shoved him off — he came back, she hit him again, then grabbed him by the **ears** and dragged him inside. Asked why so rough on him — *"That bloody idiot is my husband! I told him to work; he went to the vodka shop instead."*

> *"That bloody idiot is my husband! This is how they discipline their husbands."*

- **Visual:** a **graphic-novel / cel-shaded** vignette. Snow drifting through a grey checkpoint under a streetlamp; a stumbling sailor at the gate.
- **Interactive:** the moment plays out in **comic panels** as you scroll — the slap, the ear-twist, the walk of shame — with a hand-lettered translation box for the punchline. 2D panel reveal.

---

### Chapter 4 — The Capstan Catch & the Tinda Dilemma
*The doctor's easy days at sea*

**Story.** As ship's doctor with a healthy crew, he had little to do — *"No work for me. I'll be sitting with the Captain, playing cards, doing gup-shup."* So the crew taught him to fish: a big **C-shaped hook** with a barbed edge — *"the more they struggle, the deeper it goes"* — lashed to a thick rope wound on the **capstan**, that big rolling drum. Throw it over; wait for the line to go taut; let the fish run and tire against the moving ship along a rope so long it *"can wind up two kilometres." Then wind the capstan and up comes a fish **this big.** They'd empty a 100-litre engine-oil tin, fill it with seawater, and keep the catch alive inside. The catch: **cooking oil was rationed** — one big fish ate the whole day's ration — so the cook would shrug and fry it dry on the *tawa*. And the vegetarian ration was worse: **canned tinda**, tomato-shaped, utterly tasteless — *"however much masala you add, yaar."*

> *"Sometimes at the end of it the fish gets tired, it stops. Then you just move the capstan — and up comes a fish this big."*

- **★ Hero interactive (real 3D):** a brass **capstan you spin by scrolling.** The rope winds, depth markers tick past, the line strains — and a great fish breaks the surface into a makeshift seawater barrel. *React Three Fiber.*
- **Interactive — "The Mess-Hall Menu":** a toggle between **Menu A · The Catch** (fresh fish, dry-fried, because oil is rationed) and **Menu B · The Ration** (a dented green tin: *"Canned Tinda — 50g daily ration — guaranteed tasteless"*). 2.5D card flip.

---

### Chapter 5 — Island Flying Doctors
*The multi-service island command*

**Story.** In the islands the Navy coordinated Army, Air Force and all — the commander (a "Fortan" at Port Blair) a naval man, everyone under him. And medicine there had a charm: a **toothache is horrible**, so his friend the **base dentist** was flown island to island — *"every month a helicopter will come, pick him up"* — treating queues of grateful patients wherever he landed. His ophthalmologist friend got the same free rides. A gentle irony closes it: he sailed those islands **free of cost** decades ago and still didn't love the place — *"now they want a lakh of rupees for the same trip. I said, I don't want to go."*

> *"Dental pain is horrible. So every month a helicopter would come and pick him up."*

- **Visual:** a stylized sea-chart of atolls with a **flight path** drawn between them; a vintage Chetak-style helicopter tracing the arc, little thought-bubbles of a cavity and an eye-chart popping over each island. 2.5D animated map path.

---

### Epilogue / Bookend — Then & Now (Alcatraz)
*San Francisco · September 2026*

**Story.** Full circle: the same man who once sailed to Soviet Russia now visits **Alcatraz** with the family — and skips the famous walk, taking a **golf cart** straight to the top instead. *"We didn't walk at all… people walk all the way up and take photos; I don't know why."* The grandchildren count gulab jamuns; a toddler learns *uno, dos, tres.* The adventuring is done, but the storytelling isn't. The logbook closes on the same table it opened on — *"Everyone's life is a story."*

- **Treatment:** the sea-chart dissolves to a warm modern kitchen; parchment gives way to a photograph feel. The book closes. Optional: a soft credits scroll of names at the table. 2.5D.

---

## 5. Tone & sourcing rules

- **His voice leads.** Prose is polished but never fancier than how he speaks. Keep the Hinglish cadence in pull-quotes.
- **Nothing invented.** Every scene traces to a line in the transcript (`mausaji/2026-9-5-transcript.md`). The geopolitics chapter (Great Nicobar / Malacca / BrahMos) is folded lightly into Ch.5's framing rather than given its own scene, to keep the arc personal rather than political.
- **Bilingual by design.** Hindi/Hinglish phrases stay, with gentle English glosses so every family member — and the youngest generation — can follow.

---

## 6. Build shape (hybrid decision)

- **Stack:** Vite + React, GSAP (ScrollTrigger) for the scroll spine, React Three Fiber for the two 3D set-pieces, Framer Motion for UI, Howler.js if/when we add audio. Static — hostable on Netlify / GitHub Pages.
- **Art:** procedural for v1 — SVG / CSS / canvas + low-poly 3D, no external tools — in the vector-blueprint style. Richer watercolor or AI art can be swapped into hero scenes later.
- **3D is reserved, not everywhere:** only Ch.1 radar and Ch.4 capstan are true WebGL; everything else is 2.5D parchment + parallax. The factory-ship "cutaway" is a layered illustration, not a 3D model.
- **First delivery — vertical slice:** the full aesthetic shell + Chapter 1 (radar) + Chapter 4 (capstan), polished, for review. Then Chapters 2, 3, 5 and the bookend.

---

## 7. Chapter map at a glance

| # | Chapter | Location | Hero visual | Technique |
|---|---|---|---|---|
| 0 | Prologue | Open sea | Logbook opens | 2.5D |
| 1 | Leviathan Factory & Net-Cutters | Andaman Sea | **Radar sweep** | **3D** |
| 2 | Singapore Arbitrage & Barter | Singapore | Barter suitcase + route line | 2.5D |
| 3 | The Sentry's Discipline | Soviet pier | Comic-panel vignette | 2D |
| 4 | Capstan Catch & Tinda | At sea | **Capstan reel** | **3D** |
| 5 | Island Flying Doctors | The islands | Helicopter flight path | 2.5D |
| 6 | Then & Now (Alcatraz) | San Francisco | Book closes | 2.5D |
