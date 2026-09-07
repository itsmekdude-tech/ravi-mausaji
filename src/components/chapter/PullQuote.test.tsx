import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PullQuote } from './PullQuote'

describe('PullQuote', () => {
  it('renders the quote text and default attribution', () => {
    render(<PullQuote quote={{ text: 'It was very human.' }} />)
    expect(screen.getByText('It was very human.')).toBeInTheDocument()
    expect(screen.getByText(/Mausaji/)).toBeInTheDocument()
  })

  it('renders a gloss and custom attribution when provided', () => {
    render(
      <PullQuote
        quote={{ text: 'Barter!', gloss: 'trade', attribution: 'The Captain' }}
      />,
    )
    expect(screen.getByText('trade')).toBeInTheDocument()
    expect(screen.getByText(/The Captain/)).toBeInTheDocument()
  })
})
