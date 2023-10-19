/* eslint-disable no-process-env */

import { DATA_PATH, PORT } from './constants'

export const isDevelopment = () => process.env.NODE_ENV === 'development'
export const isProduction = () => !isDevelopment()

export const getConfig = () =>
  Object.freeze({
    useAuth: !process.env.NO_AUTH,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : PORT,
    nodeEnv: isDevelopment() ? 'development' : 'production',
    dataPath: process.env.DATA_PATH || DATA_PATH,
  })

export default getConfig()
