/*import { HttpApiEndpoint, HttpApiGroup } from '@effect/platform'
import { Schema } from 'effect'
import { ProjectSchema } from '../../../../schema/projects.schema.js'*/

/*
export class ProjectsApi extends HttpApiGroup.make('projects').prefix('/projects')
    .(
        HttpApiEndpoint.get("getAllProjects", "/projects")
            .setPath(ProjectSchema)
            .addSuccess(User.json)
            .addError(UserNotFound)
            .setPayload(Schema.partialWith(User.jsonUpdate, { exact: true }))
    ){

// Define a schema representing a User entity
const User = Schema.Struct({
    id: Schema.Number,
    name: Schema.String,
    createdAt: Schema.DateTimeUtc
})
// Define the "getUsers" endpoint, returning a list of users
const getUsers = HttpApiEndpoint
    //      ┌─── Endpoint name
    //      │            ┌─── Endpoint path
    //      ▼            ▼

    // Define the success schema for the response (optional).
    // If no response schema is specified, the default response is `204 No Content`.
    .addSuccess(Schema.Array(User))
}
*/
