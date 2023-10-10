import chalk from 'chalk'
import type { RequestHandler, Request } from 'express'
import { createLogger, getConfig } from './utils.js'

const logger = createLogger('authorization-middleware')

const extractHeaders = (req: Request, ...headers: string[]) => {
  const extractedHeaders = new Headers()
  for (const headerKey of headers) {
    const header = req.get(headerKey)
    if (!header) {
      const errorMessage = `Header ${chalk.red(headerKey)} not found`
      logger.error(errorMessage)
    } else extractedHeaders.set(headerKey, header)
  }
  return { headers: extractedHeaders }
}

export const checkAuthorization = async (req: Request) => {
  const { noAuth } = getConfig()
  if (!noAuth) return 200

  const split = req.path.split('/')
  const [_, service, ...rest] = split
  logger.log({ service, path: rest.join('/') })
  switch (service) {
    case 'harvest':
      return (
        await fetch(
          'https://api.harvestapp.com/v2/users/me',
          extractHeaders(req, 'Authorization', 'Harvest-Account-Id'),
        )
      ).status
  }
  return 401
}

const authorizationMiddleware: RequestHandler = async (req, res, next) => {
  const statusCode = await checkAuthorization(req)
  logger.log(statusCode)
  if (statusCode === 200) next(req)
  else res.sendStatus(401)
}

export default authorizationMiddleware
