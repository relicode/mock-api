#!/usr/bin/env node

import { createLogger, parseResult } from './utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda'

type APIGatewayProxyHandler = Handler<APIGatewayProxyEvent, APIGatewayProxyResult>

const handlerLogger = createLogger('handler')

export const handler: APIGatewayProxyHandler = async (ev, ctx) => {
  handlerLogger.log(ev)
  handlerLogger.log(ctx)

  const result = parseResult({ headers: { 'Custome-Header': 'Custom header value' } })
  handlerLogger.table(result.body)

  return result
}
