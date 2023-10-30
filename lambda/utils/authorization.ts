import { APIGatewayProxyEvent } from 'aws-lambda'
import { StatusCode } from 'status-code-enum'

import { mockCredentials, HeadersNames, getHeader, Service } from './index.js'

export const checkAuthorization = (resolved: [service: Service, path: string], ev: APIGatewayProxyEvent) => {
  const [service] = resolved
  switch (service) {
    case 'hibob':
      // logger.log(`Valid headers: ${validAuth}, request: ${requestAuth}`)
      return getHeader(ev, HeadersNames.AUTHORIZATION) === mockCredentials.hibob.authHeader
        ? StatusCode.SuccessOK
        : StatusCode.ClientErrorUnauthorized
    case 'harvest':
      return StatusCode.ClientErrorUnauthorized
    case 'cinode':
      return StatusCode.ClientErrorUnauthorized
    default:
      return StatusCode.ClientErrorUnauthorized
  }
}
