import { HttpApi, OpenApi } from '@effect/platform'
import { ProjectsApi } from './domain/projects/projects.api.js'

export class Api extends HttpApi.make('api')
  .add(ProjectsApi)
  .annotate(OpenApi.Title, 'Groups API')
{}
