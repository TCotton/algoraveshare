import { describe, it, expect } from 'vitest'
import { hello } from '../index.js'

describe('hello', () => {
  it('returns expected string', () => {
    expect(hello()).toBe('Hello from AlgoraveShare (ESM)')
  })
})
