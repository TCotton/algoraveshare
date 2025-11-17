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

import { PgClient } from '@effect/sql-pg'
import { Config, Effect, Redacted } from 'effect'

// Example 1: Basic PostgreSQL Client Layer
export const PgLive = PgClient.layerConfig({
  database: Config.succeed('testDB'),
  host: Config.succeed('127.0.0.1'),
  password: Config.succeed(Redacted.make('postgres')),
  port: Config.succeed(5432),
  username: Config.succeed('postgres')
})

// Example 2: Using connection string from environment
// DATABASE_URL should be in format: postgresql://user:password@host:port/database
export const PgLiveFromEnv = PgClient
  .layerConfig({
    url: Config.redacted('DATABASE_URL')
  })

// Example 3: Basic query execution
export const getAllUsers = Effect.gen(function*() {
  const sql = yield* PgClient.PgClient

  // Simple SELECT query
  const users = yield* sql`
    SELECT * FROM users
    ORDER BY created_at DESC
  `

  return users
})

// Example 4: Query with parameters (safe from SQL injection)
export const getUserById = (userId: string) =>
  Effect.gen(function*() {
    const sql = yield* PgClient.PgClient

    const user = yield* sql`
      SELECT * FROM users
      WHERE user_id = ${userId}
    `

    return user[0] // Returns first result or undefined
  })

// Example 5: Insert with returning values
export const createUser = (name: string, email: string, passwordHash: string) =>
  Effect.gen(function*() {
    const sql = yield* PgClient.PgClient

    const result = yield* sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${passwordHash})
      RETURNING *
    `

    return result[0]
  })

// Example 6: Update query
export const updateUserLocation = (userId: string, location: string) =>
  Effect.gen(function*() {
    const sql = yield* PgClient.PgClient

    const result = yield* sql`
      UPDATE users
      SET location = ${location}
      WHERE user_id = ${userId}
      RETURNING *
    `

    return result[0]
  })

// Example 7: Delete query
export const deleteUser = (userId: string) =>
  Effect.gen(function*() {
    const sql = yield* PgClient.PgClient

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
) =>
  Effect.gen(function*() {
    const sql = yield* PgClient.PgClient

    // Start a transaction
    const result = yield* sql.withTransaction(
      Effect.gen(function*() {
        // Insert user
        const [user] = yield* sql`
          INSERT INTO users (name, email, password_hash)
          VALUES (${userName}, ${userEmail}, 'temp-hash')
          RETURNING user_id
        `

        // Insert project for that user
        const [project] = yield* sql`
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
export const getProjectsWithUsers = Effect.gen(function*() {
  const sql = yield* PgClient.PgClient

  const projects = yield* sql`
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
export const getUserProjectCount = (userId: string) =>
  Effect.gen(function*() {
    const sql = yield* PgClient.PgClient

    const [result] = yield* sql`
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
export const safeGetUser = (userId: string) =>
  Effect.gen(function*() {
    const sql = yield* PgClient.PgClient

    const user = yield* sql`
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
export const runExample = () => {
  const program = Effect.gen(function*() {
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
export const getPreparedUserQuery = Effect.gen(function*() {
  const sql = yield* PgClient.PgClient

  // The client automatically uses prepared statements for parameterized queries
  // This is more efficient when running the same query multiple times
  const getUser = (userId: string) =>
    sql`
      SELECT * FROM users WHERE user_id = ${userId}
    `

  return getUser
})

// Example 14: Batch operations
export const createMultipleProjects = (projects: Array<{ description: string; name: string; userId: string }>) =>
  Effect.gen(function*() {
    const sql = yield* PgClient.PgClient

    // Use Promise.all with Effect for parallel execution
    const results = yield* Effect.all(
      projects.map((project) =>
        sql`
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
export const PgLiveWithPooling = PgClient.layer({
  database: 'testDB',
  host: '127.0.0.1',
  maxConnections: 20,
  password: Redacted.make('postgres'),
  port: 5432,
  username: 'postgres'
})
