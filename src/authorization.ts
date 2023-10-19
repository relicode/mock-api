import { extractHeaders, resolveService } from './utils'
import { APIGatewayProxyEventV2 } from 'aws-lambda'

export const checkAuthorization = async (ev: APIGatewayProxyEventV2) => {
  const [service, _path] = resolveService(ev)

  switch (service) {
    case 'harvest':
      return (
        await fetch('https://api.harvestapp.com/v2/users/me', extractHeaders(ev, 'authorization', 'harvest-account-id'))
      ).status
  }
  return 401
}
