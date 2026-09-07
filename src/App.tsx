import { useEffect } from 'react'
import { chapters } from './data/chapters'
import { ChapterSection } from './components/chapter/ChapterSection'
import { VoyageChart } from './components/map/VoyageChart'
import { CompassRose } from './components/hud/CompassRose'
import { ProgressRail } from './components/hud/ProgressRail'
import { CalmToggle } from './components/hud/CalmToggle'
import { TapeDeck } from './components/audio/TapeDeck'
import { SvgFilters } from './components/fx/SvgFilters'
import { useScrollProgress } from './hooks/useScrollProgress'
import { useChapterInView } from './hooks/useChapterInView'
import { useReducedMotion } from './hooks/useReducedMotion'

export default function App() {
  const progress = useScrollProgress()
  const active = useChapterInView(chapters.length)
  const reducedMotion = useReducedMotion()

  const activeChapter = chapters[active] ?? chapters[0]
  const heading = activeChapter.node?.heading ?? 0

  // Sea "depth" breathes with the active chapter: bookends & landfalls
  // sit in shallow lit water, mid-voyage runs deep.
  useEffect(() => {
    const isBookend =
      activeChapter.scene === 'prologue' || activeChapter.scene === 'epilogue'
    const depth = isBookend ? 0.9 : activeChapter.node ? 0.55 : 0.4
    document.documentElement.style.setProperty('--depth', String(depth))
  }, [activeChapter])

  return (
    <>
      <SvgFilters />
      <div className="sea-backdrop" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />

      <CalmToggle />
      <CompassRose heading={heading} />
      <VoyageChart progress={progress} activeNodeId={activeChapter.node?.id} />
      <ProgressRail chapters={chapters} active={active} />
      <TapeDeck />

      <main>
        {chapters.map((chapter) => (
          <ChapterSection
            key={chapter.id}
            chapter={chapter}
            active={chapter.index === active}
            reducedMotion={reducedMotion}
          />
        ))}
      </main>
    </>
  )
}
