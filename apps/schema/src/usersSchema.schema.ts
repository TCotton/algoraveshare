import { Redacted, Schema } from 'effect'
import isEmail from 'validator/lib/isEmail'

const UserSchema = Schema.Struct({
  name: Schema.Trim.pipe(
    Schema.maxLength(200, {
      message: parseIssue =>
        `Name must be at most 200 characters long, got ${parseIssue.actual}`,
    }),
  ),
  email: Schema.Trim.pipe(
    Schema.filter(x => isEmail(x) ? undefined : 'The email is not valid'),
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
  portfolioUrl: Schema.Trim.pipe(
    Schema.filter((x) => {
      if (!x) return undefined
      return URL.parse(x) ? undefined : 'This URL is not valid'
    }),
  ),
  mastodonUrl: Schema.Trim.pipe(
    Schema.filter((x) => {
      if (!x) return undefined
      return URL.parse(x) ? undefined : 'This URL is not valid'
    }),
  ),
  blueskyUrl: Schema.Trim.pipe(
    Schema.filter((x) => {
      if (!x) return undefined
      return URL.parse(x) ? undefined : 'This URL is not valid'
    }),
  ),
  linkedinUrl: Schema.Trim.pipe(
    Schema.filter((x) => {
      if (!x) return undefined
      return URL.parse(x) ? undefined : 'This URL is not valid'
    }),
  ),
  youtubeLink: Schema.Trim.pipe(
    Schema.filter((x) => {
      if (!x) return undefined
      return URL.parse(x) ? undefined : 'This URL is not valid'
    }),
  ),
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
