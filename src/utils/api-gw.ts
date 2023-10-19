import chalk from 'chalk'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import _ from 'lodash'
import { createLogger } from './logger'
import { Service } from '.'

const logger = createLogger('api-gw-utils')

type ParsedAPIGatewayProxyResult = Omit<APIGatewayProxyResultV2, 'body'> & { body: string | Record<string, unknown> }

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
    logger.log(ev.body)
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

const servicePaths: Readonly<Readonly<[pathStart: string, service: Service]>[]> = [
  ['/api.cinode.com/', Service.CINODE],
  ['/api.harvestapp.com/v2/', Service.HARVEST],
  ['/api.hibob.com/v1/', Service.HIBOB],
] as const

export const resolveService = (ev: APIGatewayProxyEventV2): [Service, string] => {
  const { pathname } = new URL(ev.requestContext.http.path, 'https://localhost/')

  for (const [pathStub, service] of servicePaths) {
    if (pathname.startsWith(pathStub)) return [service, pathname.slice(pathStub.length)]
  }
  const errorMessage = `Unknown service for ${pathname}`
  logger.error(errorMessage)
  throw new Error(errorMessage)
}

export const extractHeaders = (ev: APIGatewayProxyEventV2, ...headerNames: Lowercase<string>[]) => {
  const headers = new Headers()
  for (const headerKey of headerNames) {
    const header = ev.headers[headerKey]
    if (!header) logger.warn(`Header ${chalk.red(headerKey)} not found`)
    else headers.set(headerKey, header)
  }
  return { headers }
}
