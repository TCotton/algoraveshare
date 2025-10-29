import * as it from '@effect/vitest'
import { Effect } from 'effect'
import { describe, expect } from 'vitest'
import * as CustomHttpApiError from '../src/common/CustomHttpApiError'

describe('CustomHttpApiError', () => {
  describe('4xx Client Errors', () => {
    it.effect('should create BadRequest error with message', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.BadRequest({ message: 'Invalid input' })
        expect(error._tag).toBe('BadRequest')
        expect(error.message).toBe('Invalid input')
      }))

    it.effect('should create BadRequest error without message', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.BadRequest({})
        expect(error._tag).toBe('BadRequest')
        expect(error.message).toBe('')
      }))

    it.effect('should create Unauthorized error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.Unauthorized({ message: 'Authentication required' })
        expect(error._tag).toBe('Unauthorized')
        expect(error.message).toBe('Authentication required')
      }))

    it.effect('should create PaymentRequired error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.PaymentRequired({ message: 'Payment needed' })
        expect(error._tag).toBe('PaymentRequired')
        expect(error.message).toBe('Payment needed')
      }))

    it.effect('should create Forbidden error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.Forbidden({ message: 'Access denied' })
        expect(error._tag).toBe('Forbidden')
        expect(error.message).toBe('Access denied')
      }))

    it.effect('should create NotFound error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.NotFound({ message: 'Resource not found' })
        expect(error._tag).toBe('NotFound')
        expect(error.message).toBe('Resource not found')
      }))

    it.effect('should create MethodNotAllowed error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.MethodNotAllowed({ message: 'Method not allowed' })
        expect(error._tag).toBe('MethodNotAllowed')
        expect(error.message).toBe('Method not allowed')
      }))

    it.effect('should create NotAcceptable error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.NotAcceptable({ message: 'Not acceptable' })
        expect(error._tag).toBe('NotAcceptable')
        expect(error.message).toBe('Not acceptable')
      }))

    it.effect('should create ProxyAuthenticationRequired error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.ProxyAuthenticationRequired({
          message: 'Proxy auth required'
        })
        expect(error._tag).toBe('ProxyAuthenticationRequired')
        expect(error.message).toBe('Proxy auth required')
      }))

    it.effect('should create RequestTimeout error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.RequestTimeout({ message: 'Request timed out' })
        expect(error._tag).toBe('RequestTimeout')
        expect(error.message).toBe('Request timed out')
      }))

    it.effect('should create Conflict error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.Conflict({ message: 'Resource conflict' })
        expect(error._tag).toBe('Conflict')
        expect(error.message).toBe('Resource conflict')
      }))

    it.effect('should create Gone error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.Gone({ message: 'Resource gone' })
        expect(error._tag).toBe('Gone')
        expect(error.message).toBe('Resource gone')
      }))

    it.effect('should create LengthRequired error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.LengthRequired({ message: 'Content length required' })
        expect(error._tag).toBe('LengthRequired')
        expect(error.message).toBe('Content length required')
      }))

    it.effect('should create PreconditionFailed error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.PreconditionFailed({ message: 'Precondition failed' })
        expect(error._tag).toBe('PreconditionFailed')
        expect(error.message).toBe('Precondition failed')
      }))

    it.effect('should create PayloadTooLarge error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.PayloadTooLarge({ message: 'Payload too large' })
        expect(error._tag).toBe('PayloadTooLarge')
        expect(error.message).toBe('Payload too large')
      }))

    it.effect('should create URITooLong error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.URITooLong({ message: 'URI too long' })
        expect(error._tag).toBe('URITooLong')
        expect(error.message).toBe('URI too long')
      }))

    it.effect('should create UnsupportedMediaType error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.UnsupportedMediaType({
          message: 'Unsupported media type'
        })
        expect(error._tag).toBe('UnsupportedMediaType')
        expect(error.message).toBe('Unsupported media type')
      }))

    it.effect('should create RangeNotSatisfiable error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.RangeNotSatisfiable({
          message: 'Range not satisfiable'
        })
        expect(error._tag).toBe('RangeNotSatisfiable')
        expect(error.message).toBe('Range not satisfiable')
      }))

    it.effect('should create ExpectationFailed error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.ExpectationFailed({ message: 'Expectation failed' })
        expect(error._tag).toBe('ExpectationFailed')
        expect(error.message).toBe('Expectation failed')
      }))

    it.effect('should create UnprocessableEntity error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.UnprocessableEntity({
          message: 'Unprocessable entity'
        })
        expect(error._tag).toBe('UnprocessableEntity')
        expect(error.message).toBe('Unprocessable entity')
      }))

    it.effect('should create TooEarly error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.TooEarly({ message: 'Too early' })
        expect(error._tag).toBe('TooEarly')
        expect(error.message).toBe('Too early')
      }))

    it.effect('should create TooManyRequests error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.TooManyRequests({ message: 'Too many requests' })
        expect(error._tag).toBe('TooManyRequests')
        expect(error.message).toBe('Too many requests')
      }))

    it.effect('should create RequestHeaderFieldsTooLarge error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.RequestHeaderFieldsTooLarge({
          message: 'Headers too large'
        })
        expect(error._tag).toBe('RequestHeaderFieldsTooLarge')
        expect(error.message).toBe('Headers too large')
      }))

    it.effect('should create UnavailableForLegalReasons error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.UnavailableForLegalReasons({
          message: 'Legal reasons'
        })
        expect(error._tag).toBe('UnavailableForLegalReasons')
        expect(error.message).toBe('Legal reasons')
      }))
  })

  describe('5xx Server Errors', () => {
    it.effect('should create InternalServerError', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.InternalServerError({
          message: 'Internal server error'
        })
        expect(error._tag).toBe('InternalServerError')
        expect(error.message).toBe('Internal server error')
      }))

    it.effect('should create NotImplemented error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.NotImplemented({ message: 'Not implemented' })
        expect(error._tag).toBe('NotImplemented')
        expect(error.message).toBe('Not implemented')
      }))

    it.effect('should create BadGateway error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.BadGateway({ message: 'Bad gateway' })
        expect(error._tag).toBe('BadGateway')
        expect(error.message).toBe('Bad gateway')
      }))

    it.effect('should create ServiceUnavailable error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.ServiceUnavailable({
          message: 'Service unavailable'
        })
        expect(error._tag).toBe('ServiceUnavailable')
        expect(error.message).toBe('Service unavailable')
      }))

    it.effect('should create GatewayTimeout error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.GatewayTimeout({ message: 'Gateway timeout' })
        expect(error._tag).toBe('GatewayTimeout')
        expect(error.message).toBe('Gateway timeout')
      }))

    it.effect('should create HTTPVersionNotSupported error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.HTTPVersionNotSupported({
          message: 'HTTP version not supported'
        })
        expect(error._tag).toBe('HTTPVersionNotSupported')
        expect(error.message).toBe('HTTP version not supported')
      }))
  })

  describe('Error instances', () => {
    it.effect('should be instance of Error', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.BadRequest({ message: 'Test' })
        expect(error).toBeInstanceOf(Error)
      }))

    it.effect('should have correct tag for pattern matching', () =>
      Effect.sync(() => {
        const error = new CustomHttpApiError.NotFound({ message: 'Not found' })
        expect(error._tag).toBe('NotFound')
      }))

    it.effect('should handle optional message correctly', () =>
      Effect.sync(() => {
        const errorWithMessage = new CustomHttpApiError.BadRequest({ message: 'Has message' })
        const errorWithoutMessage = new CustomHttpApiError.BadRequest({})

        expect(errorWithMessage.message).toBe('Has message')
        expect(errorWithoutMessage.message).toBe('')
      }))
  })

  describe('Effect integration', () => {
    it.effect('should work with Effect.fail', () =>
      Effect.gen(function*() {
        const program = Effect.fail(new CustomHttpApiError.BadRequest({ message: 'Test error' }))
        const result = yield* Effect.either(program)

        expect(result._tag).toBe('Left')
        if (result._tag === 'Left') {
          expect(result.left._tag).toBe('BadRequest')
          expect(result.left.message).toBe('Test error')
        }
      }))

    it.effect('should be catchable with Effect.catchTag', () =>
      Effect.gen(function*() {
        const program = Effect.fail(new CustomHttpApiError.NotFound({ message: 'Not found' }))
        const recovered = program.pipe(
          Effect.catchTag('NotFound', () => Effect.succeed('Recovered from NotFound'))
        )

        const result = yield* recovered
        expect(result).toBe('Recovered from NotFound')
      }))

    it.effect('should work with Effect.catchTags for multiple error types', () =>
      Effect.gen(function*() {
        const failWithBadRequest = Effect.fail(
          new CustomHttpApiError.BadRequest({ message: 'Bad request' })
        )
        const recovered = failWithBadRequest.pipe(
          Effect.catchTag('BadRequest', () => Effect.succeed('Recovered from BadRequest'))
        )

        const result = yield* recovered
        expect(result).toBe('Recovered from BadRequest')
      }))

    it.effect('should preserve error through Effect operations', () =>
      Effect.gen(function*() {
        const program = Effect.gen(function*() {
          yield* Effect.succeed(1)
          yield* Effect.fail(
            new CustomHttpApiError.InternalServerError({ message: 'Server error' })
          )
          return yield* Effect.succeed(2)
        })

        const result = yield* Effect.either(program)
        expect(result._tag).toBe('Left')
        if (result._tag === 'Left') {
          expect(result.left._tag).toBe('InternalServerError')
          expect(result.left.message).toBe('Server error')
        }
      }))
  })
})
