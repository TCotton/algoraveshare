import { Schema } from '@effect/schema'

export const UserSchema = Schema.object({
  userId: Schema.string,
  name: Schema.string,
  passwordHash: Schema.string,
  location: Schema.string,
  createdAt: Schema.string,
  portfolioUrl: Schema.string,
  youtubeUrl: Schema.string,
  mastodonUrl: Schema.string,
  blueskyUrl: Schema.string,
  linkedinUrl: Schema.string,
})
