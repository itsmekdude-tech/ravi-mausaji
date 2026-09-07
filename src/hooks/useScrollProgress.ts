import { useEffect, useState } from 'react'

/**
 * Global scroll progress 0→1 across the whole document.
 * Drives the inking route line and the sea "depth" breathing.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const compute = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
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
  }, [])

  return progress
}

/**
 * Per-element progress 0→1 as it passes through the viewport
 * (0 when its top hits the bottom of the screen, 1 when its bottom
 * leaves the top). Used by scenes for scrubbed local animation.
 */
export function useElementProgress(
  ref: React.RefObject<HTMLElement | null>,
): number {
  const [p, setP] = useState(0)

  useEffect(() => {
    let raf = 0
    const compute = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height + vh
      const seen = vh - rect.top
      setP(Math.min(1, Math.max(0, seen / total)))
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
  }, [ref])

  return p
}
