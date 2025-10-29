import * as Config from 'effect/Config'
import * as Effect from 'effect/Effect'

export class EnvVars extends Effect.Service<EnvVars>()('EnvVars', {
  accessors: true,
  effect: Effect.gen(function*() {
    return {
      DATABASE_URL: yield* Config.redacted('DATABASE_URL'),
      ENV: yield* Config.literal('dev', 'prod', 'staging')('ENV').pipe(Config.withDefault('dev'))
    } as const
  })
}) {}
