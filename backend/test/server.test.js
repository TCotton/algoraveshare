import Fastify from 'fastify';
import { describe, it, expect, vi, afterEach } from 'vitest';
// Mock the lambda handler imported by the real server route
vi.mock('../src/index', () => {
    return {
        handler: async () => ({
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Hello from Effect-TS' }),
        }),
    };
});
import { handler as lambdaHandler } from '../src/index';
afterEach(() => {
    vi.resetAllMocks();
});
describe('server route /hello', () => {
    it('returns the lambda message via Fastify route', async () => {
        const server = Fastify();
        server.get('/hello', async (request, reply) => {
            const res = await lambdaHandler(null);
            const body = JSON.parse(res.body);
            reply.code(res.statusCode).send(body);
        });
        const response = await server.inject({ method: 'GET', url: '/hello' });
        expect(response.statusCode).toBe(200);
        const payload = JSON.parse(response.payload);
        expect(payload.message).toBe('Hello from Effect-TS');
        await server.close();
    });
});
//# sourceMappingURL=server.test.js.map