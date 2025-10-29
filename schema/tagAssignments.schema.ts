import { Schema } from 'effect'

export const TagAssignmentSchema = Schema.Struct({
  tagId: Schema.Number,
  entityType: Schema.Literal('project', 'snippet'),
  entityId: Schema.UUID,
  createdAt: Schema.Date,
})
