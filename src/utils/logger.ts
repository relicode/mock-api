/* eslint-disable no-console */

import { faker } from '@faker-js/faker'
import chalk, { ChalkInstance } from 'chalk'
import { isDevelopment } from './config'

type LogType = keyof typeof chalk & ('green' | 'yellow' | 'red')

const stringify = <T = unknown>(arg: T): string | typeof arg => {
  if (typeof arg === 'string' || typeof arg === 'number') return String(arg)

  if (arg !== null && typeof arg === 'object') {
    try {
      return JSON.stringify(arg, null, 2)
    } catch {
      if (typeof arg.toString === 'function') {
        const stringified = arg.toString()
        if (typeof stringified === 'string') return stringified
      }
    }
  }
  return arg
}

const prefixes = new Array<string>()

const createRandomPrefix = (() => {
  let counter = 0
  return () => [faker.lorem.words(), String(counter++)].join('__')
})()

type LoggerConfig = Partial<{
  prefix: string
  unique: boolean
  devOnly: boolean
}>

type DevOnlyLoggerConfig = LoggerConfig & {
  devOnly: true
}

type Logger = {
  chalk: ChalkInstance
  console: Console
  log: (...args: unknown[]) => void
  success: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
}

type DevOnlyLogger = Omit<Logger, 'chalk' | 'console'>

export function createLogger(config: DevOnlyLoggerConfig): DevOnlyLogger
export function createLogger(config: LoggerConfig): Logger
export function createLogger(config: string | undefined): Logger
export function createLogger(config?: string | DevOnlyLoggerConfig | LoggerConfig): DevOnlyLogger | Logger {
  const isDevOnlyLogger = typeof config === 'object' && !!config.devOnly
  const prefix = (typeof config === 'object' ? config.prefix : config) || createRandomPrefix()
  const unique = typeof config === 'object' && !!config.unique

  if (unique && prefixes.includes(prefix)) throw new Error(`Prefix '${prefix}' already exists.`)

  const log = (logType?: LogType, ...args: unknown[]) => {
    if (isDevOnlyLogger && !isDevelopment()) return
    console.log(`[${logType ? chalk.bold[logType](prefix) : chalk.bold(prefix)}]`, ...args.map(stringify))
  }

  return {
    log: (...args: unknown[]) => log(undefined, ...args),
    success: (...args: unknown[]) => log('green', ...args),
    warn: (...args: unknown[]) => log('yellow', ...args),
    error: (...args: unknown[]) => log('red', ...args),
    ...(!isDevOnlyLogger && { chalk, console }),
  }
}

export default createLogger({ prefix: 'default', devOnly: true })
