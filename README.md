# Logbook of the High Seas 🧭

An interactive keepsake of **Ravi Mausaji's** sailing years — a scroll-driven voyage
through the stories he told at the table in September 2026: the Singapore run and the
currency arbitrage, the jeans-for-vodka barter and the sentry who disciplined her
husband, the floating fish factory and the net-cutters, the giant fish on the capstan
and the dreaded tinda, and the island flying doctors.

**Live site:** https://itsmekdude-tech.github.io/ravi-mausaji/

Every word is drawn from the recorded conversation (`2026-9-5-transcript.md`) — nothing
invented. His original recordings live in `recordings/`.

## The voyage

As you scroll, a ship sails a stylized chart — Andaman Sea → Singapore → the Soviet
Union → the islands — and each stop opens a chapter with prose, a pull-quote in his
voice, and an animated scene. Two chapters have interactive 3D:

- **The radar** (Ch.1) — tap the red contact to send a patrol boat in and cut a
  trawler's nets.
- **The capstan** (Ch.4) — scroll to wind the brass drum and haul a fish up through
  the surface.

Prefer stillness? Use **Calm seas** (top-left) to reduce motion. Everything also has a
static fallback for phones and machines without WebGL.

## Running it locally

```bash
npm install
npm run dev      # http://localhost:5173/ravi-mausaji/
npm run build    # static output in dist/
npm run preview  # preview the production build
```

## How it's built

- **Vite + React + TypeScript**, no backend — a static site.
- Scroll-progress hooks + `position: sticky` pinning for the scrollytelling.
- **React Three Fiber / three.js** for the two hero 3D scenes (lazy-loaded).
- All artwork is procedural (SVG / CSS / canvas + low-poly 3D) — no external assets.
- All copy lives in `src/data/chapters.ts`, so edits never touch component code.

Design notes: `VISION.md` (the story) and `DESIGN.md` (the architecture).

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes
to GitHub Pages automatically.
