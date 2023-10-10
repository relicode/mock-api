/* eslint-disable no-process-env */
/* eslint-disable no-console */

import { faker } from '@faker-js/faker'
import chalk from 'chalk'

type LogType = keyof typeof chalk & ('green' | 'yellow' | 'red')

export const createLogger = (prefix = faker.lorem.words()) => {
  const log = (logType?: LogType, ...args: unknown[]) => {
    console.log(`[${logType ? chalk.bold[logType](prefix) : chalk.bold(prefix)}]`, ...args)
  }
  return {
    console: (...args: unknown[]) => console.log(...args),
    table: (tableObject: unknown) => console.table(tableObject),
    log: (...args: unknown[]) => log(undefined, ...args),
    success: (...args: unknown[]) => log('green', ...args),
    warn: (...args: unknown[]) => log('yellow', ...args),
    error: (...args: unknown[]) => log('red', ...args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a)))),
  }
}

const defaultPort = 54321

export const getConfig = () => {
  const { DATA_PATH, NO_AUTH, PORT } = process.env

  let port: number
  try {
    port = PORT ? parseInt(PORT, 10) : defaultPort
  } catch {
    port = defaultPort
  }

  return {
    dataPath: DATA_PATH,
    useAuth: !NO_AUTH,
    port,
  }
}
