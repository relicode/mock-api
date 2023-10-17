#!/usr/bin/env node

import { createLogger, parseResult } from './utils'
import { APIGatewayProxyHandlerV2 } from 'aws-lambda'

const handlerLogger = createLogger('handler')

export const handler: APIGatewayProxyHandlerV2 = async (ev, ctx) => {
  handlerLogger.console.log(ev)

  return parseResult({ headers: { 'Custom-Header': 'Custom header set by server' }, body: { ev, ctx } })
}
