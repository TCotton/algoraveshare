import { describe, it, expect } from 'vitest';
import { handler } from '../src/index';
describe('backend handler', () => {
    it('returns a 200 status', async () => {
        const res = await handler(null);
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(body.message).toBe('Hello from Effect-TS');
    });
});
//# sourceMappingURL=index.test.js.map