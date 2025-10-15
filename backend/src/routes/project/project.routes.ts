import { HttpRouter, HttpServerResponse } from "@effect/platform"
import { Effect, Layer } from "effect"
import { ProjectService } from "../../domain/project/service/project.service.js"

export class ProjectRouter extends HttpRouter.Tag("ProjectRouter")<ProjectRouter>() {
}

export enum Routes {
  All = "/all"
}

const GetProjects = ProjectRouter.use((router) =>
  router.get(
    Routes.All,
    // @ts-expect-error - Effect context requirements need to be fully resolved in service layer
    Effect.flatMap(ProjectService, (service) =>
      Effect.gen(function*() {
        const project = yield* service.getAllProjectData()
        return yield* HttpServerResponse.json(project)
      }))
  )
)

export const projectRoutes = Layer.mergeAll(GetProjects).pipe(
  Layer.provideMerge(ProjectRouter.Live),
  Layer.provide(ProjectService.Live)
)
