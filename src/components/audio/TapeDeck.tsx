import { useEffect, useRef, useState } from 'react'
import { tapes, formatTime } from '../../data/tapes'
import styles from './TapeDeck.module.css'

/**
 * A vintage cassette deck that plays Mausaji's real recordings.
 * Only appears when the audio files are actually present (local
 * family edition) — on the public deploy the files are gitignored,
 * a HEAD probe fails, and the deck stays hidden.
 */
export function TapeDeck() {
  const [available, setAvailable] = useState(false)
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [dur, setDur] = useState(tapes[0].duration)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Probe for the first tape; reveal the deck only if it exists.
  useEffect(() => {
    let cancelled = false
    fetch(tapes[0].src, { method: 'HEAD' })
      .then((r) => {
        if (!cancelled && r.ok) setAvailable(true)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const tape = tapes[idx]

  const play = () => audioRef.current?.play()
  const pause = () => audioRef.current?.pause()
  const toggle = () => (playing ? pause() : play())

  const select = (i: number) => {
    const wasPlaying = playing
    setIdx(i)
    setTime(0)
    // let the src swap, then resume if we were playing
    requestAnimationFrame(() => {
      if (wasPlaying) audioRef.current?.play()
    })
  }

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = t
    setTime(t)
  }

  if (!available) return null

  return (
    <div className={`${styles.deck} ${open ? styles.open : ''}`}>
      <audio
        ref={audioRef}
        src={tape.src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) =>
          setDur(e.currentTarget.duration || tape.duration)
        }
        onEnded={() => setPlaying(false)}
      />

      {!open ? (
        <button
          className={styles.tab}
          onClick={() => setOpen(true)}
          title="Play Mausaji's recordings"
        >
          <span className={styles.reelMini} data-spin={playing} />
          <span className={styles.tabLabel}>His voice</span>
        </button>
      ) : (
        <div className={`${styles.body} parchment-surface paper-grain`}>
          <div className={styles.header}>
            <span className={styles.brand}>Mausaji · The Tapes</span>
            <button className={styles.close} onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </div>

          <div className={styles.cassette}>
            <span className={styles.reel} data-spin={playing} />
            <div className={styles.window}>
              <span className={styles.cassetteTitle}>{tape.title}</span>
              <span className={styles.cassetteTopics}>{tape.topics}</span>
            </div>
            <span className={styles.reel} data-spin={playing} />
          </div>

          <div className={styles.transport}>
            <button className={styles.play} onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? '❚❚' : '▶'}
            </button>
            <input
              className={styles.scrub}
              type="range"
              min={0}
              max={dur}
              step={1}
              value={time}
              onChange={seek}
              aria-label="Seek"
            />
            <span className={styles.time}>
              {formatTime(time)} / {formatTime(dur)}
            </span>
          </div>

          <div className={styles.tabs}>
            {tapes.map((t, i) => (
              <button
                key={t.id}
                className={`${styles.tapeBtn} ${i === idx ? styles.tapeOn : ''}`}
                onClick={() => select(i)}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
