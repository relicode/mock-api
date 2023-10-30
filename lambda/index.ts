#!/usr/bin/env node

import { StatusCode } from 'status-code-enum'
import { checkAuthorization, parseResult, resolveService } from './utils/index.js'
import { APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (ev, ctx) => {
  const resolved = resolveService(ev)

  if (!resolved)
    return parseResult({
      statusCode: StatusCode.ClientErrorNotFound,
    })

  const statusCode = checkAuthorization(resolved, ev)

  return parseResult({
    statusCode,
    body: {
      ctx,
      ev,
    },
  })
}
