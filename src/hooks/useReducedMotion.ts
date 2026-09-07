import { useEffect, useState } from 'react'

/**
 * Tracks the user's motion preference (OS setting or the in-app calm toggle,
 * which sets a `data-calm` attribute on <html>). When true, scenes should
 * render a single static frame and skip scrubbed/pinned animation.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const root = document.documentElement

    const compute = () =>
      setReduced(mq.matches || root.dataset.calm === 'true')

    compute()
    mq.addEventListener('change', compute)

    const observer = new MutationObserver(compute)
    observer.observe(root, { attributes: true, attributeFilter: ['data-calm'] })

    return () => {
      mq.removeEventListener('change', compute)
      observer.disconnect()
    }
  }, [])

  return reduced
}
