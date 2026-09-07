import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => cleanup())

// jsdom lacks matchMedia — used by useReducedMotion.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

// jsdom lacks SVG geometry math — used by routeGeometry & flight paths.
// Provide a deterministic linear stand-in.
Object.defineProperty(SVGElement.prototype, 'getTotalLength', {
  writable: true,
  value: () => 100,
})
Object.defineProperty(SVGElement.prototype, 'getPointAtLength', {
  writable: true,
  value: (len: number) => ({ x: len, y: 0 }),
})

// jsdom returns no WebGL context — keeps hasWebGL() false (static fallbacks)
// and silences the "Not implemented: getContext" noise.
HTMLCanvasElement.prototype.getContext = (() => null) as never

// jsdom doesn't implement media playback or scrollIntoView.
HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
HTMLMediaElement.prototype.pause = vi.fn()
Element.prototype.scrollIntoView = vi.fn()

// TapeDeck probes audio with fetch(HEAD); keep it offline & hidden in tests.
vi.stubGlobal(
  'fetch',
  vi.fn().mockResolvedValue({ ok: false, status: 404 } as Response),
)
