#!/usr/bin/env node

import { StatusCode } from 'status-code-enum'
import { APIGatewayProxyHandler } from 'aws-lambda'

import { checkAuthorization, getErrorMessage, parseResult, resolveServiceAndPath } from './utils/index.js'
import createStore from './store.js'
import createHarvestService from './services/harvest.js'
import type { ServiceAndPath } from './utils/index.js'
import { createLogger } from './utils/index.js'

type Service = ServiceAndPath[0]
type Path = ServiceAndPath[1]
type ServicePath = `${Service}${Path}`

const logger = createLogger('handler')

const response404 = parseResult({ statusCode: StatusCode.ClientErrorNotFound })

const store = createStore()
const harvestService = createHarvestService(store)

export const handler: APIGatewayProxyHandler = async (ev, _ctx) => {
  if (ev === null) return parseResult({ statusCode: StatusCode.ClientErrorBadRequest })
  const resolved = resolveServiceAndPath(ev)
  if (!resolved) return response404

  const [service, path] = resolved
  let statusCode = StatusCode.ClientErrorNotFound
  let errorMessage = ''

  const auth = () => {
    statusCode = checkAuthorization(resolved, ev)
    if (statusCode !== StatusCode.SuccessOK) throw new Error(String(statusCode))
  }

  const parsedPath: ServicePath = `${service}${path}`

  try {
    switch (parsedPath) {
      case 'harvest/v2/users':
        auth()
        return parseResult.ok(harvestService.getUsers())
      case 'harvest/v2':
        auth()
        return parseResult.notImplemented
      case 'cinode/':
        auth()
        return parseResult.notImplemented
      case 'hibob/v1':
        auth()
        return parseResult.notImplemented
    }
  } catch (e) {
    logger.error(e)
    logger.log(e)
    errorMessage = getErrorMessage(e)
    const parsedStatus = parseInt(errorMessage, 10)
    if (isNaN(parsedStatus)) statusCode = 500
  }

  return parseResult({
    statusCode,
    body: {
      statusCode,
      errorMessage,
      path,
      parsedPath,
    },
  })
}
