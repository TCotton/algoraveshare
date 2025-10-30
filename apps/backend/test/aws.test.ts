import { describe, it, expect } from 'vitest'
import { handler } from '../src/aws'

describe('aws Fastify adapter', () => {
  it('responds to GET /hello via lambda adapter', async () => {
    const event = {
      version: '2.0',
      routeKey: 'GET /hello',
      rawPath: '/hello',
      rawQueryString: '',
      headers: {},
      requestContext: { http: { method: 'GET', path: '/hello' } },
      isBase64Encoded: false,
    } as any

    const res = await (handler as any)(event)
    expect(res).toBeDefined()
    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body)
    expect(body.message).toBe('Hello from Effect-TS')
  })
})
