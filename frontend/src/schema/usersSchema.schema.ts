const UserSchema = Schema.struct({
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
  location: Schema.optional(Schema.string),
  portfolioUrl: Schema.optional(Schema.string),
  mastodonUrl: Schema.optional(Schema.string),
  blueskyUrl: Schema.optional(Schema.string),
  linkedinUrl: Schema.optional(Schema.string),
  youtubeLink: Schema.optional(Schema.string),
})