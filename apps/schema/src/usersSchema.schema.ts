import { Redacted, Schema } from 'effect'

const UserSchema = Schema.Struct({
  name: Schema.Trim.pipe(
    Schema.maxLength(200, {
      message: parseIssue =>
        `Name must be at most 200 characters long, got ${parseIssue.actual}`,
    }),
  ),
  email: Schema.Trim.pipe(
    Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: () => 'The email is not valid',
    }),
  ),
  passwordOne: Schema.Trim.pipe(
    Schema.minLength(8, {
      message: parseIssue =>
        `Password must be at least 8 characters long, got ${parseIssue.actual}`,
    }),
    Schema.pattern(/[A-Z]/, {
      message: () => 'Password must contain at least one uppercase letter',
    }),
    Schema.pattern(/[a-z]/, {
      message: () => 'Password must contain at least one lowercase letter',
    }),
    Schema.pattern(/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;]/, {
      message: () => 'Password must contain at least one special character',
    }),
    Schema.Redacted,
  ),
  passwordTwo: Schema.Trim.pipe(
    Schema.minLength(8, {
      message: parseIssue =>
        `Password must be at least 8 characters long, got ${parseIssue.actual}`,
    }),
    Schema.pattern(/[A-Z]/, {
      message: () => 'Password must contain at least one uppercase letter',
    }),
    Schema.pattern(/[a-z]/, {
      message: () => 'Password must contain at least one lowercase letter',
    }),
    Schema.pattern(/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;]/, {
      message: () => 'Password must contain at least one special character',
    }),
    Schema.Redacted,
  ),
  location: Schema.optional(Schema.String),
  portfolioUrl: Schema.optional(Schema.String),
  mastodonUrl: Schema.optional(Schema.String),
  blueskyUrl: Schema.optional(Schema.String),
  linkedinUrl: Schema.optional(Schema.String),
  youtubeLink: Schema.optional(Schema.String),
}).pipe(
  Schema.filter((user) => {
    // Unwrap Redacted values for comparison
    const pass1 = Redacted.value(user.passwordOne)
    const pass2 = Redacted.value(user.passwordTwo)

    return pass1 === pass2
      ? undefined
      : {
          path: ['passwordTwo'],
          message: 'Passwords must match',
        }
  }),
)

export default UserSchema
