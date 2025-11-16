import type { FastifyInstance } from 'fastify'
import { getPostsHandler } from './handler.js'

export const postsRouter = (fastify: FastifyInstance) => {
  fastify.get('/', getPostsHandler)
}
