/**
 * Effect PostgreSQL Client Examples
 *
 * To use this, you need to install the @effect/sql and @effect/sql-pg packages:
 *
 * ```bash
 * pnpm add @effect/sql @effect/sql-pg
 * ```
 *
 * Documentation: https://effect-ts.github.io/effect/sql-pg/PgClient.ts.html
 */

import type * as PgClient from '@effect/sql-pg/PgClient'
import * as Pg from '@effect/sql-pg/PgClient'
import type { SqlError } from '@effect/sql/SqlError'
import * as Config from 'effect/Config'
import type { ConfigError } from 'effect/ConfigError'
import * as Effect from 'effect/Effect'
import type { Layer } from 'effect/Layer'
import * as Redacted from 'effect/Redacted'

// ============================================================================
// DATABASE ROW TYPES
// ============================================================================

interface UserRow {
  audio_data?: unknown
  bluesky_url: string | null
  created_at: Date
  email: string
  linkedin_url: string | null
  location: string | null
  mastodon_url: string | null
  name: string
  password_hash: string
  portfolio_url: string | null
  user_id: string
  youtube_url: string | null
}

interface ProjectRow {
  audio_data?: unknown
  audio_file_path: string | null
  audio_file_type: 'aac' | 'flac' | 'mp3' | 'ogg' | 'wav' | null
  code_end: string | null
  code_full: string | null
  code_start: string | null
  created_at: Date
  description: string
  project_id: string
  project_name: string
  software_type: 'strudel' | 'tidalcycles'
  user_id: string
  youtube_url_id: string | null
}

interface ProjectWithUserRow extends ProjectRow {
  user_email: string
  user_name: string
}

interface UserProjectCountRow {
  name: string
  project_count: number
  user_id: string
}

// ============================================================================
// CONNECTION LAYERS
// ============================================================================

// Example 1: Basic PostgreSQL Client Layer
export const PgLive: Layer<PgClient.PgClient, ConfigError | SqlError> =
  Pg.layerConfig({
    database: Config.succeed('testDB'),
    host: Config.succeed('127.0.0.1'),
    password: Config.succeed(Redacted.make('postgres')),
    port: Config.succeed(5432),
    username: Config.succeed('postgres')
  })

// Example 2: Using connection string from environment
// DATABASE_URL should be in format: postgresql://user:password@host:port/database
export const PgLiveFromEnv: Layer<PgClient.PgClient, ConfigError | SqlError> =
  Pg.layerConfig({
    url: Config.redacted('DATABASE_URL')
  })

// ============================================================================
// QUERY EXAMPLES
// ============================================================================

// Example 3: Basic query execution
export const getAllUsers: Effect.Effect<
  ReadonlyArray<UserRow>,
  SqlError,
  PgClient.PgClient
> = Effect.gen(function*() {
  const sql = yield* Pg.PgClient

  // Simple SELECT query
  const users = yield* sql<UserRow>`
    SELECT * FROM users
    ORDER BY created_at DESC
  `

  return users
})

// Example 4: Query with parameters (safe from SQL injection)
export const getUserById = (
  userId: string
): Effect.Effect<UserRow | undefined, SqlError, PgClient.PgClient> =>
  Effect.gen(function*() {
    const sql = yield* Pg.PgClient

    const user = yield* sql<UserRow>`
      SELECT * FROM users
      WHERE user_id = ${userId}
    `

    return user[0] // Returns first result or undefined
  })

// Example 5: Insert with returning values
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

// Example 6: Update query
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

// Example 7: Delete query
export const deleteUser = (
  userId: string
): Effect.Effect<{ success: boolean }, SqlError, PgClient.PgClient> =>
  Effect.gen(function*() {
    const sql = yield* Pg.PgClient

    yield* sql`
      DELETE FROM users
      WHERE user_id = ${userId}
    `

    return { success: true }
  })

// Example 8: Transaction usage
export const createProjectWithUser = (
  userName: string,
  userEmail: string,
  projectName: string,
  description: string
): Effect.Effect<
  { project: ProjectRow; user: { user_id: string } },
  SqlError,
  PgClient.PgClient
> =>
  Effect.gen(function*() {
    const sql = yield* Pg.PgClient

    // Start a transaction
    const result = yield* sql.withTransaction(
      Effect.gen(function*() {
        // Insert user
        const [user] = yield* sql<{ user_id: string }>`
          INSERT INTO users (name, email, password_hash)
          VALUES (${userName}, ${userEmail}, 'temp-hash')
          RETURNING user_id
        `

        // Insert project for that user
        const [project] = yield* sql<ProjectRow>`
          INSERT INTO projects (project_name, user_id, description, software_type)
          VALUES (${projectName}, ${user.user_id}, ${description}, 'strudel')
          RETURNING *
        `

        return { project, user }
      })
    )

    return result
  })

// Example 9: Complex query with JOIN
export const getProjectsWithUsers: Effect.Effect<
  ReadonlyArray<ProjectWithUserRow>,
  SqlError,
  PgClient.PgClient
> = Effect.gen(function*() {
  const sql = yield* Pg.PgClient

  const projects = yield* sql<ProjectWithUserRow>`
    SELECT 
      p.*,
      u.name as user_name,
      u.email as user_email
    FROM projects p
    INNER JOIN users u ON p.user_id = u.user_id
    ORDER BY p.created_at DESC
    LIMIT 10
  `

  return projects
})

// Example 10: Aggregate query
export const getUserProjectCount = (
  userId: string
): Effect.Effect<UserProjectCountRow, SqlError, PgClient.PgClient> =>
  Effect.gen(function*() {
    const sql = yield* Pg.PgClient

    const [result] = yield* sql<UserProjectCountRow>`
      SELECT 
        u.user_id,
        u.name,
        COUNT(p.project_id) as project_count
      FROM users u
      LEFT JOIN projects p ON u.user_id = p.user_id
      WHERE u.user_id = ${userId}
      GROUP BY u.user_id, u.name
    `

    return result
  })

// Example 11: Error handling
export const safeGetUser = (
  userId: string
): Effect.Effect<UserRow | undefined, never, PgClient.PgClient> =>
  Effect.gen(function*() {
    const sql = yield* Pg.PgClient

    const user = yield* sql<UserRow>`
      SELECT * FROM users WHERE user_id = ${userId}
    `.pipe(
      Effect.catchAll((error) =>
        Effect.gen(function*() {
          yield* Effect.logError(`Failed to get user: ${error}`)
          return []
        })
      )
    )

    return user[0]
  })

// Example 12: Running a program with the PgClient layer
export const runExample = (): Promise<ReadonlyArray<UserRow>> => {
  const program: Effect.Effect<
    ReadonlyArray<UserRow>,
    SqlError,
    PgClient.PgClient
  > = Effect.gen(function*() {
    // Get all users
    const users = yield* getAllUsers

    yield* Effect.logInfo(`Found ${users.length} users`)

    // Create a new user
    if (users.length === 0) {
      const newUser = yield* createUser('John Doe', 'john@example.com', 'hashed-password')
      yield* Effect.logInfo(`Created user: ${newUser.name}`)
    }

    return users
  })

  // Run the program with the PgClient layer provided
  return Effect.provide(program, PgLive).pipe(Effect.runPromise)
}

// Example 13: Using prepared statements (for better performance with repeated queries)
export const getPreparedUserQuery: Effect.Effect<
  (userId: string) => Effect.Effect<ReadonlyArray<UserRow>, SqlError, never>,
  SqlError,
  PgClient.PgClient
> = Effect.gen(function*() {
  const sql = yield* Pg.PgClient

  // The client automatically uses prepared statements for parameterized queries
  // This is more efficient when running the same query multiple times
  const getUser = (userId: string) =>
    sql<UserRow>`
      SELECT * FROM users WHERE user_id = ${userId}
    `

  return getUser
})

// Example 14: Batch operations
export const createMultipleProjects = (
  projects: Array<{ description: string; name: string; userId: string }>
): Effect.Effect<ReadonlyArray<ProjectRow>, SqlError, PgClient.PgClient> =>
  Effect.gen(function*() {
    const sql = yield* Pg.PgClient

    // Use Promise.all with Effect for parallel execution
    const results = yield* Effect.all(
      projects.map((project) =>
        sql<ProjectRow>`
          INSERT INTO projects (project_name, user_id, description, software_type)
          VALUES (${project.name}, ${project.userId}, ${project.description}, 'strudel')
          RETURNING *
        `
      ),
      { concurrency: 5 } // Limit concurrency to 5 queries at a time
    )

    return results.flat()
  })

// Example 15: Custom configuration with connection pooling
export const PgLiveWithPooling: Layer<PgClient.PgClient, SqlError> = Pg.layer({
  database: 'testDB',
  host: '127.0.0.1',
  maxConnections: 20,
  password: Redacted.make('postgres'),
  port: 5432,
  username: 'postgres'
})
