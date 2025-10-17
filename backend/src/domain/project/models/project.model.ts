/**
 * In the "models" directory we define the expected structure of the JSON response from the OMDb API.
 */
import { HttpClientResponse } from "@effect/platform"
import { Schema } from "@effect/schema"

export class ProjectData extends Schema.Class<ProjectData>("ProjectData")({
  projectId: Schema.String,
  projectName: Schema.String.pipe(
    Schema.maxLength(200, { message: { value: "Project name must be maximum 200 characters" } })
  ),
  userId: Schema.String,
  codeStart: Schema.NullOr(Schema.String),
  codeEnd: Schema.NullOr(Schema.String),
  codeFull: Schema.NullOr(Schema.String),
  description: Schema.String,
  audioFilePath: Schema.NullOr(Schema.String),
  audioFileType: Schema.NullOr(Schema.Literal("wav", "mp3", "flac", "aac", "ogg")),
  youtubeUrlId: Schema.NullOr(Schema.String),
  softwareType: Schema.Literal("strudel", "tidalcycles"),
  createdAt: Schema.DateFromSelf
}) {}

const projectData = Schema.decodeUnknownEither(ProjectData)({
  projectId: "1",
  projectName: "Project 1",
  userId: "1",
  codeStart: null,
  codeEnd: null,
  codeFull: null,
  description: "Project 1 description",
  audioFilePath: null,
  audioFileType: null,
  youtubeUrlId: null,
  softwareType: "strudel",
  createdAt: new Date()
})

Either.match(
  projectData,
  (left) => console.log(left.message),
  (right) => console.log(right)
)
