/*
Notes
 Handle external API calls (projects only).
 The ProjectInfrastructure layer in our application is specifically designed to handle all external API interactions. In this example, we focus on fetching movie information from the MOCK_DUMMMY_DATA, but the structure is scalable to accommodate multiple external API sources as needed. This modularity ensures that extending our application to integrate with additional services is straightforward.
 */
import { Effect } from "effect"

// Install dependencies:
// npm install effect @effect/platform @effect/platform-node

import { FetchHttpClient, HttpClient } from "@effect/platform"
import { NodeRuntime } from "@effect/platform-node"
import { ProjectData } from "../models/project.model.js"

const fetchTodo = Effect.gen(function*() {
  // get the HttpClient from the environment
  const client = yield* HttpClient.HttpClient

  // make a GET request (returns HttpClientResponse)
  const response = yield* client.get("https://jsonplaceholder.typicode.com/todos/1")

  // read body as JSON (you might need to parse manually depending on version)
  const body = yield* response.json() // or some helper like `response.bodyJson()` depending on version

  return body
})

Effect.scoped(fetchTodo)
  .pipe(
    // Provide the layer that implements the HttpClient (using fetch under the hood)
    Effect.provide(FetchHttpClient.layer),
    // Run it
    NodeRuntime.runMain
  )
  .catch((err) => {
    console.error("Request failed:", err)
  })
