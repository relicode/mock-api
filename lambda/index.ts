#!/usr/bin/env node

import { checkAuthorization, parseResult } from './utils/index.js'
import { APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (ev, ctx) => {
  const statusCode = checkAuthorization(ev)

  const { headers } = ev

  return parseResult({
    statusCode,
    body: {
      headers,
      ctx,
      ev,
    },
    // body: { requestBody: parseBody(ev), ctx, env, ev },
  })
}
