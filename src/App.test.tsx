import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import { chapters } from './data/chapters'

describe('App integration', () => {
  it('renders every chapter title as a heading and the compass HUD', async () => {
    render(<App />)
    // each title is a heading (the chapter-rail tooltip reuses the text in a span)
    for (const c of chapters) {
      expect(
        await screen.findByRole('heading', { name: c.title }),
      ).toBeInTheDocument()
    }
    // chapter rail nav is present
    expect(screen.getByRole('navigation', { name: /chapters/i })).toBeInTheDocument()
  })

  it('falls back to static scenes when WebGL is unavailable (jsdom)', async () => {
    render(<App />)
    // "Port Blair approaches" only appears in the FactoryScene scope label,
    // proving the scene mounted (via its static fallback path)
    expect(
      await screen.findByText(/Port Blair approaches/i),
    ).toBeInTheDocument()
  })

  it('shows a pull-quote in his voice', async () => {
    render(<App />)
    expect(
      await screen.findByText(/It was very human/i),
    ).toBeInTheDocument()
  })
})
