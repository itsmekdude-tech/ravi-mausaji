import { useEffect, useState } from 'react'
import styles from './CalmToggle.module.css'

/** Toggles a site-wide "calm mode" (reduced motion) via <html data-calm>. */
export function CalmToggle() {
  const [calm, setCalm] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.calm = String(calm)
  }, [calm])

  return (
    <button
      className={styles.btn}
      onClick={() => setCalm((v) => !v)}
      aria-pressed={calm}
      title={calm ? 'Motion is calmed' : 'Calm the motion'}
    >
      <span className={styles.icon} data-calm={calm}>
        {calm ? '≈' : '⛆'}
      </span>
      <span className={styles.label}>{calm ? 'Calm seas' : 'Full sail'}</span>
    </button>
  )
}
