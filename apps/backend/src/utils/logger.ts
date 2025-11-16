import type { Level } from 'pino'
import pino from 'pino'

export type { Level }

type CreateLoggerArgs = {
  level: Level
  isDev: boolean
}

export const createLogger = ({ isDev, level }: CreateLoggerArgs) =>
  pino({
    level,
    redact: ['req.headers.authorization'],
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() }
      }
    },
    ...(isDev && { transport: { target: 'pino-pretty' } })
  })
