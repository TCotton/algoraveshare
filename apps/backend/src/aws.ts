import awsLambda from '@fastify/aws-lambda'
import Fastify from 'fastify'
import { handler as lambdaHandler } from './index.js'

const server = Fastify()

server.get('/hello', async (request, reply) => {
  const res = await lambdaHandler(null)
  const body = JSON.parse(res.body)
  reply.code(res.statusCode).send(body)
})

export const handler = awsLambda(server)
