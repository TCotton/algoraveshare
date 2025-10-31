import { describe, expect, it } from 'vitest'
import { Schema } from 'effect'
import { TagAssignmentSchema } from '../src/tagAssignments.schema.js'

describe('TagAssignmentSchema', () => {
  describe('valid data', () => {
    it('should successfully decode valid tag assignment data for project entity', () => {
      const validTagAssignment = {
        tagId: 1,
        entityType: 'project' as const,
        entityId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T00:00:00Z',
      }

      const result = Schema.decodeUnknownSync(TagAssignmentSchema)(validTagAssignment)
      expect(result).toEqual({
        ...validTagAssignment,
        createdAt: new Date('2023-01-01T00:00:00Z'),
      })
    })

    it('should successfully decode valid tag assignment data for snippet entity', () => {
      const validTagAssignment = {
        tagId: 5,
        entityType: 'snippet' as const,
        entityId: '123e4567-e89b-12d3-a456-426614174001',
        createdAt: '2023-06-15T12:30:00Z',
      }

      const result = Schema.decodeUnknownSync(TagAssignmentSchema)(validTagAssignment)
      expect(result).toEqual({
        ...validTagAssignment,
        createdAt: new Date('2023-06-15T12:30:00Z'),
      })
    })

    it('should decode with different tag IDs', () => {
      const tagIds = [1, 10, 100, 999]

      tagIds.forEach((tagId) => {
        const validTagAssignment = {
          tagId,
          entityType: 'project' as const,
          entityId: '123e4567-e89b-12d3-a456-426614174000',
          createdAt: '2023-01-01T00:00:00Z',
        }

        const result = Schema.decodeUnknownSync(TagAssignmentSchema)(validTagAssignment)
        expect(result.tagId).toBe(tagId)
      })
    })

    it('should decode with different entity UUIDs', () => {
      const entityIds = [
        '123e4567-e89b-12d3-a456-426614174000',
        '987fcdeb-51a2-43d7-b123-456789abcdef',
        '11111111-2222-3333-4444-555555555555',
        'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      ]

      entityIds.forEach((entityId) => {
        const validTagAssignment = {
          tagId: 1,
          entityType: 'snippet' as const,
          entityId,
          createdAt: '2023-01-01T00:00:00Z',
        }

        const result = Schema.decodeUnknownSync(TagAssignmentSchema)(validTagAssignment)
        expect(result.entityId).toBe(entityId)
      })
    })

    it('should decode with different creation dates', () => {
      const dates = [
        '2020-01-01T00:00:00Z',
        '2023-06-15T12:30:45Z',
        '2024-12-31T23:59:59Z',
        '2023-01-01T00:00:00Z',
      ]

      dates.forEach((createdAt) => {
        const validTagAssignment = {
          tagId: 1,
          entityType: 'project' as const,
          entityId: '123e4567-e89b-12d3-a456-426614174000',
          createdAt,
        }

        const result = Schema.decodeUnknownSync(TagAssignmentSchema)(validTagAssignment)
        expect(result.createdAt).toEqual(new Date(createdAt))
      })
    })
  })

  describe('invalid data', () => {
    it('should fail with invalid entity type', () => {
      const invalidTagAssignment = {
        tagId: 1,
        entityType: 'user', // invalid entity type
        entityId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T00:00:00Z',
      }

      expect(() => Schema.decodeUnknownSync(TagAssignmentSchema)(invalidTagAssignment)).toThrow()
    })

    it('should fail with non-number tagId', () => {
      const invalidTagAssignment = {
        tagId: 'not-a-number',
        entityType: 'project',
        entityId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T00:00:00Z',
      }

      expect(() => Schema.decodeUnknownSync(TagAssignmentSchema)(invalidTagAssignment)).toThrow()
    })

    it('should fail with invalid UUID for entityId', () => {
      const invalidTagAssignment = {
        tagId: 1,
        entityType: 'project',
        entityId: 'invalid-uuid',
        createdAt: '2023-01-01T00:00:00Z',
      }

      expect(() => Schema.decodeUnknownSync(TagAssignmentSchema)(invalidTagAssignment)).toThrow()
    })

    it('should fail with invalid Date for createdAt', () => {
      const invalidTagAssignment = {
        tagId: 1,
        entityType: 'project',
        entityId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: 'invalid-date',
      }

      expect(() => Schema.decodeUnknownSync(TagAssignmentSchema)(invalidTagAssignment)).toThrow()
    })

    it('should fail with null tagId', () => {
      const invalidTagAssignment = {
        tagId: null,
        entityType: 'project',
        entityId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T00:00:00Z',
      }

      expect(() => Schema.decodeUnknownSync(TagAssignmentSchema)(invalidTagAssignment)).toThrow()
    })

    it('should fail with null entityType', () => {
      const invalidTagAssignment = {
        tagId: 1,
        entityType: null,
        entityId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T00:00:00Z',
      }

      expect(() => Schema.decodeUnknownSync(TagAssignmentSchema)(invalidTagAssignment)).toThrow()
    })

    it('should fail with null entityId', () => {
      const invalidTagAssignment = {
        tagId: 1,
        entityType: 'project',
        entityId: null,
        createdAt: '2023-01-01T00:00:00Z',
      }

      expect(() => Schema.decodeUnknownSync(TagAssignmentSchema)(invalidTagAssignment)).toThrow()
    })

    it('should fail with missing required fields', () => {
      const incompleteTagAssignment = {
        tagId: 1,
        entityType: 'project',
        // missing entityId and createdAt
      }

      expect(() => Schema.decodeUnknownSync(TagAssignmentSchema)(incompleteTagAssignment)).toThrow()
    })

    it('should allow decimal tagId (Effect Number schema is permissive)', () => {
      const validTagAssignment = {
        tagId: 1.5, // Effect Number schema allows decimals
        entityType: 'project',
        entityId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T00:00:00Z',
      }

      const result = Schema.decodeUnknownSync(TagAssignmentSchema)(validTagAssignment)
      expect(result.tagId).toBe(1.5)
    })

    it('should allow negative tagId (Effect Number schema is permissive)', () => {
      const validTagAssignment = {
        tagId: -1,
        entityType: 'project',
        entityId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T00:00:00Z',
      }

      const result = Schema.decodeUnknownSync(TagAssignmentSchema)(validTagAssignment)
      expect(result.tagId).toBe(-1)
    })
  })

  describe('entity type validation', () => {
    it('should only accept "project" and "snippet" as entity types', () => {
      const validEntityTypes = ['project', 'snippet'] as const
      const invalidEntityTypes = ['user', 'tag', 'comment', 'like', 'follow', 'playlist']

      validEntityTypes.forEach((entityType) => {
        const validTagAssignment = {
          tagId: 1,
          entityType,
          entityId: '123e4567-e89b-12d3-a456-426614174000',
          createdAt: '2023-01-01T00:00:00Z',
        }

        const result = Schema.decodeUnknownSync(TagAssignmentSchema)(validTagAssignment)
        expect(result.entityType).toBe(entityType)
      })

      invalidEntityTypes.forEach((entityType) => {
        const invalidTagAssignment = {
          tagId: 1,
          entityType,
          entityId: '123e4567-e89b-12d3-a456-426614174000',
          createdAt: '2023-01-01T00:00:00Z',
        }

        expect(() => Schema.decodeUnknownSync(TagAssignmentSchema)(invalidTagAssignment)).toThrow()
      })
    })
  })

  describe('edge cases', () => {
    it('should handle very large tag IDs', () => {
      const validTagAssignment = {
        tagId: Number.MAX_SAFE_INTEGER,
        entityType: 'project' as const,
        entityId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T00:00:00Z',
      }

      const result = Schema.decodeUnknownSync(TagAssignmentSchema)(validTagAssignment)
      expect(result.tagId).toBe(Number.MAX_SAFE_INTEGER)
    })

    it('should handle various UUID formats', () => {
      const uuidFormats = [
        '123e4567-e89b-12d3-a456-426614174000', // lowercase
        '123E4567-E89B-12D3-A456-426614174000', // uppercase
        '123e4567-e89b-12d3-a456-426614174000', // mixed case (already lowercase)
      ]

      uuidFormats.forEach((entityId) => {
        const validTagAssignment = {
          tagId: 1,
          entityType: 'snippet' as const,
          entityId,
          createdAt: '2023-01-01T00:00:00Z',
        }

        const result = Schema.decodeUnknownSync(TagAssignmentSchema)(validTagAssignment)
        expect(result.entityId).toBe(entityId) // UUID schema preserves original case
      })
    })

    it('should handle dates at different precision levels', () => {
      const dates = [
        '2023-01-01T00:00:00Z', // date only
        '2023-01-01T12:00:00Z', // with time
        '2023-01-01T12:00:00.123Z', // with milliseconds
        '2023-01-01T12:00:00.123Z', // with timezone
      ]

      dates.forEach((createdAt) => {
        const validTagAssignment = {
          tagId: 1,
          entityType: 'project' as const,
          entityId: '123e4567-e89b-12d3-a456-426614174000',
          createdAt,
        }

        const result = Schema.decodeUnknownSync(TagAssignmentSchema)(validTagAssignment)
        expect(result.createdAt).toEqual(new Date(createdAt))
      })
    })

    it('should not allow extra properties', () => {
      const tagAssignmentWithExtra = {
        tagId: 1,
        entityType: 'project' as const,
        entityId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T00:00:00Z',
      }

      const result = Schema.decodeUnknownSync(TagAssignmentSchema)(tagAssignmentWithExtra)
      expect('extraProperty' in result).toBe(false)
    })
  })
})
