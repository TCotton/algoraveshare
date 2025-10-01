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

Local development (database & migrations)
--------------------------------------

This repo includes a docker-compose.yml that starts a Postgres database and Adminer (a web DB UI).

1. Start the database service:

```bash
docker-compose up -d db
```

2. Create a `.env` in the `backend/` folder (or copy `.env.example`):

```bash
cp backend/.env.example backend/.env
# Edit backend/.env if you need different credentials or host
```

3. Install backend dependencies and run migrations:

```bash
cd backend
npm ci
npm run migration:push
```

4. Troubleshooting

- If you get ECONNREFUSED, ensure Docker Desktop is running and that port 5432 is not blocked.
- Use `docker-compose logs db --tail=200` to inspect DB startup logs.
- Adminer will be available at http://localhost:8080 (user/postgres, password/postgres, database/testDB).
