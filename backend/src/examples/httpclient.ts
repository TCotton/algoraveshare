import { HttpClient, HttpClientResponse } from "@effect/platform"
import { Effect, Schema } from "effect"

class Todo extends Schema.Class<Todo>("ToDo")({
  userId: Schema.Number,
  id: Schema.Number,
  title: Schema.String,
  completed: Schema.Boolean
}) {}

const schemaBodyJson = <A, I, R>(response: HttpClientResponse.HttpClientResponse) =>
  response.json.pipe(
    Effect.flatmap(Schema.decodeUnknown(schema))
  )

const program = Effect.gen(function*() {
  const httpClient = yield* HttpClient.HttpClient
  return yield* httpClient.get("https://jsonplaceholder.typicode.com/todos/1").pipe(
    Effect.flatMap(HttpClientResponse.schemaBodyJson(Todo))
  )
})
