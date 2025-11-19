import 'dotenv/config'
import * as Pg from '@effect/sql-pg/PgClient'
import type { SqlClient } from '@effect/sql/SqlClient'
import type { SqlError } from '@effect/sql/SqlError'
import { Context, Data, Effect, Layer } from 'effect'
import * as Config from 'effect/Config'
import type { ConfigError } from 'effect/ConfigError'
import * as Redacted from 'effect/Redacted'

// Define a service to load environment variables
// Will fail with ConfigError if any required variables are missing
class EnvVars extends Effect.Service<EnvVars>()('EnvVars', {
  effect: Effect.gen(function*() {
    return {
      LOG_LEVEL: yield* Config.string('LOG_LEVEL').pipe(Config.withDefault('info')),
      DATABASE_URL: yield* Config.redacted('DATABASE_URL'),
      ENV: yield* Config.literal('dev', 'prod', 'staging')('ENV').pipe(Config.withDefault('dev')),
      POSTGRES_DB: yield* Config.string('POSTGRES_DB'),
      POSTGRES_USER: yield* Config.string('POSTGRES_USER'),
      POSTGRES_PASSWORD: yield* Config.redacted(Config.string('POSTGRES_PASSWORD')),
      POSTGRES_HOST: yield* Config.string('POSTGRES_HOST').pipe(Config.withDefault('127.0.0.1')),
      POSTGRES_PORT: yield* Config.number('POSTGRES_PORT').pipe(Config.withDefault(5432))
    } as const
  })
}) {}

class ConfigService extends Context.Tag('ConfigService')<
  ConfigService,
  {
    readonly getConfig: {
      readonly logLevel: string
      readonly database: string
      readonly host: string
      readonly password: Redacted.Redacted
      readonly port: number
      readonly username: string
    }
  }
>() {}

// Layer<ConfigService, never, EnvVars>
const ConfigLive = Layer.effect(
  ConfigService,
  Effect.gen(function*() {
    const envs = yield* EnvVars
    return ConfigService.of({
      getConfig: {
        logLevel: 'INFO',
        database: envs.POSTGRES_DB,
        host: envs.POSTGRES_HOST,
        password: envs.POSTGRES_PASSWORD,
        port: envs.POSTGRES_PORT,
        username: envs.POSTGRES_USER
      }
    })
  })
).pipe(Layer.provide(EnvVars.Default))

class LoggerService extends Context.Tag('LoggerService')<
  LoggerService,
  { readonly log: (message: string) => Effect.Effect<void> }
>() {}

// Layer<Logger, never, ConfigService>
const LoggerLive = Layer.effect(
  LoggerService,
  Effect.gen(function*() {
    const config = yield* ConfigService
    return {
      log: (message) =>
        Effect.gen(function*() {
          const { logLevel } = config.getConfig
          yield* Effect.log(`[${logLevel}] ${message}`)
        })
    }
  })
)

class DatabaseService extends Context.Tag('DatabaseService')<
  DatabaseService,
  {
    readonly pgLive: () => Effect.Effect<
      Layer.Layer<Pg.PgClient | SqlClient, ConfigError | SqlError, never>,
      never,
      never
    >
    readonly healthcheck: (sql: string) => Effect.Effect<boolean, unknown, unknown>
    readonly query: (sql: string) => Effect.Effect<ReadonlyArray<object>, SQLError, Pg.PgClient>
  }
>() {}

class SQLError extends Data.TaggedError('SQLError')<{
  cause: unknown
  message?: string
}> {}

class DatabaseConnectionLostError extends Data.TaggedError('DatabaseConnectionLostError')<{
  cause: unknown
  message: string
}> {}

const DatabaseLive = Layer.effect(
  DatabaseService,
  Effect.gen(function*() {
    const config = yield* ConfigService
    const logger = yield* LoggerService
    return {
      pgLive: () => {
        const { database, host, password, port, username } = config.getConfig
        return Effect.sync(() =>
          Pg.layerConfig({
            database: Config.succeed(database),
            host: Config.succeed(host),
            password: Config.succeed(password),
            port: Config.succeed(port),
            username: Config.succeed(username)
          })
        )
      },
      healthcheck: (sqlquery: string) =>
        Effect.gen(function*() {
          yield* logger.log(`Executing healthcheck query: ${sqlquery}`)
          const sql = yield* Pg.PgClient

          yield* sql.unsafe(sqlquery).pipe(
            Effect.timeoutFail({
              duration: '10 seconds',
              onTimeout: () =>
                new DatabaseConnectionLostError({
                  cause: new Error('[Database] Failed to connect: timeout'),
                  message: '[Database] Failed to connect: timeout'
                })
            }),
            Effect.catchAll((error) =>
              Effect.fail(
                new DatabaseConnectionLostError({
                  cause: error,
                  message: '[Database] Failed to connect'
                })
              )
            ),
            Effect.tap(() => Effect.logInfo('[Database client]: Connection to the database established.'))
          )
          return true
        }),
      query: (sqlquery: string) =>
        Effect.gen(function*() {
          yield* logger.log(`Executing SQL query: ${sqlquery}`)
          const sql = yield* Pg.PgClient

          const result: ReadonlyArray<object> = yield* Effect.catchAll(
            sql.unsafe(sqlquery),
            (error: SqlError) => {
              return Effect.fail(
                new SQLError({
                  cause: new Error(`SQL error: ${error.cause}`),
                  message: error.message
                })
              )
            }
          )

          return result
        })
    }
  })
)

const program = Effect.gen(function*() {
  const database = yield* DatabaseService
  const healthCheckResult = yield* database.healthcheck('SELECT 1')

  if (!healthCheckResult) {
    return yield* Effect.fail(
      new SQLError({
        cause: new Error('Database health check failed')
      })
    )
  }

  const queryResult = yield* database.query('SELECT * FROM users')

  return {
    queryResult
  }
})

const AppConfigLive = Layer.merge(ConfigLive, LoggerLive)

const MainLive = DatabaseLive.pipe(
  // provides the config and logger to the database
  Layer.provide(AppConfigLive),
  // provides the config to AppConfigLive
  Layer.provide(ConfigLive)
)

const runnable = Effect.gen(function*() {
  const database = yield* DatabaseService
  const pgLayer = yield* database.pgLive()

  // Build the complete layer stack
  const fullLayer = MainLive.pipe(Layer.provideMerge(pgLayer))

  return yield* Effect.provide(program, fullLayer)
})

Effect.runPromiseExit(runnable).then(console.log)
