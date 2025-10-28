import type { HttpClientResponse } from '@effect/platform'
import { HttpClient } from '@effect/platform'
import { Effect, Schema } from 'effect'

class Projects extends Schema.Class<Projects>('Projects')({
  project_id: Schema.String,
  user_id: Schema.String,
  code_start: Schema.NullOr(Schema.String),
  code_end: Schema.NullOr(Schema.String),
  code_full: Schema.NullOr(Schema.String),
  description: Schema.String,
  audio_file_path: Schema.NullOr(Schema.String),
  audio_file_type: Schema.NullOr(Schema.Literal('wav', 'mp3', 'flac', 'aac', 'ogg')),
  youtube_url_id: Schema.NullOr(Schema.String),
  software_type: Schema.Literal('strudel', 'tidalcycles'),
  created_at: Schema.DateFromSelf
}) {}

const schemaBodyJson = <A, I, R>(schema: Schema.Schema<A, I, R>) => (response: HttpClientResponse.HttpClientResponse) =>
  response.json.pipe(
    Effect.flatMap(Schema.decodeUnknown(schema))
  )

const program = Effect.gen(function*() {
  const httpClient = yield* HttpClient.HttpClient
  return yield* httpClient.get(process.env.MOCK_DUMMMY_DATA as string).pipe(
    Effect.flatMap(schemaBodyJson(Projects)),
    Effect.catchTags({
      RequestError: () => Effect.fail('Request failed')
    })
  )
})
