import { extractHeaders, resolveService, mockCredentials, isProduction } from '.'
import { APIGatewayProxyEventV2 } from 'aws-lambda'

const AUTH = 'authorization'
const STATUS_OK = 200 as const
const STATUS_UNAUTHORIZED = 401 as const

const hiBobMockHeader = Buffer.from(
  `${mockCredentials.hibob.SERVICE_ID}:${mockCredentials.hibob.SERVICE_TOKEN}`,
).toString('base64')

export const checkAuthorization = (ev: APIGatewayProxyEventV2) => {
  if (isProduction()) return STATUS_UNAUTHORIZED

  const servicePath = resolveService(ev)
  if (!servicePath) return STATUS_UNAUTHORIZED
  const [service] = servicePath

  switch (service) {
    case 'hibob':
      return extractHeaders(ev, AUTH).get(AUTH) === hiBobMockHeader ? STATUS_OK : STATUS_UNAUTHORIZED
    case 'harvest':
      return STATUS_UNAUTHORIZED
    case 'cinode':
      return STATUS_UNAUTHORIZED
    default:
      return STATUS_UNAUTHORIZED
  }
}
