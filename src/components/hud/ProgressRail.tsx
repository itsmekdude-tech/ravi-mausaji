import type { Chapter } from '../../data/types'
import styles from './ProgressRail.module.css'

interface Props {
  chapters: Chapter[]
  active: number
}

/** Vertical chapter nav on the right edge; click a bead to sail there. */
export function ProgressRail({ chapters, active }: Props) {
  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className={styles.rail} aria-label="Chapters">
      <ul className={styles.list}>
        {chapters.map((c) => (
          <li key={c.id}>
            <button
              className={`${styles.bead} ${c.index === active ? styles.on : ''}`}
              onClick={() => go(c.id)}
              aria-current={c.index === active ? 'true' : undefined}
            >
              <span className={styles.dot} />
              <span className={styles.tip}>
                <span className={styles.tipNum}>
                  {c.index === 0
                    ? '⚓'
                    : c.index === chapters.length - 1
                      ? '☾'
                      : String(c.index).padStart(2, '0')}
                </span>
                <span className={styles.tipLabel}>{c.node?.label ?? c.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
