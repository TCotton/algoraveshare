import env from '@fastify/env'
import dotenv from 'dotenv'
import Fastify from 'fastify'
import type { Level } from 'src/utils/logger.js'
import { createLogger } from 'src/utils/logger.js'
import { handler as lambdaHandler } from './index.js'

dotenv.config()

const level = process.env.PINO_LOG_LEVEL as Level
const isDev = process.env.NODE_ENV === 'development'
const logger = createLogger({ level, isDev })

export { logger }

const schema = {
  type: 'object',
  required: ['PORT', 'DATABASE_URL'],
  properties: {
    PORT: {
      type: 'string',
      default: 3000
    },
    DATABASE_URL: {
      type: 'string'
    },
    PINO_LOG_LEVEL: {
      type: 'string',
      default: 'error'
    },
    NODE_ENV: {
      type: 'string',
      default: 'production'
    }
  }
}

const options = {
  schema,
  dotenv: true
}

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: string
      DATABASE_URL: string
      PINO_LOG_LEVEL: string
      NODE_ENV: string
    }
  }
}

const server = Fastify({
  logger: true,
  loggerInstance: logger
})

await server.register(env, options).after()

server.get('/hello', async (request, reply) => {
  const res = await lambdaHandler(null)
  const body = JSON.parse(res.body)
  reply.code(res.statusCode).send(body)
})

export const start = async () => {
  await server.listen({ port: 3000 })
  console.log('Fastify server listening on http://localhost:3000')
}

if (process.env.NODE_ENV !== 'test') {
  start().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
