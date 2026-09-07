import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { IslandGame } from './IslandGame'
import { islands } from '../../data/islands'

describe('IslandGame', () => {
  beforeEach(() => {
    // force calm mode so island selection resolves synchronously (no rAF sail)
    document.documentElement.dataset.calm = 'true'
    localStorage.clear()
  })
  afterEach(() => {
    delete document.documentElement.dataset.calm
  })

  it('opens as a dialog showing the start island story and the log', () => {
    render(<IslandGame onClose={() => {}} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // start island is Port Blair; its story card shows
    expect(screen.getByRole('heading', { name: 'Port Blair' })).toBeInTheDocument()
    // every island is a selectable marker
    for (const isle of islands) {
      expect(
        screen.getByRole('button', { name: `${isle.label} — read story` }),
      ).toBeInTheDocument()
    }
  })

  it('sailing to an island opens its grounded story', () => {
    render(<IslandGame onClose={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Great Nicobar — read story' }))
    expect(screen.getByRole('heading', { name: 'Great Nicobar' })).toBeInTheDocument()
    expect(screen.getAllByText(/Malacca Strait/i).length).toBeGreaterThan(0)
  })

  it('calls onClose from the close button', () => {
    const onClose = vi.fn()
    render(<IslandGame onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /close the map/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
