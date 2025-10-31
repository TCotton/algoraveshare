import { Schema } from 'effect'

export const UserSchema = Schema.Struct({
  userId: Schema.UUID,
  name: Schema.String,
  email: Schema.String,
  passwordHash: Schema.String,
  location: Schema.NullOr(Schema.String),
  createdAt: Schema.Date,
  portfolioUrl: Schema.NullOr(Schema.String),
  youtubeUrl: Schema.NullOr(Schema.String),
  mastodonUrl: Schema.NullOr(Schema.String),
  blueskyUrl: Schema.NullOr(Schema.String),
  linkedinUrl: Schema.NullOr(Schema.String)
})
