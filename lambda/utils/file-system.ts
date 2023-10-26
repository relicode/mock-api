import { readFile } from 'node:fs/promises'

import { createLogger, getConfig, getErrorMessage } from './index.js'

const logger = createLogger('file-system')

export const loadJsonData = async <T extends Record<string, unknown> = Record<string, unknown>>(
  dataPath = getConfig().dataPath,
  tolerateFailure = false,
): Promise<T> => {
  try {
    return JSON.parse(await readFile(dataPath, 'utf8'))
  } catch (e) {
    const errorMessage = `Can't access or parse ${logger.error(dataPath)}. ${getErrorMessage(e)}`.trim()
    logger.error(errorMessage, e)
    if (!tolerateFailure) process.exit(1)
    throw new Error(errorMessage)
  }
}
