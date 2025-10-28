import { HttpApiEndpoint } from '@effect/platform'
import { Schema } from 'effect'

const User = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  createdAt: Schema.DateTimeUtc
})
// Define a GET endpoint with a path parameter ":id"
const getUser = HttpApiEndpoint.get('getUser', '/user/:id')
  .setPath(
    Schema.Struct({
      // Define a schema for the "id" path parameter
      id: Schema.NumberFromString
    })
  )
  .addSuccess(User)
