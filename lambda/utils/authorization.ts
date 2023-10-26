import { parseHeaders, resolveService, mockCredentials, createLogger } from './index.js'
import { APIGatewayProxyEvent } from 'aws-lambda'

const AUTH = 'authorization' as const
const STATUS_OK = 200 as const
const STATUS_UNAUTHORIZED = 401 as const

export const getHibobAuthHeaders = () => {
  const { serviceId, serviceToken } = mockCredentials.hibob
  const buffer = Buffer.from([serviceId, serviceToken].join(':'))
  return parseHeaders({ Authorization: `Basic ${buffer.toString('base64')}` })
}

const logger = createLogger('checkAuthorization')

export const checkAuthorization = (ev: APIGatewayProxyEvent) => {
  const resolved = resolveService(ev)

  if (!resolved) return STATUS_UNAUTHORIZED
  const [serviceName, path] = resolved
  logger.log(`Resolved service: ${serviceName}, path: ${path}`)
  const validAuth = getHibobAuthHeaders()[AUTH]

  logger.log('Request headers: ', parseHeaders(ev))

  const requestAuth = parseHeaders(ev)[AUTH]

  switch (serviceName) {
    case 'hibob':
      logger.log(`Valid headers: ${validAuth}, request: ${requestAuth}`)
      return requestAuth === validAuth ? STATUS_OK : STATUS_UNAUTHORIZED
    case 'harvest':
      return STATUS_UNAUTHORIZED
    case 'cinode':
      return STATUS_UNAUTHORIZED
    default:
      return STATUS_UNAUTHORIZED
  }
}
