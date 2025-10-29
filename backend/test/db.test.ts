import * as it from '@effect/vitest'
import { Effect, Exit, Redacted } from 'effect'
import * as pg from 'pg'
import { afterEach, beforeEach, describe, expect, vi } from 'vitest'
import { Database, DatabaseConnectionLostError, DatabaseError, layer } from '../src/db'

// Mock pg module
vi.mock('pg')

// Mock drizzle-orm
vi.mock('drizzle-orm/node-postgres', () => ({
  drizzle: vi.fn((pool) => ({
    query: vi.fn(),
    transaction: vi.fn(),
    $client: pool
  }))
}))

describe('Database', () => {
  const mockConfig = {
    url: Redacted.make('postgres://test:test@localhost:5432/testdb'),
    ssl: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Database Layer', () => {
    it.effect('should create database service successfully', () =>
      Effect.gen(function*() {
        const mockPool = {
          query: vi.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] }),
          end: vi.fn().mockResolvedValue(undefined),
          on: vi.fn().mockReturnThis(),
          removeAllListeners: vi.fn()
        }

        vi.mocked(pg.Pool).mockImplementation(() => mockPool as any)

        const program = Effect.gen(function*() {
          const db = yield* Database
          expect(db).toHaveProperty('execute')
          expect(db).toHaveProperty('transaction')
          expect(db).toHaveProperty('setupConnectionListeners')
          expect(db).toHaveProperty('makeQuery')
        })

        yield* program.pipe(Effect.provide(layer(mockConfig)))
      }))

    it.effect('should fail when database connection throws error', () =>
      Effect.gen(function*() {
        const mockPool = {
          query: vi.fn().mockRejectedValue(new Error('Connection refused')),
          end: vi.fn().mockResolvedValue(undefined),
          on: vi.fn().mockReturnThis(),
          removeAllListeners: vi.fn()
        }

        vi.mocked(pg.Pool).mockImplementation(() => mockPool as any)

        const program = Effect.gen(function*() {
          yield* Database
        })

        const exit = yield* Effect.exit(program.pipe(Effect.provide(layer(mockConfig))))

        expect(Exit.isFailure(exit)).toBe(true)
      }))
  })

  describe('DatabaseError', () => {
    it.effect('should handle unique violation error', () =>
      Effect.sync(() => {
        const pgError = Object.assign(new Error('Unique constraint violation'), {
          code: '23505',
          severity: 'ERROR'
        }) as pg.DatabaseError

        const dbError = new DatabaseError({ type: 'unique_violation', cause: pgError })

        expect(dbError.type).toBe('unique_violation')
        expect(dbError.message).toBe('Unique constraint violation')
        expect(dbError.toString()).toContain('DatabaseError: Unique constraint violation')
      }))

    it.effect('should handle foreign key violation error', () =>
      Effect.sync(() => {
        const pgError = Object.assign(new Error('Foreign key constraint violation'), {
          code: '23503',
          severity: 'ERROR'
        }) as pg.DatabaseError

        const dbError = new DatabaseError({ type: 'foreign_key_violation', cause: pgError })

        expect(dbError.type).toBe('foreign_key_violation')
        expect(dbError.message).toBe('Foreign key constraint violation')
      }))

    it.effect('should handle connection error', () =>
      Effect.sync(() => {
        const pgError = Object.assign(new Error('Connection error'), {
          code: '08000',
          severity: 'ERROR'
        }) as pg.DatabaseError

        const dbError = new DatabaseError({ type: 'connection_error', cause: pgError })

        expect(dbError.type).toBe('connection_error')
        expect(dbError.message).toBe('Connection error')
      }))
  })

  describe('DatabaseConnectionLostError', () => {
    it.effect('should create connection lost error', () =>
      Effect.sync(() => {
        const error = new DatabaseConnectionLostError({
          cause: new Error('Pool error'),
          message: 'Connection lost'
        })

        expect(error.message).toBe('Connection lost')
        expect(error.cause).toBeInstanceOf(Error)
      }))
  })

  describe('Database.execute', () => {
    it.effect('should execute queries successfully', () =>
      Effect.gen(function*() {
        const mockPool = {
          query: vi.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] }),
          end: vi.fn().mockResolvedValue(undefined),
          on: vi.fn().mockReturnThis(),
          removeAllListeners: vi.fn()
        }

        vi.mocked(pg.Pool).mockImplementation(() => mockPool as any)

        const program = Effect.gen(function*() {
          const db = yield* Database
          const result = yield* db.execute(async (_client) => {
            return { id: 1, name: 'Test User' }
          })

          expect(result).toEqual({ id: 1, name: 'Test User' })
        })

        yield* program.pipe(Effect.provide(layer(mockConfig)))
      }))
  })

  describe('Database.makeQuery', () => {
    it.effect('should create query function that uses execute by default', () =>
      Effect.gen(function*() {
        const mockPool = {
          query: vi.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] }),
          end: vi.fn().mockResolvedValue(undefined),
          on: vi.fn().mockReturnThis(),
          removeAllListeners: vi.fn()
        }

        vi.mocked(pg.Pool).mockImplementation(() => mockPool as any)

        const program = Effect.gen(function*() {
          const db = yield* Database

          const getUser = db.makeQuery((execute, id: number) =>
            execute(async (_client) => {
              return { id, name: `User ${id}` }
            })
          )

          const user = yield* getUser(1)
          expect(user).toEqual({ id: 1, name: 'User 1' })
        })

        yield* program.pipe(Effect.provide(layer(mockConfig)))
      }))
  })

  describe('Connection listeners', () => {
    it.effect('should setup connection error listeners', () =>
      Effect.gen(function*() {
        const mockPool = {
          query: vi.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] }),
          end: vi.fn().mockResolvedValue(undefined),
          on: vi.fn().mockReturnThis(),
          removeAllListeners: vi.fn()
        }

        vi.mocked(pg.Pool).mockImplementation(() => mockPool as any)

        const program = Effect.gen(function*() {
          const db = yield* Database
          expect(db.setupConnectionListeners).toBeDefined()
        })

        yield* program.pipe(Effect.provide(layer(mockConfig)))
      }))
  })

  describe('Layer integration', () => {
    it.effect('should compose with other layers', () =>
      Effect.gen(function*() {
        const mockPool = {
          query: vi.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] }),
          end: vi.fn().mockResolvedValue(undefined),
          on: vi.fn().mockReturnThis(),
          removeAllListeners: vi.fn()
        }

        vi.mocked(pg.Pool).mockImplementation(() => mockPool as any)

        const program = Effect.gen(function*() {
          const db = yield* Database
          expect(db).toHaveProperty('execute')
          expect(db).toHaveProperty('transaction')
          expect(db).toHaveProperty('makeQuery')
        })

        yield* Effect.provide(program, layer(mockConfig))
      }))
  })
})
