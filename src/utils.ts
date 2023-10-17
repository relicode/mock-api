/* eslint-disable no-process-env */
/* eslint-disable no-console */

import { faker } from '@faker-js/faker'
import chalk from 'chalk'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { MockData } from './generate-mock-data'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import _ from 'lodash'

import * as url from 'url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const dataPath = process.env.DATA_PATH || resolve(__dirname, './data.json')

type LogType = keyof typeof chalk & ('green' | 'yellow' | 'red')

const mapArg = (arg: unknown) => {
  if (typeof arg === 'string') return arg
  if (typeof arg === 'number') return JSON.stringify(arg)
  try {
    JSON.stringify(arg, null, 2)
  } catch {
    if (arg !== null && typeof arg === 'object' && typeof arg.toString === 'function') {
      const afterToString = arg.toString()
      if (typeof afterToString === 'string') return afterToString
      throw new Error('toString returns something other than string')
    }
  }
}

export const createLogger = (prefix = faker.lorem.words()) => {
  const log = (logType?: LogType, ...args: unknown[]) => {
    console.log(`[${logType ? chalk.bold[logType](prefix) : chalk.bold(prefix)}]`, ...args.map(mapArg))
  }

  return {
    chalk,
    console,
    table: console.table,
    log: (...args: unknown[]) => log(undefined, ...args),
    success: (...args: unknown[]) => log('green', ...args),
    warn: (...args: unknown[]) => log('yellow', ...args),
    error: (...args: unknown[]) => log('red', ...args),
  }
}

const logger = createLogger('utils')

export const loadJsonData = async <T extends Record<string, unknown> = MockData>(): Promise<T> => {
  try {
    return JSON.parse(await readFile(dataPath, 'utf8'))
  } catch (e) {
    logger.error(`Can't access or parse ${logger.chalk.red(dataPath)}`, e)
    process.exit(1)
  }
}

type ParsedAPIGatewayProxyResult = Omit<APIGatewayProxyResult, 'body'> & { body: Record<string, unknown> }

const jsonResultHeaders = {
  'Content-Type': 'application/json',
} as const

const defaultResult: ParsedAPIGatewayProxyResult = {
  statusCode: 200,
  headers: { ...jsonResultHeaders },
  body: {},
  isBase64Encoded: false,
} as const

export const parseBody = <T extends Record<string, unknown> = Record<string, unknown>>(ev: APIGatewayProxyEvent): T =>
  ev.body ? JSON.parse(ev.body) : {}

type ParseResult = (result?: Partial<ParsedAPIGatewayProxyResult>) => APIGatewayProxyResult

export const parseResult: ParseResult = ({ body, ...rest } = defaultResult) => ({
  ..._.merge({ ...defaultResult }, rest),
  body: JSON.stringify(body || defaultResult.body),
})

type Service = 'cinode' | 'harvest' | 'hibob'

const baseUrlServiceMapping: Record<string, Service> = {
  'https://api.cinode.com': 'cinode',
  'https://api.harvestapp.com/v2/': 'harvest',
  'https://api.hibob.com/v1/': 'hibob',
} as const

export const resolveService = (baseUrl: string) => {
  const fromMapping = baseUrlServiceMapping[baseUrl]
  if (!fromMapping) throw new Error(`Unknown service for ${baseUrl}`)
  return fromMapping
}

export const extractHeaders = (event: APIGatewayProxyEvent, ...headers: string[]) => {
  const extractedHeaders = new Headers()
  for (const headerKey of headers) {
    const header = event.headers[headerKey]
    if (!header) {
      const errorMessage = `Header ${chalk.red(headerKey)} not found`
      logger.error(errorMessage)
    } else extractedHeaders.set(headerKey, header)
  }
  return { headers: extractedHeaders }
}

const config = (() => ({
  __dirname,
  __filename,
  useAuth: !process.env.NO_AUTH,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
}))()

export default config
