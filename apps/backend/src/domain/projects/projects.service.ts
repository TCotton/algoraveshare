import { Effect } from 'effect'
import * as Database from '../../db.js'

export class ProjectsService extends Effect.Service<ProjectsService>()('ProjectsService', {
  effect: Effect.gen(function*() {
    const db = yield* Database.Database

    const findAll = db.makeQuery((execute) =>
      execute((client) =>
        client.query.projects.findMany({
          orderBy: (projects, { desc }) => [desc(projects.createdAt)]
        })
      ).pipe(
        Effect.catchTags({
          DatabaseError: Effect.die
        }),
        Effect.withSpan('ProjectsService.findAll')
      )
    )

    return {
      findAll
    }
  })
}) {}
