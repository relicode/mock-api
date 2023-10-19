import chalk from 'chalk'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import _ from 'lodash'
import { createLogger } from './logger'
import { Service } from '.'

const logger = createLogger('api-gw-utils')

type ParsedAPIGatewayProxyResult = Omit<APIGatewayProxyResultV2, 'body'> & { body: string | Record<string, unknown> }

export const extractHeaders = (ev: APIGatewayProxyEventV2, ...headerNames: Lowercase<string>[]) => {
  const headers = new Headers()
  for (const headerKey of headerNames) {
    const header = ev.headers[headerKey]
    if (!header) logger.warn(`Header ${chalk.red(headerKey)} not found`)
    else headers.set(headerKey, header)
  }
  return headers
}

export const jsonHeaders = {
  'Content-Type': 'application/json',
} as const

const defaultResult: APIGatewayProxyResultV2 = {
  statusCode: 200,
  headers: jsonHeaders,
  isBase64Encoded: false,
} as const

export const parseBody = <T extends Record<string, unknown>>(ev: APIGatewayProxyEventV2): T => {
  try {
    return ev.body ? JSON.parse(ev.body) : {}
  } catch {
    const errorMessage = `Couldn't parse body of ${ev}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }
}

type ParseResult = (result?: Partial<ParsedAPIGatewayProxyResult>) => APIGatewayProxyResultV2
export const parseResult: ParseResult = ({ body, ...rest } = {}) => ({
  ..._.merge({ ...defaultResult }, rest),
  ...(body && { body: JSON.stringify(body) }),
})

const createServicePattern = (pattern: `^${string}`, service: Service): [RegExp, Service] => [
  new RegExp(pattern),
  service,
]

const servicePatterns = [
  createServicePattern('^/api.cinode.com/', Service.CINODE),
  createServicePattern('^/api.harvestapp.com/v2/', Service.HARVEST),
  createServicePattern('^/api.hibob.com/v1/', Service.HIBOB),
]

export const resolveService = (ev: APIGatewayProxyEventV2): [Service, string] | void => {
  const { pathname } = new URL(ev.requestContext.http.path, 'https://localhost/')
  for (const [pattern, service] of servicePatterns) {
    if (pattern.test(pathname)) return [service, pathname.replace(pattern, '')]
  }
}
