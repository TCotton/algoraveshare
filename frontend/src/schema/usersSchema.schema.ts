import { Schema } from 'effect'

const UserSchema = Schema.Struct({
  name: Schema.NonEmptyString,
  email: Schema.NonEmptyString,
  passwordOne: Schema.Trim.pipe(
    Schema.minLength(12),
    Schema.pattern(/[A-Z]/),
    Schema.pattern(/[a-z]/),
    Schema.pattern(/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;]/),
    Schema.Redacted,
  ),
  passwordTwo: Schema.Trim.pipe(
    Schema.minLength(12),
    Schema.pattern(/[A-Z]/),
    Schema.pattern(/[a-z]/),
    Schema.pattern(/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;]/),
    Schema.Redacted,
  ),
  location: Schema.optional(Schema.String),
  portfolioUrl: Schema.optional(Schema.String),
  mastodonUrl: Schema.optional(Schema.String),
  blueskyUrl: Schema.optional(Schema.String),
  linkedinUrl: Schema.optional(Schema.String),
  youtubeLink: Schema.optional(Schema.String),
})
export default UserSchema
