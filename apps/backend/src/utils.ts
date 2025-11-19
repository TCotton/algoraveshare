type FixedLengthArray<T, N extends number> = N extends N ? number extends N ? Array<T> : _FixedLengthArray<T, N, []>
  : never

type _FixedLengthArray<T, N extends number, R extends Array<unknown>> = R['length'] extends N ? R
  : _FixedLengthArray<T, N, [T, ...R]>

type Array16<T> = FixedLengthArray<T, 16>

export type Hash256Bytes = Array16<number>

export type Prettify<T> =
  & {
    [K in keyof T]: T[K]
  }
  & {}

export type PrettifyPromise<T> =
  & {
    [K in keyof T]: T[K] extends Promise<infer U> ? U : T[K]
  }
  & {}
