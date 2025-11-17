/**
 * PostgreSQL Connection Error Handling Examples
 *
 * Demonstrates various strategies for handling connection errors
 * when using Effect PostgreSQL client (@effect/sql-pg)
 */

import type * as PgClient from '@effect/sql-pg/PgClient'
import * as Pg from '@effect/sql-pg/PgClient'
import type { SqlClient } from '@effect/sql/SqlClient'
import type { SqlError } from '@effect/sql/SqlError'
import * as Config from 'effect/Config'
import type { ConfigError } from 'effect/ConfigError'
import * as Duration from 'effect/Duration'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Redacted from 'effect/Redacted'
import * as Schedule from 'effect/Schedule'

// ============================================================================
// CONNECTION CONFIGURATION WITH TIMEOUTS
// ============================================================================

/**
 * Example 1: Layer with connection timeout configuration
 *
 * Use connectTimeout to fail fast if the database is unreachable
 */
export const PgLiveWithTimeout: Layer.Layer<
  PgClient.PgClient | SqlClient,
  ConfigError | SqlError
> = Pg.layerConfig({
  connectTimeout: Config.succeed(Duration.seconds(5)), // Fail after 5 seconds
  database: Config.succeed('testDB'),
  host: Config.succeed('127.0.0.1'),
  idleTimeout: Config.succeed(Duration.seconds(30)), // Close idle connections
  password: Config.succeed(Redacted.make('postgres')),
  port: Config.succeed(5432),
  username: Config.succeed('postgres')
})

/**
 * Example 2: Connection pooling with min/max connections
 *
 * Prevents exhausting database connections
 */
export const PgLiveWithPool: Layer.Layer<
  PgClient.PgClient | SqlClient,
  ConfigError | SqlError
> = Pg.layerConfig({
  connectTimeout: Config.succeed(Duration.seconds(10)),
  database: Config.succeed('testDB'),
  host: Config.succeed('127.0.0.1'),
  maxConnections: Config.succeed(20), // Maximum pool size
  minConnections: Config.succeed(5), // Minimum pool size
  password: Config.succeed(Redacted.make('postgres')),
  port: Config.succeed(5432),
  username: Config.succeed('postgres')
})

// ============================================================================
// ERROR HANDLING STRATEGIES
// ============================================================================

interface UserRow {
  created_at: Date
  email: string
  name: string
  user_id: string
}

/**
 * Example 3: Basic error catching
 *
 * Use Effect.catchAll to handle all errors
 */
export const getUsersWithCatch: Effect.Effect<
  ReadonlyArray<UserRow>,
  never,
  PgClient.PgClient
> = Effect.gen(function*() {
  const sql = yield* Pg.PgClient

  return yield* Effect.catchAll(
    sql<UserRow>`SELECT * FROM users`,
    (error: SqlError) => {
      console.error('Database query failed:', error)
      return Effect.succeed([]) // Return empty array on error
    }
  )
})

/**
 * Example 4: Specific error handling with pattern matching
 *
 * Handle different error scenarios differently
 */
export const getUsersWithErrorMatching: Effect.Effect<
  ReadonlyArray<UserRow>,
  string,
  PgClient.PgClient
> = Effect.gen(function*() {
  const sql = yield* Pg.PgClient

  return yield* Effect.catchAll(
    sql<UserRow>`SELECT * FROM users`,
    (error: SqlError) => {
      // Check error message for specific conditions
      const errorMsg = error.message || ''

      if (errorMsg.includes('connection')) {
        return Effect.fail('Database connection failed. Please try again later.')
      }

      if (errorMsg.includes('timeout')) {
        return Effect.fail('Database query timeout. Please try again.')
      }

      if (errorMsg.includes('relation') && errorMsg.includes('does not exist')) {
        return Effect.fail('Table does not exist. Database may not be initialized.')
      }

      // Generic error
      return Effect.fail(`Database error: ${errorMsg}`)
    }
  )
})

/**
 * Example 5: Retry logic with exponential backoff
 *
 * Automatically retry failed queries with increasing delays
 */
export const getUsersWithRetry: Effect.Effect<
  ReadonlyArray<UserRow>,
  SqlError,
  PgClient.PgClient
> = Effect.gen(function*() {
  const sql = yield* Pg.PgClient

  // Retry up to 3 times with exponential backoff
  const retryPolicy = Schedule.exponential(Duration.millis(100)).pipe(
    Schedule.compose(Schedule.recurs(3)) // Max 3 retries
  )

  return yield* Effect.retry(
    sql<UserRow>`SELECT * FROM users`,
    retryPolicy
  )
})

/**
 * Example 6: Fallback to default value on connection error
 *
 * Use Effect.orElseSucceed for graceful degradation
 */
export const getUsersOrEmpty: Effect.Effect<
  ReadonlyArray<UserRow>,
  never,
  PgClient.PgClient
> = Effect.gen(function*() {
  const sql = yield* Pg.PgClient

  return yield* Effect.orElseSucceed(
    sql<UserRow>`SELECT * FROM users`,
    () => []
  )
})

/**
 * Example 7: Using Effect.race to implement timeout behavior
 *
 * Race the query against a delay that fails
 */
export const getUsersWithRaceTimeout: Effect.Effect<
  ReadonlyArray<UserRow>,
  SqlError | string,
  PgClient.PgClient
> = Effect.gen(function*() {
  const sql = yield* Pg.PgClient

  const query = sql<UserRow>`SELECT * FROM users`
  const timeout = Effect.sleep(Duration.seconds(5)).pipe(
    Effect.flatMap(() => Effect.fail('Query timeout after 5 seconds'))
  )

  return yield* Effect.race(query, timeout)
})

/**
 * Example 8: Combining retry with custom timeout
 *
 * Retry queries with exponential backoff
 */
export const getUsersWithRetryAndRace: Effect.Effect<
  ReadonlyArray<UserRow>,
  SqlError | string,
  PgClient.PgClient
> = Effect.gen(function*() {
  const sql = yield* Pg.PgClient

  const queryWithTimeout = Effect.race(
    sql<UserRow>`SELECT * FROM users`,
    Effect.sleep(Duration.seconds(5)).pipe(
      Effect.flatMap(() => Effect.fail('Query timeout'))
    )
  )

  // Retry up to 3 times with exponential backoff
  const retryPolicy = Schedule.exponential(Duration.millis(200)).pipe(
    Schedule.compose(Schedule.recurs(3))
  )

  return yield* Effect.retry(queryWithTimeout, retryPolicy)
})

// ============================================================================
// LAYER-LEVEL ERROR HANDLING
// ============================================================================

/**
 * Example 9: Fallback to alternative database on connection failure
 *
 * Try primary database, fall back to replica if unavailable
 */
export const PgLiveWithFallback: Layer.Layer<
  PgClient.PgClient | SqlClient,
  ConfigError | SqlError
> = Layer.orElse(
  // Primary database
  Pg.layerConfig({
    database: Config.succeed('primary_db'),
    host: Config.succeed('primary.example.com'),
    password: Config.succeed(Redacted.make('postgres')),
    port: Config.succeed(5432),
    username: Config.succeed('postgres')
  }),
  () =>
    Pg.layerConfig({
      database: Config.succeed('replica_db'),
      host: Config.succeed('replica.example.com'),
      password: Config.succeed(Redacted.make('postgres')),
      port: Config.succeed(5432),
      username: Config.succeed('postgres')
    })
)

/**
 * Example 10: Health check before running queries
 *
 * Verify connection is healthy before executing
 */
export const checkDatabaseHealth: Effect.Effect<
  boolean,
  SqlError,
  PgClient.PgClient
> = Effect.gen(function*() {
  const sql = yield* Pg.PgClient

  return yield* Effect.orElseSucceed(
    Effect.map(
      sql`SELECT 1 as health`,
      () => true
    ),
    () => false
  )
})

/**
 * Example 11: Running queries with health check
 */
export const getUsersWithHealthCheck: Effect.Effect<
  ReadonlyArray<UserRow>,
  SqlError | string,
  PgClient.PgClient
> = Effect.gen(function*() {
  // Check database health first
  const isHealthy = yield* checkDatabaseHealth

  if (!isHealthy) {
    return yield* Effect.fail('Database is not healthy')
  }

  const sql = yield* Pg.PgClient
  return yield* sql<UserRow>`SELECT * FROM users`
})

// ============================================================================
// RUNNING EFFECTS WITH ERROR LOGGING
// ============================================================================

/**
 * Example 12: Complete example with error logging
 */
export const runQueryWithErrorHandling = async () => {
  const program = Effect.gen(function*() {
    const sql = yield* Pg.PgClient

    // Try to get users
    const result = yield* Effect.catchAll(
      sql<UserRow>`SELECT * FROM users`,
      (error: SqlError) => {
        console.error('SQL Error:', {
          cause: error.cause,
          message: error.message,
          tag: error._tag
        })

        return Effect.fail({
          code: 'DATABASE_ERROR',
          message: 'Failed to fetch users'
        })
      }
    )

    return result
  })

  // Provide the layer and run
  return Effect.runPromise(
    Effect.provide(program, PgLiveWithTimeout)
  ).catch((error) => {
    console.error('Effect execution failed:', error)
    throw error
  })
}

// ============================================================================
// KEY TAKEAWAYS
// ============================================================================

/**
 * Connection Error Handling Best Practices:
 *
 * 1. **Configure Timeouts**:
 *    - Use `connectTimeout` for connection attempts
 *    - Use `idleTimeout` to close inactive connections
 *    - Use `Effect.timeout` for individual queries
 *
 * 2. **Retry Strategies**:
 *    - `Effect.retry` with exponential backoff
 *    - Limit retry attempts to avoid infinite loops
 *    - Consider jitter to prevent thundering herd
 *
 * 3. **Error Recovery**:
 *    - `Effect.catchAll` - Handle all errors
 *    - `Effect.orElseSucceed` - Provide default value
 *    - `Layer.orElse` - Fallback to alternative layer
 *
 * 4. **Connection Pooling**:
 *    - Set `maxConnections` to prevent exhaustion
 *    - Set `minConnections` for ready connections
 *    - Monitor pool health
 *
 * 5. **Error Types**:
 *    - SqlError - Database/query errors
 *    - ConfigError - Configuration issues
 *    - Custom errors - Application-specific
 *
 * 6. **Health Checks**:
 *    - Verify connection before critical operations
 *    - Implement periodic health checks
 *    - Gracefully handle degraded state
 */
