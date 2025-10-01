import { describe, it, expect } from 'vitest'
import { handler } from '../src/index'

describe('backend handler', () => {
  it('returns a 200 status', async () => {
    const res = await handler(null)
    expect(res.status).toBe(200)
  })
})
