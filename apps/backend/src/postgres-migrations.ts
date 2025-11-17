/**
 * PostgreSQL Database Migrations with Effect
 *
 * This file demonstrates how to use the Effect PostgreSQL migrator
 * to manage database schema migrations.
 *
 * The migrator:
 * - Creates a migrations table to track applied migrations
 * - Runs migrations in order based on migration ID
 * - Skips already-applied migrations
 * - Runs each migration in a transaction
 *
 * npx tsx apps/backend/postgres-migrations.ts
 *
 * @see https://effect-ts.github.io/effect/sql-pg/PgMigrator.ts.html
 */

import { NodeCommandExecutor, NodeContext, NodeFileSystem, NodePath } from '@effect/platform-node'
import * as Pg from '@effect/sql-pg/PgClient'
import * as PgMigrator from '@effect/sql-pg/PgMigrator'
import type { SqlClient } from '@effect/sql/SqlClient'
import type { SqlError } from '@effect/sql/SqlError'
import * as Config from 'effect/Config'
import type { ConfigError } from 'effect/ConfigError'
import * as Effect from 'effect/Effect'
import type * as Layer from 'effect/Layer'
import * as Redacted from 'effect/Redacted'

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * PostgreSQL Client Layer
 */
const PgLive: Layer.Layer<Pg.PgClient | SqlClient, ConfigError | SqlError> = Pg.layerConfig({
  database: Config.succeed('testDB'),
  host: Config.succeed('127.0.0.1'),
  password: Config.succeed(Redacted.make('postgres')),
  port: Config.succeed(5432),
  username: Config.succeed('postgres')
})

/**
 * Alternative: Use DATABASE_URL from environment
 */
const PgLiveFromEnv: Layer.Layer<
  Pg.PgClient | SqlClient,
  ConfigError | SqlError
> = Pg.layerConfig({
  url: Config.redacted('DATABASE_URL')
})

// ============================================================================
// MIGRATION LAYER - File System Based
// ============================================================================

/**
 * Create migrator layer from SQL files directory
 * Migrations are loaded from ../database/sql/ directory
 *
 * File naming convention:
 * - 001_init_schema.sql
 * - 002_add_users.sql
 * - 003_add_projects.sql
 *
 * Files are processed in alphabetical order
 */

// ============================================================================
// RUNNING MIGRATIONS
// ============================================================================

/**
 * Run all pending migrations
 * Returns array of [id, name] for applied migrations
 */
export const runMigrations = Effect.gen(function*() {
  yield* Effect.logInfo('Starting database migrations...')

  // Run migrations using the layer-based approach
  const result = yield* PgMigrator.run({
    loader: PgMigrator.fromFileSystem('../database/sql'),
    table: 'effect_migrations'
  })

  yield* Effect.logInfo(`Applied ${result.length} migration(s)`)

  for (const [id, name] of result) {
    yield* Effect.logInfo(`  ✓ ${id}: ${name}`)
  }

  return result
})

/**
 * Run migrations with all required layers
 */
export const runMigrationsWithLayers = runMigrations.pipe(
  Effect.provide(PgLive),
  Effect.provide(NodeFileSystem.layer),
  Effect.provide(NodePath.layer),
  Effect.provide(NodeCommandExecutor.layer),
  Effect.provide(NodeContext.layer)
)

/**
 * Run migrations from environment DATABASE_URL
 */
export const runMigrationsFromEnv = runMigrations.pipe(
  Effect.provide(PgLiveFromEnv),
  Effect.provide(NodeFileSystem.layer),
  Effect.provide(NodePath.layer),
  Effect.provide(NodeCommandExecutor.layer),
  Effect.provide(NodeContext.layer)
)

// ============================================================================
// CHECKING MIGRATION STATUS
// ============================================================================

/**
 * List all applied migrations from the database
 */
export const listAppliedMigrations = Effect.gen(function*() {
  const sql = yield* Pg.PgClient

  // Query the migrations table
  const migrations = yield* sql<{
    created_at: Date
    migration_id: number
    name: string
  }>`
    SELECT migration_id, name, created_at
    FROM effect_migrations
    ORDER BY migration_id ASC
  `.pipe(Effect.catchAll(() => Effect.succeed([])))

  yield* Effect.logInfo(`Found ${migrations.length} applied migrations:`)

  for (const migration of migrations) {
    yield* Effect.logInfo(
      `  ${migration.migration_id}: ${migration.name} (${migration.created_at.toISOString()})`
    )
  }

  return migrations
})

/**
 * Check if migrations table exists
 */
export const checkMigrationsTable = Effect.gen(function*() {
  const sql = yield* Pg.PgClient

  const result = yield* sql<{ exists: boolean }>`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'effect_migrations'
    ) as exists
  `

  const exists = result[0]?.exists ?? false
  yield* Effect.logInfo(`Migrations table exists: ${exists}`)

  return exists
})

// ============================================================================
// SAFE MIGRATION RUNNER WITH CHECKS
// ============================================================================

/**
 * Run migrations with pre and post checks
 */
export const runMigrationsSafe = Effect.gen(function*() {
  yield* Effect.logInfo('=== Database Migration Runner ===')

  // 1. Test database connection
  yield* Effect.logInfo('Checking database connection...')
  const sql = yield* Pg.PgClient
  yield* sql`SELECT 1 as health_check`
  yield* Effect.logInfo('✓ Database connection successful')

  // 2. Check if migrations table exists
  yield* Effect.logInfo('Checking migrations table...')
  const tableExists = yield* checkMigrationsTable

  // 3. List currently applied migrations
  if (tableExists) {
    yield* Effect.logInfo('Currently applied migrations:')
    yield* listAppliedMigrations
  } else {
    yield* Effect.logInfo(
      'No migrations table found - will be created on first run'
    )
  }

  // 4. Run migrations
  yield* Effect.logInfo('Running pending migrations...')
  const applied = yield* PgMigrator.run({
    loader: PgMigrator.fromFileSystem('../database/sql'),
    table: 'effect_migrations'
  })

  if (applied.length === 0) {
    yield* Effect.logInfo('No new migrations to apply')
  } else {
    yield* Effect.logInfo(`Successfully applied ${applied.length} migration(s)`)
  }

  // 5. List final state
  yield* Effect.logInfo('Final migration state:')
  yield* listAppliedMigrations

  yield* Effect.logInfo('=== Migration Complete ===')

  return applied
})

/**
 * Safe migration runner with all layers provided
 */
export const runMigrationsSafeWithLayers = runMigrationsSafe.pipe(
  Effect.provide(PgLive),
  Effect.provide(NodeFileSystem.layer),
  Effect.provide(NodePath.layer),
  Effect.provide(NodeCommandExecutor.layer),
  Effect.provide(NodeContext.layer)
)

// ============================================================================
// IN-MEMORY MIGRATIONS (for testing)
// ============================================================================

/**
 * Example: Define migrations in code using fromRecord
 */
const inMemoryMigrations = {
  '001_create_users': Effect.gen(function*() {
    const sql = yield* Pg.PgClient
    yield* sql`
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `
  }),
  '002_create_projects': Effect.gen(function*() {
    const sql = yield* Pg.PgClient
    yield* sql`
      CREATE TABLE IF NOT EXISTS projects (
        project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_name TEXT NOT NULL,
        user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `
    yield* sql`
      CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id)
    `
  })
}

/**
 * Run migrations from in-memory record
 */
export const runInMemoryMigrations = PgMigrator.run({
  loader: PgMigrator.fromRecord(inMemoryMigrations),
  table: 'effect_migrations'
}).pipe(Effect.provide(PgLive))

// ============================================================================
// CLI RUNNER
// ============================================================================

/**
 * Run migrations from command line
 *
 * Usage:
 *   npx tsx apps/backend/postgres-migrations.ts
 */
if (require.main === module) {
  Effect.runPromise(
    runMigrationsSafeWithLayers.pipe(
      Effect.tap(() => {
        process.exit(0)
        return Effect.void
      }),
      Effect.catchAll((error) => {
        console.error('Migration failed:', error)
        process.exit(1)
        return Effect.void
      })
    )
  )
}

// ============================================================================
// KEY TAKEAWAYS
// ============================================================================

/**
 * Best Practices for Effect SQL Migrations:
 *
 * 1. **File Naming Convention**:
 *    - Use numbered prefixes: 001_init.sql, 002_add_users.sql
 *    - Migrations run in alphabetical/numerical order
 *    - Use descriptive names after the number
 *
 * 2. **Migration Content**:
 *    - Keep migrations idempotent when possible (use IF NOT EXISTS)
 *    - Each file runs in its own transaction
 *    - Add indexes after creating tables
 *    - Include comments explaining changes
 *
 * 3. **Running Migrations**:
 *    - Migrations are automatically run in order
 *    - Already-applied migrations are skipped
 *    - Failed migrations rollback automatically
 *    - Migration status is tracked in effect_migrations table
 *
 * 4. **Migration Table Schema**:
 *    ```sql
 *    CREATE TABLE effect_migrations (
 *      migration_id INT PRIMARY KEY,
 *      name TEXT NOT NULL,
 *      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 *    )
 *    ```
 *
 * 5. **No Automatic Rollback**:
 *    - Effect SQL Migrator doesn't have "down" migrations
 *    - To undo changes, create a new forward migration
 *    - Example: 004_rollback_003.sql to undo 003_add_column.sql
 *
 * 6. **Deployment Strategy**:
 *    - Run migrations before deploying new application code
 *    - Test migrations on staging environment first
 *    - Keep migrations backward compatible when possible
 *    - Use feature flags for breaking changes
 *
 * 7. **Error Handling**:
 *    - Always check migration status before and after
 *    - Log migration progress
 *    - Have a rollback plan (new forward migration)
 *    - Test error scenarios
 *
 * 8. **Loaders**:
 *    - fromFileSystem: Load from SQL files directory
 *    - fromRecord: Load from in-memory object (for testing)
 *    - fromGlob: Load using import.meta.glob (Vite)
 *    - fromBabelGlob: Load using require.context (Webpack)
 *
 * 9. **Zero-Downtime Migrations**:
 *    - Add nullable columns first, backfill data, then make NOT NULL
 *    - Create new tables/columns before removing old ones
 *    - Use database views for gradual transitions
 *    - Deploy code that works with both old and new schema
 */
