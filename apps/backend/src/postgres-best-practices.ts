/**
 * PostgreSQL Best Practices with Effect SQL
 *
 * This file demonstrates key best practices for error handling and transactions
 * when using PostgreSQL with Effect's SQL library.
 *
 * Key Principles:
 * 1. Keep transactions short and focused
 * 2. Use subtransactions (savepoints) for granular rollback
 * 3. Design for retry and idempotency
 * 4. Avoid business logic and external actions inside transactions
 * 5. Fail fast and validate early
 * 6. Log errors appropriately (outside transactions when possible)
 * 7. Test error paths
 *
 * @see https://effect.website/docs/guides/sql
 */

import type * as PgClient from '@effect/sql-pg/PgClient'
import * as Pg from '@effect/sql-pg/PgClient'
import type { SqlClient } from '@effect/sql/SqlClient'
import type { SqlError } from '@effect/sql/SqlError'
import * as Config from 'effect/Config'
import type { ConfigError } from 'effect/ConfigError'
import * as Duration from 'effect/Duration'
import * as Effect from 'effect/Effect'
import type * as Layer from 'effect/Layer'
import * as Redacted from 'effect/Redacted'
import * as Schedule from 'effect/Schedule'

// ============================================================================
// CONFIGURATION
// ============================================================================

export const PgLive: Layer.Layer<
  PgClient.PgClient | SqlClient,
  ConfigError | SqlError
> = Pg.layerConfig({
  connectTimeout: Config.succeed(Duration.seconds(5)), // Fail fast
  database: Config.succeed('testDB'),
  host: Config.succeed('127.0.0.1'),
  idleTimeout: Config.succeed(Duration.seconds(30)),
  maxConnections: Config.succeed(20),
  minConnections: Config.succeed(5),
  password: Config.succeed(Redacted.make('postgres')),
  port: Config.succeed(5432),
  username: Config.succeed('postgres')
})

// ============================================================================
// TYPES
// ============================================================================

interface UserRow {
  created_at: Date
  email: string
  name: string
  password_hash: string
  user_id: string
}

interface ProjectRow {
  created_at: Date
  description: string
  project_id: string
  project_name: string
  user_id: string
}

// Custom error types for better error handling
interface ValidationError {
  readonly _tag: 'ValidationError'
  readonly message: string
}

interface UniqueViolationError {
  readonly _tag: 'UniqueViolation'
  readonly field: string
  readonly value: string
}

interface NotFoundError {
  readonly _tag: 'NotFound'
  readonly entity: string
  readonly id: string
}

type AppError = ValidationError | UniqueViolationError | NotFoundError

// ============================================================================
// BEST PRACTICE 1: FAIL FAST & VALIDATE EARLY
// ============================================================================

/**
 * Validate input before hitting the database
 * This prevents wasting database resources on invalid data
 */
const validateEmail = (email: string): Effect.Effect<string, ValidationError> =>
  email.includes('@') && email.length > 3
    ? Effect.succeed(email)
    : Effect.fail({
      _tag: 'ValidationError' as const,
      message: `Invalid email format: ${email}`
    })

const validateUsername = (name: string): Effect.Effect<string, ValidationError> =>
  name.length >= 3 && name.length <= 50
    ? Effect.succeed(name)
    : Effect.fail({
      _tag: 'ValidationError' as const,
      message: 'Username must be between 3 and 50 characters'
    })

/**
 * Validate before executing database operations
 */
export const createUserSafe = (
  name: string,
  email: string,
  passwordHash: string
): Effect.Effect<UserRow, ValidationError | SqlError, PgClient.PgClient> =>
  Effect.gen(function*() {
    // Validate early - fail fast before touching database
    yield* validateUsername(name)
    yield* validateEmail(email)

    const sql = yield* Pg.PgClient

    const [user] = yield* sql<UserRow>`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${passwordHash})
      RETURNING *
    `

    return user
  })

// ============================================================================
// BEST PRACTICE 2: KEEP TRANSACTIONS SHORT AND FOCUSED
// ============================================================================

/**
 * BAD: Long transaction with non-database operations
 */
export const createUserWithEmailBad = (
  name: string,
  email: string
): Effect.Effect<UserRow, SqlError | ValidationError, PgClient.PgClient> =>
  Effect.gen(function*() {
    const sql = yield* Pg.PgClient

    // BAD: Entire flow in transaction including external operations
    return yield* sql.withTransaction(
      Effect.gen(function*() {
        const [user] = yield* sql<UserRow>`
          INSERT INTO users (name, email, password_hash)
          VALUES (${name}, ${email}, 'temp-hash')
          RETURNING *
        `

        // BAD: External API call inside transaction - holds locks!
        // yield* sendWelcomeEmail(email)

        // BAD: Heavy computation inside transaction
        // const recommendation = yield* computeRecommendations(user.user_id)

        return user
      })
    )
  })

/**
 * GOOD: Short, focused transaction - only database operations
 * External actions happen OUTSIDE the transaction
 */
export const createUserWithEmailGood = (
  name: string,
  email: string
): Effect.Effect<UserRow, SqlError | ValidationError, PgClient.PgClient> =>
  Effect.gen(function*() {
    // Validate early
    yield* validateUsername(name)
    yield* validateEmail(email)

    const sql = yield* Pg.PgClient

    // Transaction only contains database operations
    const user = yield* sql.withTransaction(
      Effect.gen(function*() {
        const [newUser] = yield* sql<UserRow>`
          INSERT INTO users (name, email, password_hash)
          VALUES (${name}, ${email}, 'temp-hash')
          RETURNING *
        `
        return newUser
      })
    )

    // External operations AFTER transaction commits
    // yield* sendWelcomeEmail(email).pipe(
    //   Effect.catchAll(() => Effect.logWarning('Failed to send welcome email'))
    // )

    return user
  })

// ============================================================================
// BEST PRACTICE 3: USE SAVEPOINTS FOR GRANULAR ROLLBACK
// ============================================================================

/**
 * Create user and projects with partial rollback capability
 * If a project fails, we can rollback just that project without losing the user
 */
export const createUserWithProjects = (
  userName: string,
  email: string,
  projects: ReadonlyArray<{ name: string; description: string }>
): Effect.Effect<
  { successCount: number; user: UserRow },
  SqlError | ValidationError,
  PgClient.PgClient
> =>
  Effect.gen(function*() {
    yield* validateUsername(userName)
    yield* validateEmail(email)

    const sql = yield* Pg.PgClient

    return yield* sql.withTransaction(
      Effect.gen(function*() {
        // Create user - this must succeed
        const [user] = yield* sql<UserRow>`
          INSERT INTO users (name, email, password_hash)
          VALUES (${userName}, ${email}, 'temp-hash')
          RETURNING *
        `

        let successCount = 0

        // Try to create each project with implicit savepoints via catchAll
        for (const project of projects) {
          // Each project creation is isolated
          // If one fails, others can still succeed
          const projectResult = yield* sql<ProjectRow>`
            INSERT INTO projects (project_name, user_id, description, software_type)
            VALUES (${project.name}, ${user.user_id}, ${project.description}, 'strudel')
            RETURNING *
          `.pipe(
            Effect.catchAll((error) =>
              Effect.gen(function*() {
                // Log the error but don't fail the whole transaction
                yield* Effect.logWarning(
                  `Failed to create project ${project.name}: ${error.message}`
                )
                return null
              })
            )
          )

          if (projectResult !== null) {
            successCount++
          }
        }

        return { successCount, user }
      })
    )
  })

// ============================================================================
// BEST PRACTICE 4: DESIGN FOR RETRY & IDEMPOTENCY
// ============================================================================

/**
 * Idempotent user creation - can be retried safely
 * Uses ON CONFLICT to make operation idempotent
 */
export const createOrGetUser = (
  name: string,
  email: string,
  passwordHash: string
): Effect.Effect<UserRow, SqlError | ValidationError, PgClient.PgClient> =>
  Effect.gen(function*() {
    yield* validateUsername(name)
    yield* validateEmail(email)

    const sql = yield* Pg.PgClient

    // Idempotent operation using ON CONFLICT
    const [user] = yield* sql<UserRow>`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${passwordHash})
      ON CONFLICT (email) DO UPDATE 
      SET name = EXCLUDED.name
      RETURNING *
    `

    return user
  })

/**
 * Retry transient errors with exponential backoff
 * Only retries on serialization failures and deadlocks
 */
export const createUserWithRetry = (
  name: string,
  email: string,
  passwordHash: string
): Effect.Effect<UserRow, SqlError | ValidationError, PgClient.PgClient> =>
  Effect.gen(function*() {
    const createUser = createOrGetUser(name, email, passwordHash)

    // Retry policy: exponential backoff, max 3 retries
    const retryPolicy = Schedule.exponential(Duration.millis(100)).pipe(
      Schedule.compose(Schedule.recurs(3)),
      // Only retry on transient errors
      Schedule.whileInput((error: SqlError | ValidationError) => {
        if (error._tag === 'ValidationError') return false

        const msg = error.message || ''
        // Retry on serialization failures and deadlocks
        return (
          msg.includes('could not serialize') ||
          msg.includes('deadlock detected') ||
          msg.includes('connection')
        )
      })
    )

    return yield* Effect.retry(createUser, retryPolicy)
  })

// ============================================================================
// BEST PRACTICE 5: PROPER ERROR HANDLING WITH SPECIFIC EXCEPTIONS
// ============================================================================

/**
 * Parse SQL errors into domain-specific errors
 */
const parseSqlError = (error: SqlError): AppError => {
  const message = error.message || ''
  const cause = error.cause as { code?: string; constraint?: string } | undefined

  // Unique violation (code 23505)
  if (message.includes('unique') || cause?.code === '23505') {
    const constraint = cause?.constraint || ''
    const field = constraint.includes('email') ? 'email' : 'unknown'

    return {
      _tag: 'UniqueViolation' as const,
      field,
      value: message
    }
  }

  // Not found
  if (message.includes('not found') || message.includes('no rows')) {
    return {
      _tag: 'NotFound' as const,
      entity: 'User',
      id: 'unknown'
    }
  }

  // Default: convert to validation error
  return {
    _tag: 'ValidationError' as const,
    message: `Database error: ${message}`
  }
}

/**
 * Get user with specific error handling
 */
export const getUserByIdSafe = (
  userId: string
): Effect.Effect<UserRow, AppError, PgClient.PgClient> =>
  Effect.gen(function*() {
    const sql = yield* Pg.PgClient

    const users = yield* sql<UserRow>`
      SELECT * FROM users WHERE user_id = ${userId}
    `.pipe(Effect.mapError(parseSqlError))

    if (users.length === 0) {
      return yield* Effect.fail({
        _tag: 'NotFound' as const,
        entity: 'User',
        id: userId
      })
    }

    return users[0]
  })

// ============================================================================
// BEST PRACTICE 6: LOG ERRORS APPROPRIATELY
// ============================================================================

/**
 * PITFALL: Logging inside a transaction that gets rolled back
 * The logs will be lost!
 *
 * SOLUTION: Log OUTSIDE the transaction, or use a separate connection
 */

/**
 * BAD: Logs inside transaction get rolled back
 */
export const createUserWithLoggingBad = (
  name: string,
  email: string
): Effect.Effect<UserRow, SqlError, PgClient.PgClient> =>
  Effect.gen(function*() {
    const sql = yield* Pg.PgClient

    return yield* sql.withTransaction(
      Effect.gen(function*() {
        // BAD: This log will be lost if transaction rolls back
        yield* sql`
          INSERT INTO audit_log (action, details)
          VALUES ('user_creation_started', ${JSON.stringify({ name, email })})
        `

        const [user] = yield* sql<UserRow>`
          INSERT INTO users (name, email, password_hash)
          VALUES (${name}, ${email}, 'temp-hash')
          RETURNING *
        `

        // This might fail, rolling back everything including the log
        yield* sql`
          INSERT INTO invalid_table (data)
          VALUES ('test')
        `

        return user
      })
    )
  })

/**
 * GOOD: Log OUTSIDE transaction or handle separately
 */
export const createUserWithLoggingGood = (
  name: string,
  email: string
): Effect.Effect<UserRow, SqlError | ValidationError, PgClient.PgClient> =>
  Effect.gen(function*() {
    // Log attempt (using Effect.logInfo, not database)
    yield* Effect.logInfo(`Attempting to create user: ${email}`)

    const sql = yield* Pg.PgClient

    const result = yield* sql.withTransaction(
      Effect.gen(function*() {
        const [user] = yield* sql<UserRow>`
          INSERT INTO users (name, email, password_hash)
          VALUES (${name}, ${email}, 'temp-hash')
          RETURNING *
        `
        return user
      })
    ).pipe(
      Effect.tap(() => Effect.logInfo(`Successfully created user: ${email}`)),
      Effect.tapError((error) => Effect.logError(`Failed to create user ${email}: ${error.message}`))
    )

    // Optionally: Log to database AFTER transaction commits
    yield* sql`
      INSERT INTO audit_log (action, details, created_at)
      VALUES (
        'user_created',
        ${JSON.stringify({ user_id: result.user_id, email })},
        NOW()
      )
    `.pipe(
      Effect.catchAll(() => Effect.logWarning('Failed to write audit log - non-critical'))
    )

    return result
  })

// ============================================================================
// BEST PRACTICE 7: HANDLE CONSTRAINT VIOLATIONS GRACEFULLY
// ============================================================================

/**
 * Handle unique constraint violations gracefully
 */
export const registerUser = (
  name: string,
  email: string,
  passwordHash: string
): Effect.Effect<
  { created: boolean; user: UserRow },
  AppError,
  PgClient.PgClient
> =>
  Effect.gen(function*() {
    yield* validateUsername(name)
    yield* validateEmail(email)

    const sql = yield* Pg.PgClient

    // Try to create user
    const createResult = yield* sql<UserRow>`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${passwordHash})
      RETURNING *
    `.pipe(
      Effect.map((users) => ({ created: true, user: users[0] })),
      Effect.catchAll((error: SqlError) => {
        const appError = parseSqlError(error)

        // Check for unique violation on email
        if (appError._tag === 'UniqueViolation' && appError.field === 'email') {
          // User already exists - fetch existing user
          return sql<UserRow>`
            SELECT * FROM users WHERE email = ${email}
          `.pipe(
            Effect.map((users) => ({ created: false, user: users[0] })),
            Effect.mapError(() => ({
              _tag: 'ValidationError' as const,
              message: 'User exists but could not be retrieved'
            }))
          )
        }

        // Other errors
        return Effect.fail(appError)
      })
    )

    return createResult
  })

// ============================================================================
// BEST PRACTICE 8: PROPER TRANSACTION ISOLATION
// ============================================================================

/**
 * Use appropriate isolation level for business logic
 * PostgreSQL default is READ COMMITTED, but you can specify others
 */
export const transferProjectOwnership = (
  projectId: string,
  fromUserId: string,
  toUserId: string
): Effect.Effect<ProjectRow, AppError | SqlError, PgClient.PgClient> =>
  Effect.gen(function*() {
    const sql = yield* Pg.PgClient

    return yield* sql.withTransaction(
      Effect.gen(function*() {
        // Set isolation level if needed (PostgreSQL supports this via SQL)
        // BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

        // Verify project ownership
        const projects = yield* sql<ProjectRow>`
          SELECT * FROM projects
          WHERE project_id = ${projectId}
          FOR UPDATE  -- Lock the row
        `

        if (projects.length === 0) {
          return yield* Effect.fail({
            _tag: 'NotFound' as const,
            entity: 'Project',
            id: projectId
          })
        }

        const project = projects[0]

        if (project.user_id !== fromUserId) {
          return yield* Effect.fail({
            _tag: 'ValidationError' as const,
            message: 'User does not own this project'
          })
        }

        // Verify new owner exists
        const users = yield* sql<UserRow>`
          SELECT * FROM users WHERE user_id = ${toUserId}
        `

        if (users.length === 0) {
          return yield* Effect.fail({
            _tag: 'NotFound' as const,
            entity: 'User',
            id: toUserId
          })
        }

        // Transfer ownership
        const [updatedProject] = yield* sql<ProjectRow>`
          UPDATE projects
          SET user_id = ${toUserId}
          WHERE project_id = ${projectId}
          RETURNING *
        `

        return updatedProject
      })
    )
  })

// ============================================================================
// BEST PRACTICE 9: TEST ERROR PATHS
// ============================================================================

/**
 * Example test utilities for simulating errors
 */
export const TestScenarios = {
  /**
   * Simulate constraint violation
   */
  createDuplicateUser: Effect.gen(function*() {
    yield* createOrGetUser('Test User', 'test@example.com', 'hash1')
    return yield* createOrGetUser('Test User 2', 'test@example.com', 'hash2')
  }),

  /**
   * Simulate not found error
   */
  getNonExistentUser: getUserByIdSafe('00000000-0000-0000-0000-000000000000'),

  /**
   * Simulate validation error
   */
  createInvalidUser: createUserSafe('ab', 'invalid-email', 'hash')
}

// ============================================================================
// KEY TAKEAWAYS - ANTI-PATTERNS TO AVOID
// ============================================================================

/**
 * PITFALL 1: Long-lived transactions
 * ❌ Don't: Keep transactions open while doing external API calls
 * ✅ Do: Keep transactions short, only database operations
 *
 * PITFALL 2: Logging inside rolled-back transactions
 * ❌ Don't: Write audit logs inside a transaction that might roll back
 * ✅ Do: Log outside transactions, or use Effect.logInfo/logError
 *
 * PITFALL 3: Not handling constraint violations
 * ❌ Don't: Let unique violations crash your application
 * ✅ Do: Use ON CONFLICT or catch and handle gracefully
 *
 * PITFALL 4: Retrying non-idempotent operations
 * ❌ Don't: Retry operations that could create duplicates
 * ✅ Do: Design idempotent operations with ON CONFLICT
 *
 * PITFALL 5: Not validating input early
 * ❌ Don't: Let invalid data reach the database
 * ✅ Do: Validate in application layer before database operations
 *
 * PITFALL 6: Catch-all error handling
 * ❌ Don't: Use generic error handlers for all errors
 * ✅ Do: Parse and handle specific error types (unique violation, not found, etc.)
 *
 * PITFALL 7: Forgetting to rollback on error
 * ❌ Don't: Leave transaction in aborted state
 * ✅ Do: Use withTransaction which handles rollback automatically
 *
 * PITFALL 8: Too many savepoints
 * ❌ Don't: Wrap every statement in a savepoint
 * ✅ Do: Use savepoints for meaningful isolation only
 */
