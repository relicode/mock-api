import { APIGatewayProxyEvent, APIGatewayProxyEventHeaders, APIGatewayProxyResult } from 'aws-lambda'

import { StatusCode } from 'status-code-enum'

import { ContentTypes, createLogger, HeadersNames, Service } from './index.js'
import { Jsonifiable } from 'type-fest'

const logger = createLogger('api-gw-utils')

export type ParsedAPIGatewayProxyResult = Omit<APIGatewayProxyResult, 'body'> & {
  body: Jsonifiable
}

type HeadersSource = Headers | { headers: APIGatewayProxyEventHeaders } | Record<string, string>

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
export const normalizeHeaders = (source: HeadersSource): Record<Lowercase<string>, string | undefined> => {
  if ('headers' in source) return Object.fromEntries(new Headers(source.headers as Record<string, string>))
  return Object.fromEntries(
    new Headers('headers' in source ? (source.headers as unknown as Record<string, string>) : source),
  )
}

// const getHeaderLogger = createLogger('getHeader')
export const getHeader = (source: HeadersSource, headerName: string) => {
  const headers = normalizeHeaders(source)
  const lowercasedHeaderName = headerName.toLowerCase() as Lowercase<string>
  const value = headers[lowercasedHeaderName]
  // getHeaderLogger.log(`Couldn't find header '${lowercasedHeaderName}' in ${JSON.stringify(headers)}`)
  return value
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

const defaultResult: APIGatewayProxyResult = {
  body: '{}',
  statusCode: StatusCode.SuccessOK,
  headers: { [HeadersNames.CONTENT_TYPE]: ContentTypes.JSON },
  isBase64Encoded: false,
} as const

const parseResult = ({ body, headers, ...rest }: Partial<ParsedAPIGatewayProxyResult> = {}): APIGatewayProxyResult => ({
  ...defaultResult,
  ...rest,
  headers: {
    ...defaultResult.headers,
    ...headers,
  },
  ...(body && { body: JSON.stringify(body) }),
})
parseResult.ok = (body?: Jsonifiable) => parseResult({ body })
parseResult.notImplemented = parseResult({
  statusCode: StatusCode.ServerErrorNotImplemented,
  body: { errorMessage: 'Not implemented', statusCode: StatusCode.ServerErrorNotImplemented },
})

export { parseResult }

const servicePatterns: Array<[RegExp, Service]> = [
  [new RegExp('https://api.cinode.com'), Service.CINODE],
  [new RegExp('https://api.harvestapp.com/v2'), Service.HARVEST],
  [new RegExp('https://api.hibob.com/v1'), Service.HIBOB],
]

const resolveServiceAndPathLogger = createLogger('service-resolver')

type EvWithPathParams = Pick<APIGatewayProxyEvent, 'pathParameters'>
export type ResolveServiceAndPath = (ev: EvWithPathParams) => [service: Service, path: `/${string}`] | undefined
export type ServiceAndPath = NonNullable<ReturnType<ResolveServiceAndPath>>

export const resolveServiceAndPath: ResolveServiceAndPath = (ev) => {
  const url = new URL(ev.pathParameters?.proxy || '')
  const urlStr = url.toString()

  resolveServiceAndPathLogger.log(`Resolving service for url ${urlStr})`)
  for (const [pattern, serviceName] of servicePatterns) {
    if (pattern.test(urlStr)) {
      resolveServiceAndPathLogger.log(`Resolved service: ${serviceName} for url ${urlStr}`)
      return [serviceName, url.pathname as `/${string}`]
    }
  }
  resolveServiceAndPathLogger.log(`Failed to resolve service for url ${url})`)
  return undefined
}
