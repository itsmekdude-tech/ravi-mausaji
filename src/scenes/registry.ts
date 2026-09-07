import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'
import type { SceneKey } from '../data/types'

export interface SceneProps {
  /** Local scroll progress of the chapter, 0→1. */
  progress: number
  /** Whether this chapter is the active one in view. */
  active: boolean
  /** Honor reduced motion — render a static frame. */
  reducedMotion: boolean
}

/**
 * Scene registry. Heavy WebGL scenes (factory radar, capstan) are
 * code-split so their three.js payload only loads near their chapter.
 */
export const sceneRegistry: Record<
  SceneKey,
  LazyExoticComponent<ComponentType<SceneProps>>
> = {
  prologue: lazy(() => import('./PrologueScene')),
  factory: lazy(() => import('./FactoryScene/FactoryScene')),
  barter: lazy(() => import('./BarterScene/BarterScene')),
  sentry: lazy(() => import('./SentryScene/SentryScene')),
  capstan: lazy(() => import('./CapstanScene/CapstanScene')),
  flyingDoctor: lazy(() => import('./FlyingDoctorScene')),
  epilogue: lazy(() => import('./EpilogueScene')),
}
