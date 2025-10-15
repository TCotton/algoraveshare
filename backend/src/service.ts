import * as T from "@effect/io/Effect"

export const helloEffect = T.succeed("Hello from Effect-TS")

export const runHello = T.flatMap(helloEffect, (msg) => T.succeed(msg))

export const run = (): Promise<string> => T.runPromise(runHello)
