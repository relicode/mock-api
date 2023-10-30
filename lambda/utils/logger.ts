import chalk, { ChalkInstance } from 'chalk'
import { isDevelopment } from './config.js'

type LogType = keyof typeof chalk & ('green' | 'yellow' | 'red')

const stringify = (arg: unknown): string | unknown => {
  switch (typeof arg) {
    case 'string':
      return arg
    case 'number':
      return String(arg)
    default:
      try {
        return JSON.stringify(arg, null, 2)
      } catch {
        if (typeof arg?.toString === 'function') {
          const stringified = arg.toString()
          if (typeof stringified === 'string') return stringified
        }
        return arg
      }
  }
}

const createDefaultPrefix = (() => {
  let counter = 0
  return () => ['logger', String(counter++).padStart(5, '0')].join('__')
})()

type Prefix = string

export type LoggerConfig =
  | Prefix
  | Partial<{
      prefix: string
      unique: boolean
    }>

type Logger = {
  chalk: ChalkInstance
  console: Console
  log: (...args: unknown[]) => void
  success: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
}
type DevOnlyLogger = Omit<Logger, 'chalk' | 'console'>

const prefixes = new Array<string>()

export function createLogger(config: LoggerConfig, devOnlyLogger: true): DevOnlyLogger
export function createLogger(config?: LoggerConfig, devOnlyLogger?: false): Logger
export function createLogger(config?: LoggerConfig, devOnlyLogger?: boolean) {
  const configBase = typeof config === 'object' ? config : { prefix: config, unique: true }
  const { prefix = createDefaultPrefix(), unique } = configBase
  if (unique) {
    if (prefixes.includes(prefix)) throw new Error(`Prefix '${prefix}' already exists.`)
    prefixes.push(prefix)
  }

  const log = (logType?: LogType, ...args: unknown[]) => {
    if (devOnlyLogger && !isDevelopment()) return
    console.log(`[${logType ? chalk.bold[logType](prefix) : chalk.bold(prefix)}]`, ...args.map(stringify)) // eslint-disable-line no-console
  }

  return {
    log: (...args: unknown[]) => log(undefined, ...args),
    success: (...args: unknown[]) => log('green', ...args),
    warn: (...args: unknown[]) => log('yellow', ...args),
    error: (...args: unknown[]) => log('red', ...args),
    ...(!devOnlyLogger && { chalk, console }),
  }
}

export default createLogger({ prefix: 'logger' }, true)
