import { useState } from 'react'
import styles from './MessHallMenu.module.css'

/** A card that flips between the fresh catch and the dreaded ration. */
export function MessHallMenu() {
  const [ration, setRation] = useState(false)

  return (
    <div className={styles.wrap}>
      <div className={`${styles.card} ${ration ? styles.flipped : ''}`}>
        <div className={`${styles.face} ${styles.catch}`}>
          <p className={styles.tag}>Menu A · The Catch</p>
          <p className={styles.dish}>🐟 Fresh Fish, Dry-Fried</p>
          <p className={styles.note}>
            Oil was rationed to 50g a day — one big fish ate it all. So the cook
            fried it dry on the tawa.
          </p>
        </div>
        <div className={`${styles.face} ${styles.ration}`}>
          <p className={styles.tag}>Menu B · The Ration</p>
          <p className={styles.dish}>🥫 Canned Tinda</p>
          <p className={styles.note}>
            The vegetarian ration. Tomato-shaped, utterly tasteless — however
            much masala you add, yaar.
          </p>
        </div>
      </div>
      <button className={styles.toggle} onClick={() => setRation((v) => !v)}>
        {ration ? 'Show the catch' : 'Show the ration'}
      </button>
    </div>
  )
}
