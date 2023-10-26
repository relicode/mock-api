import { extractHeaders, resolveService, mockCredentials, createLogger } from '.'
import { APIGatewayProxyEvent } from 'aws-lambda'

const AUTH = 'authorization' as const
const STATUS_OK = 200 as const
const STATUS_UNAUTHORIZED = 401 as const

const hiBobMockHeader = Buffer.from(
  `${mockCredentials.hibob.SERVICE_ID}:${mockCredentials.hibob.SERVICE_TOKEN}`,
).toString('base64')

const logger = createLogger('checkAuthorization')

export const checkAuthorization = (ev: APIGatewayProxyEvent) => {
  const resolved = resolveService(ev)

  if (!resolved) return STATUS_UNAUTHORIZED
  const [serviceName, path] = resolved
  logger.log(`Resolved service: ${serviceName}, path: ${path}`)
  const extractedAuthHeader = extractHeaders(ev, AUTH).get(AUTH)

  switch (serviceName) {
    case 'hibob':
      logger.log(`Correct headers: ${hiBobMockHeader}, extracted: ${extractedAuthHeader}`)
      return extractHeaders(ev, AUTH).get(AUTH) === hiBobMockHeader ? STATUS_OK : STATUS_UNAUTHORIZED
    case 'harvest':
      return STATUS_UNAUTHORIZED
    case 'cinode':
      return STATUS_UNAUTHORIZED
    default:
      return STATUS_UNAUTHORIZED
  }
}
