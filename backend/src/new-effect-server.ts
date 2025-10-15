import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpMiddleware,
  HttpRouter,
  HttpServer
} from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, Schema } from "effect"
import { createServer } from "node:http"
import { TracingConsole } from "./lib/tracing.js"
// Define our API with one group named "Greetings" and one endpoint called "hello-world"
const MyApi = HttpApi.make("MyApi").add(
  HttpApiGroup.make("Greetings").add(
    HttpApiEndpoint.get("hello-world")`/`.addSuccess(Schema.String)
  )
)
const myLogger = HttpMiddleware.make((app) =>
  Effect.gen(function*() {
    console.log("LOGGED")
    return yield* app
  })
)
// Implement the "Greetings" group
const GreetingsLive = HttpApiBuilder.group(
  MyApi,
  "Greetings",
  (handlers) => handlers.handle("hello-world", () => Effect.succeed("Hello, World!"))
)
// Provide the implementation for the API
const MyApiLive = HttpApiBuilder.api(MyApi).pipe(Layer.provide(GreetingsLive))
// Set up the server using NodeHttpServer on port 3000
const HttpLive = HttpRouter.Default.unwrap(HttpServer.serve(myLogger)).pipe(
  Layer.provide(TracingConsole),
  Layer.provide(MyApiLive),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)
// Launch the server
NodeRuntime.runMain(Layer.launch(HttpLive))
