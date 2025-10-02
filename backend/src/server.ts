import Fastify from 'fastify';
import { handler as lambdaHandler } from './index.js';

const server = Fastify();

server.get('/hello', async (request, reply) => {
  const res = await lambdaHandler(null);
  const body = JSON.parse(res.body);
  reply.code(res.statusCode).send(body);
});

export const start = async () => {
  await server.listen({ port: 3000 });
  console.log('Fastify server listening on http://localhost:3000');
};

if (process.env.NODE_ENV !== 'test') {
  start().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
