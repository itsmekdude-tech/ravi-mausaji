/**
 * Palette mirror for JS / 3D (React Three Fiber) use.
 * Keep in sync with src/styles/tokens.css so the WebGL scenes
 * share the exact same parchment/phosphor/brass language.
 */
export const palette = {
  parchment: '#e9ddc3',
  parchmentHi: '#f3ead4',
  ink: '#23303b',
  inkSoft: '#4a5a63',

  seaAbyss: '#061019',
  seaDeep: '#0b1f2a',
  sea: '#123543',
  seaShallow: '#1f5763',
  seaFoam: '#6fb0ad',

  phosphor: '#00ff9c',
  phosphorDim: '#0a7f56',

  blueprint: '#2b6f86',
  blueprintLine: '#5b93a6',

  brass: '#c9a24b',
  brassHi: '#e6c878',
  brassShadow: '#8a6b28',
  copperOxide: '#4c7d70',

  sovietRed: '#b8412f',
  lampGlow: '#f0b968',
  goldRoute: '#e8c46a',
} as const

export type PaletteKey = keyof typeof palette
