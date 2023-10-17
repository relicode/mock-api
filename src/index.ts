#!/usr/bin/env node

import { createLogger, parseBody, parseResult } from './utils'
import { APIGatewayProxyHandlerV2 } from 'aws-lambda'

const logger = createLogger('handler')

export const handler: APIGatewayProxyHandlerV2 = async (ev, ctx) => {
  logger.log(ev)
  const body = parseBody(ev)
  if (body) {
    body.ev = ev
    body.ctx = ctx
  }

  return parseResult({ body })
}
