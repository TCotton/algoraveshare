import 'dotenv/config'
import { DevTools } from '@effect/experimental'
import { HttpApiBuilder, HttpMiddleware, HttpServer } from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { DbSchema } from '@repo/database/schema'
import { Effect, Layer } from 'effect'
import { createServer } from 'node:http'
import { ServerApi } from 'src/domain/projects/index.js'
import { EnvVars } from './common/env-vars.js'
import * as Database from './db.js'

console.log(DbSchema)

// Implement the "Greetings" group
const GreetingsLive = HttpApiBuilder.group(
  ServerApi,
  'Greetings',
  (handlers) => handlers.handle('hello-world', () => Effect.succeed('Hello, World!'))
)

// Implement the "Projects" group
const ProjectsLive = HttpApiBuilder.group(
  ServerApi,
  'Projects',
  (handlers) =>
    handlers.handle('project', () =>
      Effect.succeed({
        projectId: 'example-id',
        projectName: 'Example Project',
        userId: 'user-id',
        description: 'Example description',
        softwareType: 'strudel' as const
      }))
)

// Provide the implementation for the API
const ServerApiLive = HttpApiBuilder.api(ServerApi).pipe(
  Layer.provide(GreetingsLive),
  Layer.provide(ProjectsLive)
)

const DatabaseLive = Layer.unwrapEffect(
  EnvVars.pipe(
    Effect.map((envVars) =>
      Database.layer({
        url: envVars.DATABASE_URL,
        ssl: envVars.ENV === 'prod'
      })
    )
  )
).pipe(Layer.provide(EnvVars.Default))
const DevToolsLive = DevTools.layer()
// Set up the server using NodeHttpServer on port 3000
const ServerLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(DevToolsLive),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  // Layer.provide(HttpApiSwagger.layer({ path: '/docs' })),
  // Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(ServerApiLive),
  Layer.provide(DatabaseLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)
// Launch the server
// NodeRuntime.runMain(Layer.launch(ServerLive))
ServerLive.pipe(Layer.launch, NodeRuntime.runMain)

/**
 * potential CORS config
 *  HttpApiBuilder.middlewareCors({
 *         allowedOrigins: [envVars.ENV === "dev" ? "*" : envVars.APP_URL],
 *         allowedMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
 *         allowedHeaders: ["Content-Type", "Authorization", "B3", "traceparent"],
 *         credentials: true,
 *       }),
 */
