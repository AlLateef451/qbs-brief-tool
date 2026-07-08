/* @vitest-environment jsdom */

import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import App from './App'

test('renders the QBS brief tool title', () => {
  render(<App />)

  expect(
    screen.getByText(/QBS Client Website Brief Tool/i)
  ).toBeInTheDocument()
})