import { Redacted, Schema } from 'effect'
import { isEmail, isStrongPassword } from 'validator'

const UserSchema = Schema.Struct({
  name: Schema.String.pipe(
    Schema.trimmed(),
    Schema.maxLength(200, {
      message: (parseIssue) => `Name must be at most 200 characters long, got ${parseIssue.actual}`
    })
  ),
  email: Schema.String.pipe(
    Schema.trimmed(),
    Schema.filter((x) => isEmail(x) ? undefined : 'The email is not valid')
  ),
  passwordOne: Schema.String.pipe(
    Schema.trimmed(),
    Schema.minLength(8, {
      message: (parseIssue) => `Password must be at least 8 characters long, got ${parseIssue.actual}`
    }),
    Schema.filter((x) => isStrongPassword(x) ? undefined : 'The password is not strong enough'),
    Schema.Redacted
  ),
  passwordTwo: Schema.String.pipe(
    Schema.trimmed(),
    Schema.minLength(8, {
      message: (parseIssue) => `Password must be at least 8 characters long, got ${parseIssue.actual}`
    }),
    Schema.filter((x) => isStrongPassword(x) ? undefined : 'The password is not strong enough'),
    Schema.Redacted
  ),
  location: Schema.optional(Schema.String.pipe(
    Schema.trimmed()
  )),
  portfolioUrl: Schema.optional(Schema.String.pipe(
    Schema.trimmed(),
    Schema.filter((x) => URL.parse(x) ? undefined : 'The URL is not a valid')
  )),
  mastodonUrl: Schema.optional(Schema.String.pipe(
    Schema.trimmed(),
    Schema.filter((x) => URL.parse(x) ? undefined : 'The URL is not a valid')
  )),
  blueskyUrl: Schema.optional(Schema.String.pipe(
    Schema.trimmed(),
    Schema.filter((x) => URL.parse(x) ? undefined : 'The URL is not a valid')
  )),
  linkedinUrl: Schema.optional(Schema.String.pipe(
    Schema.trimmed(),
    Schema.filter((x) => URL.parse(x) ? undefined : 'The URL is not a valid')
  )),
  youtubeLink: Schema.optional(Schema.String.pipe(
    Schema.trimmed(),
    Schema.filter((x) => URL.parse(x) ? undefined : 'The URL is not a valid')
  ))
}).pipe(
  Schema.filter((user) => {
    // Unwrap Redacted values for comparison
    const pass1 = Redacted.value(user.passwordOne)
    const pass2 = Redacted.value(user.passwordTwo)

    return pass1 === pass2
      ? undefined
      : {
        path: ['passwordTwo'],
        message: 'Passwords must match'
      }
  })
)
export default UserSchema
