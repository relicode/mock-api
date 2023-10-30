import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventHeaders,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyResult,
} from 'aws-lambda'
import _ from 'lodash'

import { createLogger, Service } from './index.js'

const logger = createLogger('api-gw-utils')

type ParsedAPIGatewayProxyResult = Omit<APIGatewayProxyResult, 'body'> & { body: string | Record<string, unknown> }

type HeadersSource = { headers: APIGatewayProxyEventHeaders } | HeadersInit

/**
 *
 * Maps headers into a plain object representing headers with lowercase keys
 *
 * @param source APIGatewayProxyEvent | Record<string, string | undefined> | Headers
 *
 * @return Object with lowercase keys and potentially combined string values separated by ', '
 *
 * @example
 * ```ts
 *  // Returns { 'content-type': 'first one, second one' }
 *  normalizeHeaders({ 'Content-Type': 'first one', 'content-type': 'second one' })
 * ```
 */
export const normalizeHeaders = (source: HeadersSource): Record<Lowercase<string>, string> => {
  if ('headers' in source) return Object.fromEntries(new Headers(source.headers as Record<string, string>))
  return Object.fromEntries(
    new Headers('headers' in source ? (source.headers as unknown as Record<string, string>) : source),
  )
}

export const parseBody = <T extends Record<string, unknown>>(ev: APIGatewayProxyEvent): T => {
  try {
    return typeof ev.body === 'string' ? JSON.parse(ev.body) : {}
  } catch {
    const errorMessage = `Couldn't parse body of ${ev}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }
}

export const jsonHeaders = {
  'Content-Type': 'application/json',
} as const

const defaultResult: APIGatewayProxyResult = {
  body: '{}',
  statusCode: 200,
  headers: jsonHeaders,
  isBase64Encoded: false,
} as const

type ParseResult = (result?: Partial<ParsedAPIGatewayProxyResult>) => APIGatewayProxyResult
export const parseResult: ParseResult = ({ body, ...rest } = {}) => ({
  ...defaultResult,
  ...rest,
  ...(body && { body: JSON.stringify(body) }),
})

const servicePatterns: Array<[RegExp, Service]> = [
  [new RegExp('https://api.cinode.com'), Service.CINODE],
  [new RegExp('https://api.harvestapp.com/v2'), Service.HARVEST],
  [new RegExp('https://api.hibob.com/v1'), Service.HIBOB],
]

const resolveServiceLogger = createLogger('service-resolver')

type TrimmedProxyEvent = { pathParameters: APIGatewayProxyEventPathParameters | null }

export const resolveService = (ev: TrimmedProxyEvent): [Service, string] | void => {
  const url = new URL(ev.pathParameters?.proxy || '')
  const urlStr = url.toString()

  resolveServiceLogger.log(`Resolving service for url ${urlStr})`)
  for (const [pattern, serviceName] of servicePatterns) {
    if (pattern.test(urlStr)) {
      resolveServiceLogger.log(`Resolved service: ${serviceName} for url ${urlStr}`)
      return [serviceName, url.pathname]
    }
  }
  resolveServiceLogger.log(`Failed to resolve service for url ${url})`)
}
