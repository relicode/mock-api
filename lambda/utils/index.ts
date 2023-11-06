import { Jsonifiable } from 'type-fest'

export * from './logger.js'
export * from './config.js'
export * from './constants.js'
export * from './api-gw.js'
export * from './file-system.js'
export * from './fetcher.js'
export * from './authorization.js'

export const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : '')

export const responseIsSuccessful = (response: Response) => response.status >= 200 && response.status <= 399

export const delay = (ms = 250): Promise<void> => new Promise((r) => setTimeout(r, ms))

export const deepCopy = <T extends Jsonifiable>(serializable: T): T => JSON.parse(JSON.stringify(serializable))
