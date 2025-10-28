import { HttpRouter } from '@effect/platform'
import { Effect, Layer } from 'effect'
import { ProjectRouter } from './project/project.routes.js'

export const AppRouter = HttpRouter.Default.use((router) =>
  Effect.gen(function*() {
    yield* router.mount('/projects', yield* ProjectRouter.router)
  })
).pipe(Layer.provide(ProjectRouter))
