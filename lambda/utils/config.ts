/* eslint-disable no-process-env */

import { APIGatewayProxyEvent } from 'aws-lambda'
import * as constants from './constants.js'

export const isDevelopment = (ev?: APIGatewayProxyEvent) => ev?.requestContext.stage === 'development'
export const isProduction = (ev?: APIGatewayProxyEvent) => !isDevelopment(ev)

export const getConfig = (ev?: APIGatewayProxyEvent) =>
  Object.freeze({
    constants,
    nodeEnv: isDevelopment(ev) ? 'development' : 'production',
    dataPath: process.env.DATA_PATH || constants.DATA_PATH,
  })

export default getConfig()
