import { Schema } from 'effect'

export const TagSchema = Schema.Struct({
  tagId: Schema.Number,
  name: Schema.String
})
