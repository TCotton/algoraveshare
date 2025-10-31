import 'dotenv/config'
import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSwagger,
  HttpMiddleware,
  HttpServer
} from '@effect/platform'
import { NodeHttpServer, NodeRuntime } from '@effect/platform-node'
import { Effect, Layer, Schema } from 'effect'
import { createServer } from 'node:http'
import { EnvVars } from './common/env-vars.js'
import * as Database from './db.js'
// Define our API with one group named "Greetings" and one endpoint called "hello-world"
const MyApi = HttpApi.make('MyApi').add(
  HttpApiGroup.make('Greetings').add(
    HttpApiEndpoint.get('hello-world')`/`.addSuccess(Schema.String)
  )
)
// Implement the "Greetings" group
const GreetingsLive = HttpApiBuilder.group(
  MyApi,
  'Greetings',
  (handlers) => handlers.handle('hello-world', () => Effect.succeed('Hello, World!'))
)

// Provide the implementation for the API
const MyApiLive = HttpApiBuilder.api(MyApi).pipe(Layer.provide(GreetingsLive))

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

// Set up the server using NodeHttpServer on port 3000
const ServerLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(HttpApiSwagger.layer({ path: '/docs' })),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(MyApiLive),
  Layer.provide(DatabaseLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)
// Launch the server
NodeRuntime.runMain(Layer.launch(ServerLive))

/**
 * potential CORS config
 *  HttpApiBuilder.middlewareCors({
 *         allowedOrigins: [envVars.ENV === "dev" ? "*" : envVars.APP_URL],
 *         allowedMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
 *         allowedHeaders: ["Content-Type", "Authorization", "B3", "traceparent"],
 *         credentials: true,
 *       }),
 */
