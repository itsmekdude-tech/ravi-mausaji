/** Content schema for the voyage. All copy lives in chapters.ts. */

export interface Quote {
  /** His words — kept close to how he actually speaks. */
  text: string
  /** Optional gentle English gloss for Hinglish phrases. */
  gloss?: string
  /** Defaults to "Mausaji". */
  attribution?: string
}

export interface MapNode {
  id: string
  /** Port label shown on the chart, e.g. "Singapore". */
  label: string
  /** Normalized position on the stylized chart (0–1, not real GPS). */
  coords: [number, number]
  /** Compass heading (degrees) the ship settles to on arrival. */
  heading: number
}

/** Registry keys → lazy-loaded hero scene components. */
export type SceneKey =
  | 'prologue'
  | 'factory'
  | 'barter'
  | 'sentry'
  | 'capstan'
  | 'flyingDoctor'
  | 'epilogue'

export type Technique = '2.5D' | '2D' | '3D'

export interface Chapter {
  id: string
  index: number
  /** Small overline, e.g. "Andaman Sea · policing sovereign waters". */
  kicker: string
  /** Logbook date stamp, e.g. "1980–81 · Fair seas". */
  dateStamp: string
  title: string
  /** Paragraphs of polished prose. */
  body: string[]
  quote?: Quote
  /** Where the ship stops; prologue/epilogue have none. */
  node?: MapNode
  scene: SceneKey
  technique: Technique
  /** Accent color hint for the section (CSS var name without --). */
  accent?: string
}
