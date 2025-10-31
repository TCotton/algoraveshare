import { describe, expect, it } from 'vitest'
import { Schema } from 'effect'
import { ProjectSchema } from '../src/projects.schema.js'

describe('ProjectSchema', () => {
  describe('valid data', () => {
    it('should successfully decode valid project data', () => {
      const validProject = {
        projectId: '123e4567-e89b-12d3-a456-426614174000',
        projectName: 'Test Project',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        codeStart: 'code start',
        codeEnd: 'code end',
        codeFull: 'full code',
        description: 'A test project',
        audioFilePath: '/path/to/audio.wav',
        audioFileType: 'wav' as const,
        audioData: { duration: 120, sampleRate: 44100 },
        youtubeUrlId: 'dQw4w9WgXcQ',
        softwareType: 'strudel' as const,
        createdAt: '2023-01-01T00:00:00Z',
      }

      const result = Schema.decodeUnknownSync(ProjectSchema)(validProject)
      expect(result).toEqual({
        ...validProject,
        createdAt: new Date('2023-01-01T00:00:00Z'),
      })
    })

    it('should decode with null optional fields', () => {
      const validProject = {
        projectId: '123e4567-e89b-12d3-a456-426614174000',
        projectName: 'Test Project',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        codeStart: null,
        codeEnd: null,
        codeFull: null,
        description: 'A test project',
        audioFilePath: null,
        audioFileType: null,
        audioData: null,
        youtubeUrlId: null,
        softwareType: 'tidalcycles' as const,
        createdAt: '2023-01-01T00:00:00Z',
      }

      const result = Schema.decodeUnknownSync(ProjectSchema)(validProject)
      expect(result).toEqual({
        ...validProject,
        createdAt: new Date('2023-01-01T00:00:00Z'),
      })
    })

    it('should decode with all audio file types', () => {
      const audioTypes = ['wav', 'mp3', 'flac', 'aac', 'ogg'] as const

      audioTypes.forEach((audioType) => {
        const validProject = {
          projectId: '123e4567-e89b-12d3-a456-426614174000',
          projectName: 'Test Project',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          codeStart: null,
          codeEnd: null,
          codeFull: null,
          description: 'A test project',
          audioFilePath: `/path/to/audio.${audioType}`,
          audioFileType: audioType,
          audioData: null,
          youtubeUrlId: null,
          softwareType: 'strudel' as const,
          createdAt: '2023-01-01T00:00:00Z',
        }

        const result = Schema.decodeUnknownSync(ProjectSchema)(validProject)
        expect(result.audioFileType).toBe(audioType)
      })
    })
  })

  describe('invalid data', () => {
    it('should fail with invalid UUID for projectId', () => {
      const invalidProject = {
        projectId: 'invalid-uuid',
        projectName: 'Test Project',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        codeStart: null,
        codeEnd: null,
        codeFull: null,
        description: 'A test project',
        audioFilePath: null,
        audioFileType: null,
        audioData: null,
        youtubeUrlId: null,
        softwareType: 'strudel',
        createdAt: '2023-01-01T00:00:00Z',
      }

      expect(() => Schema.decodeUnknownSync(ProjectSchema)(invalidProject)).toThrow()
    })

    it('should fail with invalid UUID for userId', () => {
      const invalidProject = {
        projectId: '123e4567-e89b-12d3-a456-426614174000',
        projectName: 'Test Project',
        userId: 'invalid-uuid',
        codeStart: null,
        codeEnd: null,
        codeFull: null,
        description: 'A test project',
        audioFilePath: null,
        audioFileType: null,
        audioData: null,
        youtubeUrlId: null,
        softwareType: 'strudel',
        createdAt: '2023-01-01T00:00:00Z',
      }

      expect(() => Schema.decodeUnknownSync(ProjectSchema)(invalidProject)).toThrow()
    })

    it('should fail with invalid audio file type', () => {
      const invalidProject = {
        projectId: '123e4567-e89b-12d3-a456-426614174000',
        projectName: 'Test Project',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        codeStart: null,
        codeEnd: null,
        codeFull: null,
        description: 'A test project',
        audioFilePath: '/path/to/audio.mp4',
        audioFileType: 'mp4', // invalid type
        audioData: null,
        youtubeUrlId: null,
        softwareType: 'strudel',
        createdAt: '2023-01-01T00:00:00Z',
      }

      expect(() => Schema.decodeUnknownSync(ProjectSchema)(invalidProject)).toThrow()
    })

    it('should fail with invalid software type', () => {
      const invalidProject = {
        projectId: '123e4567-e89b-12d3-a456-426614174000',
        projectName: 'Test Project',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        codeStart: null,
        codeEnd: null,
        codeFull: null,
        description: 'A test project',
        audioFilePath: null,
        audioFileType: null,
        audioData: null,
        youtubeUrlId: null,
        softwareType: 'invalid-software', // invalid type
        createdAt: '2023-01-01T00:00:00Z',
      }

      expect(() => Schema.decodeUnknownSync(ProjectSchema)(invalidProject)).toThrow()
    })

    it('should fail with missing required fields', () => {
      const incompleteProject = {
        projectId: '123e4567-e89b-12d3-a456-426614174000',
        // missing required fields
      }

      expect(() => Schema.decodeUnknownSync(ProjectSchema)(incompleteProject)).toThrow()
    })

    it('should fail with non-string projectName', () => {
      const invalidProject = {
        projectId: '123e4567-e89b-12d3-a456-426614174000',
        projectName: 123, // should be string
        userId: '123e4567-e89b-12d3-a456-426614174001',
        codeStart: null,
        codeEnd: null,
        codeFull: null,
        description: 'A test project',
        audioFilePath: null,
        audioFileType: null,
        audioData: null,
        youtubeUrlId: null,
        softwareType: 'strudel',
        createdAt: '2023-01-01T00:00:00Z',
      }

      expect(() => Schema.decodeUnknownSync(ProjectSchema)(invalidProject)).toThrow()
    })

    it('should fail with invalid Date', () => {
      const invalidProject = {
        projectId: '123e4567-e89b-12d3-a456-426614174000',
        projectName: 'Test Project',
        userId: '123e4567-e89b-12d3-a456-426614174001',
        codeStart: null,
        codeEnd: null,
        codeFull: null,
        description: 'A test project',
        audioFilePath: null,
        audioFileType: null,
        audioData: null,
        youtubeUrlId: null,
        softwareType: 'strudel',
        createdAt: 'invalid-date', // should be valid ISO date string
      }

      expect(() => Schema.decodeUnknownSync(ProjectSchema)(invalidProject)).toThrow()
    })
  })

  describe('audioData field', () => {
    it('should accept any valid JSON as audioData', () => {
      const validJsonValues = [
        { duration: 120, sampleRate: 44100 },
        { metadata: { artist: 'Test Artist', title: 'Test Song' } },
        ['tag1', 'tag2', 'tag3'],
        'simple string',
        42,
        true,
        null,
      ]

      validJsonValues.forEach((audioData) => {
        const validProject = {
          projectId: '123e4567-e89b-12d3-a456-426614174000',
          projectName: 'Test Project',
          userId: '123e4567-e89b-12d3-a456-426614174001',
          codeStart: null,
          codeEnd: null,
          codeFull: null,
          description: 'A test project',
          audioFilePath: '/path/to/audio.wav',
          audioFileType: 'wav' as const,
          audioData,
          youtubeUrlId: null,
          softwareType: 'strudel' as const,
          createdAt: '2023-01-01T00:00:00Z',
        }

        const result = Schema.decodeUnknownSync(ProjectSchema)(validProject)
        expect(result.audioData).toEqual(audioData)
      })
    })
  })
})
