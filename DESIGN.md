# Logbook of the High Seas — Technical Design

Companion to [`VISION.md`](./VISION.md). That doc is *what* and *why*; this is *how*. Covers architecture, file layout, the scroll engine, both 3D set-pieces, the data model, styling system, and the build phases.

---

## 1. Goals & constraints

- **Static, self-contained, giftable.** No backend, no login. Builds to plain files hostable on Netlify / GitHub Pages / a USB stick.
- **Hybrid rendering.** 2.5D parchment/parallax everywhere; real WebGL (React Three Fiber) reserved for **two** hero scenes — Ch.1 radar, Ch.4 capstan.
- **Procedural art for v1.** SVG / CSS / canvas + low-poly 3D. No external image pipeline required; richer art can be dropped in later.
- **Content-driven.** All prose, quotes, dates, and coordinates live in a data file, not hardcoded in components — so copy edits never touch code.
- **Graceful degradation.** Works without audio; respects `prefers-reduced-motion`; readable on a phone; WebGL scenes fall back to a static illustration if the GPU/context is unavailable.
- **Performance budget.** First meaningful paint fast; 3D lazy-loaded per chapter; target smooth scroll on a mid-range laptop and a modern phone.

---

## 2. Stack

| Concern | Choice | Notes |
|---|---|---|
| Build / dev server | **Vite** | Fast HMR, static output. |
| UI | **React 18** + TypeScript | Component model; TS for the data schema. |
| Scroll spine | **GSAP + ScrollTrigger** | Pinning, scrubbed timelines, the inking route line. |
| Micro-UI motion | **Framer Motion** | Panel reveals, card flips, toggles. |
| 3D | **three.js** via **@react-three/fiber** + **@react-three/drei** | Radar + capstan only, code-split. |
| Audio (optional) | **Howler.js** | Ambient beds + per-scene voice; loaded lazily, off by default. |
| Styling | **CSS Modules + CSS variables** (design tokens) | Tailwind optional; tokens make the "parchment/phosphor" theme centrally editable. |
| Lint/format | ESLint + Prettier | |

No router — single scroll page. Deep-links to chapters via hash + `scrollIntoView`.

---

## 3. Information architecture

One continuous vertical scroll. Each chapter is a full-viewport (or taller) **pinned** section. A persistent **map/compass HUD** and a **logbook margin** overlay the whole journey.

```
┌─ Fixed HUD ────────────────────────────────┐
│  compass rose · current heading · progress │   ← always visible
├─ Fixed logbook margin (desktop) ───────────┤
│  date stamp · running "day's entry" text   │   ← updates per chapter
└────────────────────────────────────────────┘
   Prologue → Ch1 → Ch2 → Ch3 → Ch4 → Ch5 → Epilogue
   (scroll)   pin   pin   pin   pin   pin   pin
   └──────── golden route line inks across ───┘
```

Navigation: a slim chapter rail (port names) lets you jump; scroll progress drives the ship along the route.

---

## 4. File structure

```
mausaji/                      ← docs live here (VISION.md, DESIGN.md, transcript)
app/                          ← the web app (new)
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── public/
│   ├── audio/                ← ambient beds, (later) Mausaji voice clips
│   └── textures/             ← paper grain, noise, radar glow PNGs
└── src/
    ├── main.tsx
    ├── App.tsx               ← assembles chapters in order
    ├── data/
    │   ├── chapters.ts       ← ALL content: prose, quotes, dates, coords, headings
    │   └── types.ts          ← Chapter, Quote, MapNode schemas
    ├── styles/
    │   ├── tokens.css        ← color, type, spacing, texture variables
    │   └── global.css
    ├── theme/
    │   └── palette.ts        ← token values mirrored for JS/3D use
    ├── hooks/
    │   ├── useScrollProgress.ts
    │   ├── useReducedMotion.ts
    │   └── useChapterInView.ts
    ├── components/
    │   ├── hud/
    │   │   ├── CompassRose.tsx
    │   │   ├── ProgressRail.tsx
    │   │   └── LogbookMargin.tsx
    │   ├── map/
    │   │   ├── VoyageMap.tsx      ← the sea chart + ship + inking route line
    │   │   └── RouteLine.tsx
    │   ├── chapter/
    │   │   ├── ChapterSection.tsx ← pinning + layout wrapper for every chapter
    │   │   ├── PullQuote.tsx      ← "handwritten" quote in his voice
    │   │   └── DateStamp.tsx
    │   ├── fx/
    │   │   ├── ParallaxLayer.tsx
    │   │   ├── PaperGrain.tsx
    │   │   └── Waves.tsx
    │   └── audio/
    │       └── AudioToggle.tsx
    └── scenes/                    ← one folder per chapter's hero visual
        ├── PrologueScene.tsx
        ├── FactoryScene/          ← Ch1: 2.5D cutaway + 3D radar
        │   ├── FactoryCutaway.tsx     (2.5D SVG/layers)
        │   └── RadarScene.tsx         (★ R3F, code-split)
        ├── BarterScene/          ← Ch2: suitcase drag-toy + currency flow
        │   ├── BarterBoard.tsx
        │   └── CurrencyScale.tsx
        ├── SentryScene/          ← Ch3: comic panels
        │   └── SentryPanels.tsx
        ├── CapstanScene/         ← Ch4: ★ R3F capstan + mess-hall menu
        │   ├── CapstanReel.tsx        (★ R3F, code-split)
        │   └── MessHallMenu.tsx
        ├── FlyingDoctorScene.tsx ← Ch5: flight-path map
        └── EpilogueScene.tsx     ← bookend
```

Docs stay in `mausaji/`; the app is a sibling `app/` folder so the keepsake text and the code are cleanly separated.

---

## 5. Data model

Content is fully externalized. Editing a story = editing `chapters.ts`, never a component.

```ts
// src/data/types.ts
export interface Quote {
  text: string;          // his words, verbatim-ish
  gloss?: string;        // optional English gloss for Hinglish
  attribution?: string;  // default: "Mausaji"
}

export interface MapNode {
  id: string;
  label: string;         // "Singapore"
  coords: [number, number]; // normalized 0–1 on the stylized chart, not real GPS
  heading: number;       // compass degrees the ship turns to on arrival
}

export interface Chapter {
  id: string;            // "factory", "barter", ...
  index: number;
  kicker: string;        // "Andaman Sea · policing sovereign waters"
  dateStamp: string;     // "1980–81 · Fair seas"
  title: string;
  body: string[];        // paragraphs of polished prose
  quote: Quote;
  node?: MapNode;        // where the ship stops (prologue/epilogue have none)
  scene: SceneKey;       // which hero visual to mount
  technique: '2.5D' | '2D' | '3D';
}
```

`SceneKey` is a union that maps to a lazy-loaded component in a registry, so `ChapterSection` stays dumb and content stays declarative.

---

## 6. The scroll engine

A single GSAP timeline governs the journey; ScrollTrigger scrubs it to scroll position.

- **Route inking.** The golden path is one SVG `<path>`; its `stroke-dashoffset` is tweened from full to zero as global scroll progresses, so the line draws itself coast-to-coast. The ship is positioned along the same path via `MotionPathPlugin` (or manual `getPointAtLength`).
- **Chapter pinning.** Each `ChapterSection` registers a ScrollTrigger that **pins** the section while its internal timeline plays (radar sweeps, suitcase trades, capstan winds), then unpins and hands off to the next.
- **Sea depth breathing.** A background color/parallax variable is driven by scroll so open-water stretches darken and landfalls lighten.
- **Compass.** Heading interpolates toward the active chapter's `node.heading`; the needle eases, it doesn't snap.
- **Reduced motion.** When `prefers-reduced-motion` is set (or the user toggles "calm mode"), pinning/scrubbing is replaced by simple fade-in-on-enter, and 3D scenes render a single static frame.

Cleanup: every ScrollTrigger and GSAP context is created inside `useLayoutEffect` with a matching `ctx.revert()` teardown to survive React re-renders and route changes.

---

## 7. Hero scene A — Radar sweep (Ch.1, R3F)

**Goal:** a phosphor-green radar disc sweeping over the 108 islands; click a smoking blip to play the net-cut mini-story.

- **Render:** an orthographic R3F scene, code-split (`React.lazy`) and mounted only when Ch.1 is near viewport. A `<Suspense>` fallback shows the static cutaway art so there's never a blank hole.
- **Sweep:** a radial gradient "wedge" mesh (or shader) rotating on a timer; a phosphor trail via a fading alpha ring. Bloom kept cheap (drei `<Bloom>` optional, or a texture glow to avoid postprocessing cost).
- **Islands:** ~12 representative dots (not literally 108 — stylized) scattered on the disc; one carries a rising smoke sprite.
- **Interaction:** raycast on the smoking blip → triggers a small scripted sequence: a vessel icon eases toward it, a "net" line snaps, a `SNIP` label + the pull-quote fade in. Pure R3F/tween, no physics.
- **Fallback:** no WebGL context → the 2.5D `FactoryCutaway` with a CSS-animated sweep stands in.

**Scope guard:** stylized, low-poly/sprite-based. No detailed ship model.

---

## 8. Hero scene B — Capstan reel (Ch.4, R3F)

**Goal:** scroll spins a brass capstan; rope winds, depth ticks, a big fish surfaces into a seawater barrel.

- **Render:** R3F scene, code-split, mounted near Ch.4. Camera framed on the drum.
- **Drum:** a low-poly cylinder (brass material, light env map from drei) whose `rotation.y` is bound to the chapter's scroll progress.
- **Rope + fish:** rope is a simple tube/line whose visible length shortens with progress (faking the wind-up); depth markers are text sprites ticking past. Near the end, a stylized fish mesh rises on an eased Y curve and breaks a water-plane; a splash sprite fires.
- **Barrel:** a 100-litre-tin prop with a translucent water surface; the fish settles inside at the end.
- **Interaction:** primarily scroll-scrubbed; optional "give it a spin" drag as a bonus.
- **Fallback:** static hero image of the drum + fish, with the menu toggle still fully functional.

**Scope guard:** the *wow* is the motion, not polygon count. Keep meshes minimal.

---

## 9. 2.5D / 2D scene notes

- **Ch.2 Barter Board.** HTML/CSS/SVG drag-and-drop (pointer events, not a heavy lib). Dragging a denim item into the "trade" zone animates the three-currency scale (₹→S$→₽) via Framer Motion; a running "savings" counter ticks up. All values from `chapters.ts`.
- **Ch.3 Sentry Panels.** Fixed comic panels revealed sequentially by scroll (staggered opacity/clip-path). Hand-lettered translation box for the punchline. Cel-shaded look via flat SVG shapes + hard shadows.
- **Ch.5 Flight Path.** SVG atoll chart; a helicopter sprite tweened along an SVG path (`MotionPath`), thought-bubble popups on each island keyframed to path progress.
- **Prologue / Epilogue.** Book-open / book-close via CSS 3D transform on a two-page spread; parallax starfield → warm-kitchen crossfade at the end.

---

## 10. Styling system

- **Tokens** (`tokens.css`) as CSS variables: `--parchment`, `--ink`, `--phosphor`, `--blueprint`, `--brass`, `--lamp-glow`, plus type scale and spacing. Mirrored in `palette.ts` for use inside Canvas/3D materials so the whole thing shares one palette.
- **Texture layer.** A tiled paper-grain PNG + subtle SVG noise overlaid at low opacity site-wide; fold/stain accents placed per chapter.
- **Type.** Two families loaded locally (self-hosted for offline giftability): a worn serif (prose) and a condensed constructivist sans (labels/dates). `font-display: swap`.
- **Responsive.** Desktop shows the logbook margin beside the scene; on mobile the margin collapses into a top date-stamp and the scenes go full-width. Touch drag replaces mouse drag on the Barter Board.

---

## 11. Audio (optional, later)

- Off by default; a single `AudioToggle` in the HUD.
- **Ambient bed** (waves/horn/Morse) loops quietly; **per-chapter stingers** on entry.
- **His voice:** requires the source recordings (we only have the transcript today). When available, drop clips in `public/audio/`, reference them per chapter in `chapters.ts`, and Howler triggers them via `useChapterInView`. Everything else works without them.

---

## 12. Accessibility & fallbacks

- `prefers-reduced-motion` → calm mode (fades, static 3D frames).
- All quotes/prose are real text (screen-reader friendly); scenes are decorative with `aria-hidden` where appropriate and a text summary alternative.
- Keyboard: chapter rail is focusable; Enter jumps to a chapter.
- Color contrast checked for the parchment/ink body text (phosphor green used for accents, never body copy).
- WebGL absent/blocked → static illustrations; site remains fully legible.

---

## 13. Build phases

**Phase 0 — Scaffold.** Vite + React + TS, tokens/global CSS, fonts, `chapters.ts` seeded with all copy from `VISION.md`, empty `ChapterSection` pinning working, HUD + route-line drawing across placeholder sections.

**Phase 1 — Vertical slice (first review).**
- Full aesthetic shell (parchment, HUD, compass, logbook margin, route line).
- **Ch.1** complete: 2.5D factory cutaway + **3D radar sweep** with click-to-cut interaction.
- **Ch.4** complete: **3D capstan reel** + mess-hall menu toggle.
- Prologue + Epilogue book open/close.
- → **Stop, review in browser, lock the look.**

**Phase 2 — Fill the voyage.** Ch.2 Barter Board, Ch.3 Sentry Panels, Ch.5 Flight Path. Polish transitions between chapters.

**Phase 3 — Finish & harden.** Reduced-motion pass, mobile pass, WebGL fallbacks, performance profiling/code-splitting, deploy config (Netlify/Pages), README for the family.

**Phase 4 — Optional enrichments.** Real audio layer; swap procedural art for watercolor/AI illustrations in hero scenes; printable poster export of key renders.

---

## 14. Definition of done (v1)

- All 7 sections scroll smoothly on laptop + phone.
- Both 3D scenes interactive, with static fallbacks.
- 100% of prose/quotes sourced from the transcript, editable in one data file.
- Reduced-motion and no-WebGL paths verified.
- One-command dev (`npm run dev`) and build (`npm run build`); static output deploys as-is.

---

## 15. Open questions / decisions still to lock

1. **Audio:** do the original recordings exist to include his real voice, or ship silent-with-ambient for now?
2. **Real photos:** any family/navy photos to fold into the Epilogue, or keep it fully illustrated?
3. **Hosting:** private link (Netlify) vs. GitHub Pages vs. offline file — affects the deploy step only.
4. **Names in credits:** list the family at the table in the Epilogue, or keep it about him?
