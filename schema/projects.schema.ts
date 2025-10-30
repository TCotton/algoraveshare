import { Schema } from 'effect'

export const ProjectSchema = Schema.Struct({
  projectId: Schema.UUID,
  projectName: Schema.String,
  userId: Schema.UUID,
  codeStart: Schema.NullOr(Schema.String),
  codeEnd: Schema.NullOr(Schema.String),
  codeFull: Schema.NullOr(Schema.String),
  description: Schema.String,
  audioFilePath: Schema.NullOr(Schema.String),
  audioFileType: Schema.NullOr(Schema.Literal('wav', 'mp3', 'flac', 'aac', 'ogg')),
  audioData: Schema.NullOr(Schema.Unknown), // JSONB can contain any valid JSON
  youtubeUrlId: Schema.NullOr(Schema.String),
  softwareType: Schema.Literal('strudel', 'tidalcycles'),
  createdAt: Schema.Date,
})
