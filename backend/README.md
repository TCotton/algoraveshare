This backend is intended to be deployed as a serverless handler (AWS Lambda / API Gateway).

To run tests locally:

cd backend
npm ci
npm test

Deployment notes:
- Build with `npm run build` (produces `dist/`)
- Deploy `dist/` artifact to your serverless platform and configure the handler to point to `dist/src/index.handler`
- Ensure Node.js runtime >=22 in the deployment environment
