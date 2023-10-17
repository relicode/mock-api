import { createLogger, extractHeaders } from './utils.js'
import { APIGatewayProxyEvent } from 'aws-lambda'

const logger = createLogger('authorization-middleware')

export const checkAuthorization = async (event: APIGatewayProxyEvent) => {
  const split = event.path.split('/')
  const [_, service, ...rest] = split
  logger.log({ service, path: rest.join('/') })
  switch (service) {
    case 'harvest':
      return (
        await fetch(
          'https://api.harvestapp.com/v2/users/me',
          extractHeaders(event, 'Authorization', 'Harvest-Account-Id'),
        )
      ).status
  }
  return 401
}
