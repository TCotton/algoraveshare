/**
 * Effect PostgreSQL Client Examples
 *
 * This file demonstrates how to use the Effect PostgreSQL client (@effect/sql-pg)
 * with proper type annotations to avoid TS2742 errors.
 *
 * TS2742 Error Explanation:
 * ------------------------
 * "The inferred type of X cannot be named without a reference to .pnpm/..."
 *
 * This error occurs when:
 * 1. TypeScript infers a complex type from a library
 * 2. The inferred type includes internal generic types
 * 3. TypeScript needs to reference the exact node_modules path to describe it
 * 4. The path isn't "portable" (would break if node_modules structure changes)
 *
 * Solution: Add explicit type annotations using imported types.
 *
 * Installation:
 *   pnpm add @effect/sql @effect/sql-pg
 *
 * @see https://effect.website/docs/guides/sql
 */

import type * as PgClient from '@effect/sql-pg/PgClient'
import * as Pg from '@effect/sql-pg/PgClient'
import type { SqlClient } from '@effect/sql/SqlClient'
import type { SqlError } from '@effect/sql/SqlError'
import * as Config from 'effect/Config'
import type { ConfigError } from 'effect/ConfigError'
import * as Effect from 'effect/Effect'
import type * as Layer from 'effect/Layer'
import * as Option from 'effect/Option'
import * as Redacted from 'effect/Redacted'

// ============================================================================
// LAYER CONFIGURATION
// ============================================================================

/**
 * Example 1: Basic PostgreSQL Client Layer
 *
 * BEFORE (causes TS2742):
 * export const PgLive = Pg.layerConfig({...})
 *
 * AFTER (fixed with type annotation):
 * export const PgLive: Layer.Layer<PgClient.PgClient | SqlClient, ConfigError | SqlError> = ...
 *
 * The explicit type annotation tells TypeScript the exact type without
 * needing to reference internal node_modules paths.
 *
 * Note: Even though we use Config.succeed (which never fails), layerConfig's
 * signature includes ConfigError in the error channel.
 */
export const PgLive: Layer.Layer<
  PgClient.PgClient | SqlClient,
  ConfigError | SqlError
> = Pg.layerConfig({
  database: Config.succeed('testDB'),
  host: Config.succeed('127.0.0.1'),
  password: Config.succeed(Redacted.make('postgres')),
  port: Config.succeed(5432),
  username: Config.succeed('postgres')
})

/**
 * Example 2: Using connection string from environment
 *
 * DATABASE_URL format: postgresql://user:password@host:port/database
 *
 * Note: The error type includes ConfigError because Config.redacted can fail
 */
export const PgLiveFromEnv: Layer.Layer<
  PgClient.PgClient | SqlClient,
  ConfigError | SqlError
> = Pg.layerConfig({
  url: Config.redacted('DATABASE_URL')
})

/**
 * Example 3: Connection pooling configuration
 */
export const PgLiveWithPooling: Layer.Layer<
  PgClient.PgClient | SqlClient,
  ConfigError | SqlError
> = Pg.layerConfig({
  database: Config.succeed('testDB'),
  host: Config.succeed('127.0.0.1'),
  maxConnections: Config.succeed(20),
  minConnections: Config.succeed(5),
  password: Config.succeed(Redacted.make('postgres')),
  port: Config.succeed(5432),
  username: Config.succeed('postgres')
})

// ============================================================================
// QUERY EXAMPLES
// ============================================================================

// Row type for user queries
interface UserRow {
  created_at: Date
  email: string
  location: string | null
  name: string
  password_hash: string
  user_id: string
}

/**
 * Example 4: Basic SELECT query
 *
 * Type annotation:
 * Effect.Effect<ReadonlyArray<UserRow>, SqlError, PgClient.PgClient>
 *
 * This reads as: "An Effect that:
 * - Succeeds with: Array of UserRow
 * - Can fail with: SqlError
 * - Requires: PgClient.PgClient
 */
export const getAllUsers: Effect.Effect<
  ReadonlyArray<UserRow>,
  SqlError,
  PgClient.PgClient
> = Effect.gen(function*() {
  const sql = yield* Pg.PgClient

  return yield* sql<UserRow>`
    SELECT * FROM users
    ORDER BY created_at DESC
  `
})

/**
 * Example 5: Parameterized query with optional result
 *
 * Returns Option.Some(user) if found, Option.None if not found
 */
export const getUserById = (userId: string): Effect.Effect<
  Option.Option<UserRow>,
  SqlError,
  PgClient.PgClient
> =>
  Effect.gen(function*() {
    const sql = yield* Pg.PgClient

    const result = yield* sql<UserRow>`
    SELECT * FROM users
    WHERE user_id = ${userId}
    LIMIT 1
  `

    return Option.fromNullable(result[0])
  })

/**
 * Example 6: INSERT query
 */
export const createUser = (
  name: string,
  email: string,
  passwordHash: string
): Effect.Effect<UserRow, SqlError, PgClient.PgClient> =>
  Effect.gen(function*() {
    const sql = yield* Pg.PgClient

    const result = yield* sql<UserRow>`
    INSERT INTO users (name, email, password_hash)
    VALUES (${name}, ${email}, ${passwordHash})
    RETURNING *
  `

    return result[0]
  })

/**
 * Example 7: UPDATE query
 */
export const updateUserLocation = (
  userId: string,
  location: string
): Effect.Effect<UserRow, SqlError, PgClient.PgClient> =>
  Effect.gen(function*() {
    const sql = yield* Pg.PgClient

    const result = yield* sql<UserRow>`
    UPDATE users
    SET location = ${location}
    WHERE user_id = ${userId}
    RETURNING *
  `

    return result[0]
  })

/**
 * Example 8: Running a query with the layer
 *
 * This shows how to execute a query by providing the PgLive layer
 */
export const runExample = async () => {
  const program = Effect.gen(function*() {
    // Get all users
    const users = yield* getAllUsers

    console.log('Users:', users)

    // Get specific user
    if (users.length > 0) {
      const firstUser = yield* getUserById(users[0].user_id)
      console.log('First user:', firstUser)
    }
  })

  // Provide the layer and run the effect
  return Effect.runPromise(Effect.provide(program, PgLive))
}

// ============================================================================
// KEY TAKEAWAYS
// ============================================================================

/**
 * To fix TS2742 errors:
 *
 * 1. Import types properly:
 *    - Use `import type` for type-only imports
 *    - Import the namespace: `import type * as PgClient from '@effect/sql-pg/PgClient'`
 *    - Import the module: `import * as Pg from '@effect/sql-pg/PgClient'`
 *
 * 2. Add explicit type annotations to exports:
 *    - Layers: Layer.Layer<Service, Error>
 *    - Effects: Effect.Effect<Success, Error, Requirements>
 *
 * 3. Use the correct types:
 *    - PgClient.PgClient (the service type)
 *    - SqlClient (base SQL client)
 *    - SqlError (database errors)
 *    - ConfigError (configuration errors)
 */
