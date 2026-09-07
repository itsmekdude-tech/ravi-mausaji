import type { Quote } from '../../data/types'
import styles from './PullQuote.module.css'

/** His words, set in a handwritten margin note. */
export function PullQuote({ quote }: { quote: Quote }) {
  return (
    <figure className={styles.quote}>
      <span className={styles.mark} aria-hidden="true">
        “
      </span>
      <blockquote className={`hand ${styles.text}`}>{quote.text}</blockquote>
      {quote.gloss && <p className={styles.gloss}>{quote.gloss}</p>}
      <figcaption className={styles.cite}>
        — {quote.attribution ?? 'Mausaji'}
      </figcaption>
    </figure>
  )
}
