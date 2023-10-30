import { normalizeHeaders, resolveService, mockCredentials } from './index.js'
import { APIGatewayProxyEvent } from 'aws-lambda'

const AUTH_HEADER_NAME = 'authorization' as const
const STATUS_OK = 200 as const
const STATUS_UNAUTHORIZED = 401 as const
const STATUS_NOT_FOUND = 404 as const

export const checkAuthorization = (ev: APIGatewayProxyEvent) => {
  const resolved = resolveService(ev)
  if (!resolved) return STATUS_NOT_FOUND

  const [serviceName, _path] = resolved

  // logger.log('Request headers: ', normalizeHeaders(ev))
  const requestAuthHeaders = normalizeHeaders(ev)[AUTH_HEADER_NAME]

  switch (serviceName) {
    case 'hibob':
      // logger.log(`Valid headers: ${validAuth}, request: ${requestAuth}`)
      return requestAuthHeaders === mockCredentials.hibob.authHeader ? STATUS_OK : STATUS_UNAUTHORIZED
    case 'harvest':
      return STATUS_UNAUTHORIZED
    case 'cinode':
      return STATUS_UNAUTHORIZED
    default:
      return STATUS_UNAUTHORIZED
  }
}
