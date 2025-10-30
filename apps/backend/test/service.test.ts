import { describe, it, expect } from 'vitest'
import { run } from '../src/service'

describe('service', () => {
  it('resolves hello message', async () => {
    const res = await run()
    expect(res).toBe('Hello from Effect-TS')
  })
})
