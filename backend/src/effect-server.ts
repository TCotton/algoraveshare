import { HttpMiddleware, HttpRouter, HttpServer } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer } from "effect"
import { createServer } from "http"
import { ProjectService } from "./domain/project/service/project.service.js"
import { TracingConsole } from "./lib/tracing.js"
import { AppRouter } from "./routes/routes.js"

const myLogger = HttpMiddleware.make((app) =>
  Effect.gen(function*() {
    console.log("LOGGED")
    return yield* app
  })
)
const ServerLive = NodeHttpServer.layer(createServer, { port: 5000, host: "localhost" })

const HttpLive = HttpRouter.Default.unwrap(HttpServer.serve(myLogger)).pipe(
  Layer.provide(AppRouter),
  Layer.provide(ServerLive),
  Layer.provide(TracingConsole)
)

NodeRuntime.runMain(Layer.launch(HttpLive))
