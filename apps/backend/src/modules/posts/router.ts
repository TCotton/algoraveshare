import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { getPostsHandler } from './handler.js'

export const postsRouter = fp(async (fastify: FastifyInstance) => {
  fastify.get('/', getPostsHandler)
})
