import { useEffect, useState } from 'react'

/**
 * Reports the index of the chapter currently occupying the viewport.
 * Sections tag themselves with data-chapter-index; the one whose center
 * is nearest the viewport center wins. Drives the compass heading,
 * logbook margin text, and lazy-mounting of 3D scenes.
 */
export function useChapterInView(count: number): number {
  const [active, setActive] = useState(0)

  useEffect(() => {
    let raf = 0
    const compute = () => {
      raf = 0
      const mid = window.innerHeight / 2
      let best = 0
      let bestDist = Infinity
      const sections = document.querySelectorAll<HTMLElement>('[data-chapter-index]')
      sections.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const dist = Math.abs(center - mid)
        if (dist < bestDist) {
          bestDist = dist
          best = Number(el.dataset.chapterIndex)
        }
      })
      setActive(best)
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [count])

  return active
}
