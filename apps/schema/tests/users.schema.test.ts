import { describe, expect, it } from 'vitest'
import { Schema } from 'effect'
import { UserSchema } from '../src/users.schema.js'

describe('UserSchema', () => {
  describe('valid data', () => {
    it('should successfully decode valid user data', () => {
      const validUser = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        email: 'john.doe@example.com',
        passwordHash: 'hashed_password_string',
        location: 'New York, NY',
        createdAt: '2023-01-01T00:00:00Z',
        portfolioUrl: 'https://johndoe.dev',
        youtubeUrl: 'https://youtube.com/johndoe',
        mastodonUrl: 'https://mastodon.social/@johndoe',
        blueskyUrl: 'https://bsky.app/profile/johndoe',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
      }

      const result = Schema.decodeUnknownSync(UserSchema)(validUser)
      expect(result).toEqual({
        ...validUser,
        createdAt: new Date('2023-01-01T00:00:00Z'),
      })
    })

    it('should decode with null optional fields', () => {
      const validUser = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        email: 'john.doe@example.com',
        passwordHash: 'hashed_password_string',
        location: null,
        createdAt: '2023-01-01T00:00:00Z',
        portfolioUrl: null,
        youtubeUrl: null,
        mastodonUrl: null,
        blueskyUrl: null,
        linkedinUrl: null,
      }

      const result = Schema.decodeUnknownSync(UserSchema)(validUser)
      expect(result).toEqual({
        ...validUser,
        createdAt: new Date('2023-01-01T00:00:00Z'),
      })
    })

    it('should decode with valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user123@example123.com',
        'a@b.co',
        'test.email+tag@example.subdomain.com',
      ]

      validEmails.forEach((email) => {
        const validUser = {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test User',
          email,
          passwordHash: 'hashed_password_string',
          location: null,
          createdAt: '2023-01-01T00:00:00Z',
          portfolioUrl: null,
          youtubeUrl: null,
          mastodonUrl: null,
          blueskyUrl: null,
          linkedinUrl: null,
        }

        const result = Schema.decodeUnknownSync(UserSchema)(validUser)
        expect(result.email).toBe(email)
      })
    })
  })

  describe('invalid data', () => {
    it('should fail with invalid UUID for userId', () => {
      const invalidUser = {
        userId: 'invalid-uuid',
        name: 'John Doe',
        email: 'john.doe@example.com',
        passwordHash: 'hashed_password_string',
        location: null,
        createdAt: '2023-01-01T00:00:00Z',
        portfolioUrl: null,
        youtubeUrl: null,
        mastodonUrl: null,
        blueskyUrl: null,
        linkedinUrl: null,
      }

      expect(() => Schema.decodeUnknownSync(UserSchema)(invalidUser)).toThrow()
    })

    it('should fail with non-string name', () => {
      const invalidUser = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        name: 123, // should be string
        email: 'john.doe@example.com',
        passwordHash: 'hashed_password_string',
        location: null,
        createdAt: '2023-01-01T00:00:00Z',
        portfolioUrl: null,
        youtubeUrl: null,
        mastodonUrl: null,
        blueskyUrl: null,
        linkedinUrl: null,
      }

      expect(() => Schema.decodeUnknownSync(UserSchema)(invalidUser)).toThrow()
    })

    it('should fail with non-string email', () => {
      const invalidUser = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        email: 123, // should be string
        passwordHash: 'hashed_password_string',
        location: null,
        createdAt: '2023-01-01T00:00:00Z',
        portfolioUrl: null,
        youtubeUrl: null,
        mastodonUrl: null,
        blueskyUrl: null,
        linkedinUrl: null,
      }

      expect(() => Schema.decodeUnknownSync(UserSchema)(invalidUser)).toThrow()
    })

    it('should fail with invalid Date for createdAt', () => {
      const invalidUser = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        email: 'john.doe@example.com',
        passwordHash: 'hashed_password_string',
        location: null,
        createdAt: 'invalid-date', // should be Date
        portfolioUrl: null,
        youtubeUrl: null,
        mastodonUrl: null,
        blueskyUrl: null,
        linkedinUrl: null,
      }

      expect(() => Schema.decodeUnknownSync(UserSchema)(invalidUser)).toThrow()
    })

    it('should fail with missing required fields', () => {
      const incompleteUser = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        // missing required fields
      }

      expect(() => Schema.decodeUnknownSync(UserSchema)(incompleteUser)).toThrow()
    })
  })

  describe('optional fields', () => {
    it('should handle various location values', () => {
      const locations = [
        'New York, NY',
        'London, UK',
        'Tokyo, Japan',
        'Remote',
        'Traveling',
        null,
      ]

      locations.forEach((location) => {
        const validUser = {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: 'hashed_password_string',
          location,
          createdAt: '2023-01-01T00:00:00Z',
          portfolioUrl: null,
          youtubeUrl: null,
          mastodonUrl: null,
          blueskyUrl: null,
          linkedinUrl: null,
        }

        const result = Schema.decodeUnknownSync(UserSchema)(validUser)
        expect(result.location).toBe(location)
      })
    })

    it('should handle various URL formats', () => {
      const urls = [
        'https://example.com',
        'http://example.com',
        'https://subdomain.example.com/path',
        'https://example.com/user/profile?id=123',
        null,
      ]

      const urlFields = ['portfolioUrl', 'youtubeUrl', 'mastodonUrl', 'blueskyUrl', 'linkedinUrl'] as const

      urlFields.forEach((field) => {
        urls.forEach((url) => {
          const validUser = {
            userId: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Test User',
            email: 'test@example.com',
            passwordHash: 'hashed_password_string',
            location: null,
            createdAt: '2023-01-01T00:00:00Z',
            portfolioUrl: null,
            youtubeUrl: null,
            mastodonUrl: null,
            blueskyUrl: null,
            linkedinUrl: null,
            [field]: url,
          }

          const result = Schema.decodeUnknownSync(UserSchema)(validUser)
          expect(result[field]).toBe(url)
        })
      })
    })
  })

  describe('edge cases', () => {
    it('should handle very long names', () => {
      const longName = 'A'.repeat(1000)
      const validUser = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        name: longName,
        email: 'test@example.com',
        passwordHash: 'hashed_password_string',
        location: null,
        createdAt: '2023-01-01T00:00:00Z',
        portfolioUrl: null,
        youtubeUrl: null,
        mastodonUrl: null,
        blueskyUrl: null,
        linkedinUrl: null,
      }

      const result = Schema.decodeUnknownSync(UserSchema)(validUser)
      expect(result.name).toBe(longName)
    })

    it('should handle unicode characters in names', () => {
      const unicodeNames = [
        'José María',
        'François Müller',
        'Анна Петрова',
        '田中太郎',
        'محمد علي',
        'Παναγιώτης',
      ]

      unicodeNames.forEach((name) => {
        const validUser = {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          name,
          email: 'test@example.com',
          passwordHash: 'hashed_password_string',
          location: null,
          createdAt: '2023-01-01T00:00:00Z',
          portfolioUrl: null,
          youtubeUrl: null,
          mastodonUrl: null,
          blueskyUrl: null,
          linkedinUrl: null,
        }

        const result = Schema.decodeUnknownSync(UserSchema)(validUser)
        expect(result.name).toBe(name)
      })
    })

    it('should handle very long password hashes', () => {
      const longHash = 'a'.repeat(1000)
      const validUser = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: longHash,
        location: null,
        createdAt: '2023-01-01T00:00:00Z',
        portfolioUrl: null,
        youtubeUrl: null,
        mastodonUrl: null,
        blueskyUrl: null,
        linkedinUrl: null,
      }

      const result = Schema.decodeUnknownSync(UserSchema)(validUser)
      expect(result.passwordHash).toBe(longHash)
    })

    it('should handle empty string for optional fields', () => {
      const validUser = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashed_password_string',
        location: '',
        createdAt: '2023-01-01T00:00:00Z',
        portfolioUrl: '',
        youtubeUrl: '',
        mastodonUrl: '',
        blueskyUrl: '',
        linkedinUrl: '',
      }

      const result = Schema.decodeUnknownSync(UserSchema)(validUser)
      expect(result.location).toBe('')
      expect(result.portfolioUrl).toBe('')
      expect(result.youtubeUrl).toBe('')
      expect(result.mastodonUrl).toBe('')
      expect(result.blueskyUrl).toBe('')
      expect(result.linkedinUrl).toBe('')
    })
  })
})
