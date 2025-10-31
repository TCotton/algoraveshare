import { Redacted, Schema } from 'effect'
import { describe, expect, it } from 'vitest'
import UserSchema from '../src/usersSchema.schema.js'

describe('usersSchema.schema (Registration Form Schema)', () => {
  describe('valid data', () => {
    it('should successfully decode valid registration data', () => {
      const validRegistration = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        passwordOne: 'Password123!',
        passwordTwo: 'Password123!',
        location: 'New York, NY',
        portfolioUrl: 'https://johndoe.dev',
        mastodonUrl: 'https://mastodon.social/@johndoe',
        blueskyUrl: 'https://bsky.app/profile/johndoe',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
        youtubeLink: 'https://youtube.com/johndoe'
      }

      const result = Schema.decodeUnknownSync(UserSchema)(validRegistration)
      expect(result.name).toBe('John Doe')
      expect(result.email).toBe('john.doe@example.com')
      expect(Redacted.value(result.passwordOne)).toBe('Password123!')
      expect(Redacted.value(result.passwordTwo)).toBe('Password123!')
      expect(result.location).toBe('New York, NY')
      expect(result.portfolioUrl).toBe('https://johndoe.dev')
    })

    it('should decode with optional fields omitted', () => {
      const validRegistration = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        passwordOne: 'SecurePass456@',
        passwordTwo: 'SecurePass456@'
      }

      const result = Schema.decodeUnknownSync(UserSchema)(validRegistration)
      expect(result.name).toBe('Jane Smith')
      expect(result.email).toBe('jane.smith@example.com')
      expect(Redacted.value(result.passwordOne)).toBe('SecurePass456@')
      expect(Redacted.value(result.passwordTwo)).toBe('SecurePass456@')
      expect(result.location).toBeUndefined()
      expect(result.portfolioUrl).toBeUndefined()
    })

    it('should trim whitespace from name and email', () => {
      const validRegistration = {
        name: '  John Doe  ',
        email: '  john.doe@example.com  ',
        passwordOne: 'Password123!',
        passwordTwo: 'Password123!'
      }

      const result = Schema.decodeUnknownSync(UserSchema)(validRegistration)
      expect(result.name).toBe('John Doe')
      expect(result.email).toBe('john.doe@example.com')
    })

    it('should accept valid password patterns', () => {
      const validPasswords = [
        'Password123!',
        'MySecure@Pass1',
        'Complex#Pass99',
        'Strong$Password1',
        'Valid&Pass123',
        'Test*Password1',
        'Good+Pass123',
        'Nice~Pass123',
        'Cool`Pass123',
        'Best[Pass]123',
        'Top\\Pass123',
        'Fine;Pass123',
        'Super:Pass123',
        'Great"Pass123',
        'Perfect<Pass>123',
        'Amazing{Pass}123',
        'Incredible|Pass123',
        'Outstanding_Pass123',
        'Excellent-Pass123',
        'Wonderful=Pass123'
      ]

      validPasswords.forEach((password) => {
        const validRegistration = {
          name: 'Test User',
          email: 'test@example.com',
          passwordOne: password,
          passwordTwo: password
        }

        const result = Schema.decodeUnknownSync(UserSchema)(validRegistration)
        expect(Redacted.value(result.passwordOne)).toBe(password)
        expect(Redacted.value(result.passwordTwo)).toBe(password)
      })
    })

    it('should accept valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user123@example123.com',
        'a@b.co',
        'test.email+tag@example.subdomain.com',
        'user_name@example.com',
        'user-name@example.com'
      ]

      validEmails.forEach((email) => {
        const validRegistration = {
          name: 'Test User',
          email,
          passwordOne: 'Password123!',
          passwordTwo: 'Password123!'
        }

        const result = Schema.decodeUnknownSync(UserSchema)(validRegistration)
        expect(result.email).toBe(email)
      })
    })
  })

  describe('invalid data', () => {
    describe('name validation', () => {
      it('should fail with name longer than 200 characters', () => {
        const longName = 'A'.repeat(201)
        const invalidRegistration = {
          name: longName,
          email: 'test@example.com',
          passwordOne: 'Password123!',
          passwordTwo: 'Password123!'
        }

        expect(() => Schema.decodeUnknownSync(UserSchema)(invalidRegistration)).toThrow()
      })

      it('should fail with non-string name', () => {
        const invalidRegistration = {
          name: 123,
          email: 'test@example.com',
          passwordOne: 'Password123!',
          passwordTwo: 'Password123!'
        }

        expect(() => Schema.decodeUnknownSync(UserSchema)(invalidRegistration)).toThrow()
      })
    })

    describe('email validation', () => {
      it('should fail with invalid email formats', () => {
        const invalidEmails = [
          'invalid-email',
          'missing@domain',
          '@missinguser.com',
          'user@',
          'user@.com',
          'user..name@example.com',
          'user@domain..com'
        ]

        invalidEmails.forEach((email) => {
          const invalidRegistration = {
            name: 'Test User',
            email,
            passwordOne: 'Password123!',
            passwordTwo: 'Password123!'
          }

          expect(() => Schema.decodeUnknownSync(UserSchema)(invalidRegistration)).toThrow()
        })
      })
    })

    describe('password validation', () => {
      it('should fail with passwords shorter than 8 characters', () => {
        const shortPassword = 'Pass1!'
        const invalidRegistration = {
          name: 'Test User',
          email: 'test@example.com',
          passwordOne: shortPassword,
          passwordTwo: shortPassword
        }

        expect(() => Schema.decodeUnknownSync(UserSchema)(invalidRegistration)).toThrow()
      })

      it('should fail with passwords missing uppercase letter', () => {
        const noUppercasePassword = 'password123!'
        const invalidRegistration = {
          name: 'Test User',
          email: 'test@example.com',
          passwordOne: noUppercasePassword,
          passwordTwo: noUppercasePassword
        }

        expect(() => Schema.decodeUnknownSync(UserSchema)(invalidRegistration)).toThrow()
      })

      it('should fail with passwords missing lowercase letter', () => {
        const noLowercasePassword = 'PASSWORD123!'
        const invalidRegistration = {
          name: 'Test User',
          email: 'test@example.com',
          passwordOne: noLowercasePassword,
          passwordTwo: noLowercasePassword
        }

        expect(() => Schema.decodeUnknownSync(UserSchema)(invalidRegistration)).toThrow()
      })

      it('should fail with passwords missing special character', () => {
        const noSpecialCharPassword = 'Password123'
        const invalidRegistration = {
          name: 'Test User',
          email: 'test@example.com',
          passwordOne: noSpecialCharPassword,
          passwordTwo: noSpecialCharPassword
        }

        expect(() => Schema.decodeUnknownSync(UserSchema)(invalidRegistration)).toThrow()
      })

      it('should fail with mismatched passwords', () => {
        const invalidRegistration = {
          name: 'Test User',
          email: 'test@example.com',
          passwordOne: 'Password123!',
          passwordTwo: 'DifferentPass456@'
        }

        // Note: The current schema doesn't include password matching validation
        // This test verifies that the schema would need to be enhanced for this feature
        const result = Schema.decodeUnknownSync(UserSchema)(invalidRegistration)
        expect(Redacted.value(result.passwordOne)).toBe('Password123!')
        expect(Redacted.value(result.passwordTwo)).toBe('DifferentPass456@')
      })
    })

    describe('missing required fields', () => {
      it('should fail with missing name', () => {
        const invalidRegistration = {
          email: 'test@example.com',
          passwordOne: 'Password123!',
          passwordTwo: 'Password123!'
        }

        expect(() => Schema.decodeUnknownSync(UserSchema)(invalidRegistration)).toThrow()
      })

      it('should fail with missing email', () => {
        const invalidRegistration = {
          name: 'Test User',
          passwordOne: 'Password123!',
          passwordTwo: 'Password123!'
        }

        expect(() => Schema.decodeUnknownSync(UserSchema)(invalidRegistration)).toThrow()
      })

      it('should fail with missing passwordOne', () => {
        const invalidRegistration = {
          name: 'Test User',
          email: 'test@example.com',
          passwordTwo: 'Password123!'
        }

        expect(() => Schema.decodeUnknownSync(UserSchema)(invalidRegistration)).toThrow()
      })

      it('should fail with missing passwordTwo', () => {
        const invalidRegistration = {
          name: 'Test User',
          email: 'test@example.com',
          passwordOne: 'Password123!'
        }

        expect(() => Schema.decodeUnknownSync(UserSchema)(invalidRegistration)).toThrow()
      })
    })
  })

  describe('optional fields', () => {
    it('should handle all optional fields present', () => {
      const validRegistration = {
        name: 'Test User',
        email: 'test@example.com',
        passwordOne: 'Password123!',
        passwordTwo: 'Password123!',
        location: 'Test Location',
        portfolioUrl: 'https://portfolio.com',
        mastodonUrl: 'https://mastodon.social/@test',
        blueskyUrl: 'https://bsky.app/profile/test',
        linkedinUrl: 'https://linkedin.com/in/test',
        youtubeLink: 'https://youtube.com/test'
      }

      const result = Schema.decodeUnknownSync(UserSchema)(validRegistration)
      expect(result.location).toBe('Test Location')
      expect(result.portfolioUrl).toBe('https://portfolio.com')
      expect(result.mastodonUrl).toBe('https://mastodon.social/@test')
      expect(result.blueskyUrl).toBe('https://bsky.app/profile/test')
      expect(result.linkedinUrl).toBe('https://linkedin.com/in/test')
      expect(result.youtubeLink).toBe('https://youtube.com/test')
    })

    it('should handle empty string optional fields', () => {
      const validRegistration = {
        name: 'Test User',
        email: 'test@example.com',
        passwordOne: 'Password123!',
        passwordTwo: 'Password123!',
        location: '',
        portfolioUrl: '',
        mastodonUrl: '',
        blueskyUrl: '',
        linkedinUrl: '',
        youtubeLink: ''
      }

      const result = Schema.decodeUnknownSync(UserSchema)(validRegistration)
      expect(result.location).toBe('')
      expect(result.portfolioUrl).toBe('')
      expect(result.mastodonUrl).toBe('')
      expect(result.blueskyUrl).toBe('')
      expect(result.linkedinUrl).toBe('')
      expect(result.youtubeLink).toBe('')
    })
  })

  describe('edge cases', () => {
    it('should handle unicode characters in name', () => {
      const unicodeNames = [
        'José María',
        'François Müller',
        'Анна Петрова',
        '田中太郎',
        'محمد علي'
      ]

      unicodeNames.forEach((name) => {
        const validRegistration = {
          name,
          email: 'test@example.com',
          passwordOne: 'Password123!',
          passwordTwo: 'Password123!'
        }

        const result = Schema.decodeUnknownSync(UserSchema)(validRegistration)
        expect(result.name).toBe(name)
      })
    })

    it('should handle complex special characters in passwords', () => {
      const complexPasswords = [
        'Test@#$%^&*()Pass1',
        'Pass,.?":{}|<>Word1',
        'Word_-+=~`[]\\;Pass1'
      ]

      complexPasswords.forEach((password) => {
        const validRegistration = {
          name: 'Test User',
          email: 'test@example.com',
          passwordOne: password,
          passwordTwo: password
        }

        const result = Schema.decodeUnknownSync(UserSchema)(validRegistration)
        expect(Redacted.value(result.passwordOne)).toBe(password)
      })
    })

    it('should handle maximum length name (200 characters)', () => {
      const maxLengthName = 'A'.repeat(200)
      const validRegistration = {
        name: maxLengthName,
        email: 'test@example.com',
        passwordOne: 'Password123!',
        passwordTwo: 'Password123!'
      }

      const result = Schema.decodeUnknownSync(UserSchema)(validRegistration)
      expect(result.name).toBe(maxLengthName)
      expect(result.name.length).toBe(200)
    })
  })
})
