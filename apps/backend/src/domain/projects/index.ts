import { HttpApi, HttpApiEndpoint, HttpApiGroup } from '@effect/platform'
import { createInsertSchema } from '@handfish/drizzle-effect'
import { DbSchema } from '@repo/database/schema'
import { Schema } from 'effect'
import { BadRequest } from '../../common/CustomHttpApiError.js'

const insertProjectsSchema = createInsertSchema(DbSchema.projects)

class ProjectsApi extends HttpApiGroup.make('Projects').add(
  HttpApiEndpoint.get('project')`/`.addSuccess(insertProjectsSchema).addError(BadRequest)
) {}

class GreetingsApi extends HttpApiGroup.make('Greetings').add(
  HttpApiEndpoint.get('hello-world')`/`.addSuccess(Schema.String)
) {}

export class ServerApi extends HttpApi.make('server-api')
  .add(ProjectsApi)
  .add(GreetingsApi)
{}
// HttpApiBuilder.api(MyApi).pipe(Layer.provide(GreetingsLive))
