import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from 'aws-lambda'
import _ from 'lodash'

import { createLogger, Service } from '.'

const logger = createLogger('api-gw-utils')

type ParsedAPIGatewayProxyResult = Omit<APIGatewayProxyResult, 'body'> & { body: string | Record<string, unknown> }

export const extractHeaders = (ev: APIGatewayProxyEvent, ...headerNames: Lowercase<string>[]) => {
  const headers = new Headers()
  const lowercaseHeaders = _.mapKeys(ev.headers, (_, key) => key.toLowerCase())

  for (const headerKey of headerNames) {
    const header = lowercaseHeaders[headerKey]
    if (!header) logger.warn(`Header ${logger.chalk.bold(headerKey)} not found`)
    else headers.set(headerKey, header)
  }
  return headers
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
  ..._.merge({ ...defaultResult }, rest),
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
