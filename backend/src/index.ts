import { run } from './service.js'

/**
 * AWS Lambda (HTTP API / API Gateway) compatible handler
 * Returns an object with statusCode and body (string).
 */
export const handler = async (_event: unknown) => {
  const body = await run()
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: body })
  }
}
