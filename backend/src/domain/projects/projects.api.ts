import { HttpApiGroup } from '@effect/platform'

export class ProjectsApi extends HttpApiGroup.make('projects').prefix('/projects') {}
