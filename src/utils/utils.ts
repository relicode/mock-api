import chalk from 'chalk'
import { readFile } from 'node:fs/promises'
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import _ from 'lodash'
import config from './config'
import { createLogger } from './logger'

const logger = createLogger('utils')

export const loadJsonData = async <T extends Record<string, unknown>>(
  filePath: string = config.dataPath,
): Promise<T> => {
  try {
    const data = await readFile(filePath, 'utf8')
    logger.log(data)
    return JSON.parse(data)
  } catch (e) {
    logger.error(`Can't access or parse ${logger.chalk.red(filePath)}`, e)
    process.exit(1)
  }
}

type ParsedAPIGatewayProxyResult = Omit<APIGatewayProxyResultV2, 'body'> & { body: string | Record<string, unknown> }

export const jsonHeaders = {
  'Content-Type': 'application/json',
} as const

const defaultResult: APIGatewayProxyResultV2 = {
  statusCode: 200,
  headers: jsonHeaders,
  isBase64Encoded: false,
} as const

export const parseBody = <T extends Record<string, unknown>>(ev: APIGatewayProxyEventV2): T => {
  try {
    logger.log(ev.body)
    return ev.body ? JSON.parse(ev.body) : {}
  } catch {
    const errorMessage = `Couldn't parse body of ${ev}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }
}

type ParseResult = (result?: Partial<ParsedAPIGatewayProxyResult>) => APIGatewayProxyResultV2
export const parseResult: ParseResult = ({ body, ...rest } = {}) => ({
  ..._.merge({ ...defaultResult }, rest),
  ...(body && { body: JSON.stringify(body) }),
})

const serviceCinodeRE = new RegExp('^/api.cinode.com/.*')
const serviceHarvestRE = new RegExp('^/api.harvestapp.com/v2/.*')
const serviceHiBobRE = new RegExp('^/api.hibob.com/v1/.*')

export const resolveService = (ev: APIGatewayProxyEventV2): 'cinode' | 'harvest' | 'hibob' => {
  const { path } = ev.requestContext.http
  if (serviceCinodeRE.test(path)) return 'cinode'
  if (serviceHarvestRE.test(path)) return 'harvest'
  if (serviceHiBobRE.test(path)) return 'hibob'
  throw new Error(`Unknown service for ${path}`)
}

export const extractHeaders = (event: APIGatewayProxyEventV2, ...headers: string[]) => {
  const extractedHeaders = new Headers()
  for (const headerKey of headers) {
    const header = event.headers[headerKey]
    if (!header) {
      const errorMessage = `Header ${chalk.red(headerKey)} not found`
      logger.error(errorMessage)
    } else extractedHeaders.set(headerKey, header)
  }
  return { headers: extractedHeaders }
}
