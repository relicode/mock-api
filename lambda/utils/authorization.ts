import { APIGatewayProxyEvent } from 'aws-lambda'
import { StatusCode } from 'status-code-enum'

import { mockCredentials, HeadersNames, getHeader, Service } from './index.js'

const AUTH = HeadersNames.AUTHORIZATION

const hibobHeaders = [AUTH] as const
const harvestHeaders = [AUTH, 'Harvest-Account-Id'] as const

export const checkAuthorization = (resolved: [service: Service, path: string], ev: APIGatewayProxyEvent): number => {
  const [service] = resolved

  switch (service) {
    case 'hibob':
      return hibobHeaders.reduce(
        (acc: number, cur: string) =>
          acc === StatusCode.SuccessOK && getHeader(ev, cur) === mockCredentials.hibob.headers[cur]
            ? StatusCode.SuccessOK
            : StatusCode.ClientErrorUnauthorized,
        StatusCode.SuccessOK,
      )
    case 'harvest':
      return harvestHeaders.reduce(
        (acc: number, cur: string) =>
          acc === StatusCode.SuccessOK && getHeader(ev, cur) === mockCredentials.harvest.headers[cur]
            ? StatusCode.SuccessOK
            : StatusCode.ClientErrorUnauthorized,
        StatusCode.SuccessOK,
      )
    /*
    case 'cinode':
      return StatusCode.ServerErrorNotImplemented
    */
    default:
      return StatusCode.ServerErrorNotImplemented
  }
}
