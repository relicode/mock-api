/* eslint-disable no-process-env */

import * as constants from './constants'

export const isDevelopment = () => process.env.NODE_ENV === 'development'
export const isProduction = () => !isDevelopment()

export const getConfig = () =>
  Object.freeze({
    constants,
    useAuth: !process.env.NO_AUTH,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : constants.PORT,
    nodeEnv: isDevelopment() ? 'development' : 'production',
    dataPath: process.env.DATA_PATH || constants.DATA_PATH,
  })

export default getConfig()
