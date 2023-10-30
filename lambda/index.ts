#!/usr/bin/env node

import { StatusCode } from 'status-code-enum'
import { checkAuthorization, parseResult, resolveServiceAndPath } from './utils/index.js'
import { APIGatewayProxyHandler } from 'aws-lambda'

const response404 = parseResult({ statusCode: StatusCode.ClientErrorNotFound })

export const handler: APIGatewayProxyHandler = async (ev, ctx) => {
  if (ev === null) return parseResult({ statusCode: StatusCode.ClientErrorBadRequest })
  const resolved = resolveServiceAndPath(ev)
  if (!resolved) return response404

  return parseResult({
    statusCode: checkAuthorization(resolved, ev),
    body: {
      ctx,
      ev,
    },
  })
}
