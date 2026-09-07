import { Suspense, useRef } from 'react'
import type { Chapter } from '../../data/types'
import { sceneRegistry } from '../../scenes/registry'
import { useElementProgress } from '../../hooks/useScrollProgress'
import { PullQuote } from './PullQuote'
import { SceneFallback } from './SceneFallback'
import styles from './ChapterSection.module.css'

interface Props {
  chapter: Chapter
  active: boolean
  reducedMotion: boolean
}

/** Cross-fade the sticky scene in as the track enters and out as it leaves. */
function sceneFade(p: number): number {
  const inFade = Math.min(1, p / 0.14)
  const outFade = Math.min(1, (1 - p) / 0.14)
  return Math.max(0, Math.min(inFade, outFade))
}

/**
 * One chapter = a tall scroll track with a sticky full-viewport stage.
 * The hero scene sits in the stage (pinned via position: sticky); the
 * logbook card carries the prose. Bookends run shorter than story chapters.
 */
export function ChapterSection({ chapter, active, reducedMotion }: Props) {
  const trackRef = useRef<HTMLElement>(null)
  const progress = useElementProgress(trackRef)
  const Scene = sceneRegistry[chapter.scene]
  const isBookend = chapter.scene === 'prologue' || chapter.scene === 'epilogue'

  return (
    <section
      ref={trackRef}
      id={chapter.id}
      data-chapter-index={chapter.index}
      className={`${styles.track} ${isBookend ? styles.bookend : ''}`}
      style={{ ['--accent' as string]: `var(--${chapter.accent ?? 'brass'})` }}
      aria-label={`Chapter ${chapter.index}: ${chapter.title}`}
    >
      <div className={styles.stage}>
        <div
          className={styles.scene}
          aria-hidden="true"
          style={{ opacity: reducedMotion ? 1 : sceneFade(progress) }}
        >
          <Suspense fallback={<SceneFallback />}>
            <Scene
              progress={progress}
              active={active}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </div>

        <article
          className={`${styles.card} parchment-surface paper-grain ${
            isBookend ? styles.cardCenter : ''
          }`}
        >
          <header className={styles.head}>
            <p className={styles.kicker}>{chapter.kicker}</p>
            <p className={styles.date}>{chapter.dateStamp}</p>
          </header>

          <h2 className={styles.title}>{chapter.title}</h2>

          <div className={styles.body}>
            {chapter.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {chapter.quote && <PullQuote quote={chapter.quote} />}
        </article>
      </div>
    </section>
  )
}
