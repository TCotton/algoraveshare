import { HttpApiEndpoint, HttpApiGroup } from '@effect/platform'
import { ProjectSchema } from '@repo/schema/projects'
import { Schema } from 'effect'

export class ProjectsApi extends HttpApiGroup.make('projects').prefix('/projects').add(
  HttpApiEndpoint.get('getAllProjects', '/')
    .addSuccess(Schema.Array(ProjectSchema))
) {}

/**
 * import { HttpApiEndpoint } from "@effect/platform"
 * import { Schema } from "effect"
 * // Define a schema representing a User entity
 * const User = Schema.Struct({
 *   id: Schema.Number,
 *   name: Schema.String,
 *   createdAt: Schema.DateTimeUtc
 * })
 * // Define the "getUsers" endpoint, returning a list of users
 * const getUsers = HttpApiEndpoint
 *   //      ┌─── Endpoint name
 *   //      │            ┌─── Endpoint path
 *   //      ▼            ▼
 *   .get("getUsers", "/users")
 *   // Define the success schema for the response (optional).
 *   // If no response schema is specified, the default response is `204 No Content`.
 *   .addSuccess(Schema.Array(User))
 */
