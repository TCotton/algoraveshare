This backend is intended to be deployed as a serverless handler (AWS Lambda / API Gateway).

To run tests locally:

cd backend
npm ci
npm test

Deployment notes:
- Build with `npm run build` (produces `dist/`)
- Deploy `dist/` artifact to your serverless platform and configure the handler to point to `dist/src/index.handler`
- Ensure Node.js runtime >=22 in the deployment environment

Local Fastify server:
- Install dependencies: `npm ci`
- Run locally: `npm run dev` (starts Fastify on port 3000)

AWS Lambda handler:
- The Fastify server is exposed via `src/aws.ts` using `@fastify/aws-lambda`.
- After building (`npm run build`), deploy `dist/src/aws.handler` as the Lambda handler.
