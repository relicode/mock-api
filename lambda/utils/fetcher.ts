import _ from 'lodash'
import type { LoggerConfig } from '.'
import { createLogger, delay, getErrorMessage, jsonHeaders } from '.'
import type { EmptyObject, Jsonifiable } from 'type-fest'

type FetcherConfig = {
  loggerConfig: LoggerConfig
  retryInterval: number
  retries: number
}

const defaultConfig: FetcherConfig = {
  loggerConfig: {
    prefix: 'fetcher',
  },
  retryInterval: 250,
  retries: 2,
}

type FetchParams = Parameters<typeof fetch>
type RequestInfo = FetchParams[0]
type Init = RequestInit // FetchParams[1]
type Serializable = Jsonifiable | undefined

type JSONFetchParams<T extends Serializable> = [input: RequestInfo, init?: Omit<Init, 'body'> & { body?: T }]

const extractUrl = (input: RequestInfo) => {
  let url: string
  if (typeof input === 'string') url = input
  else if (input instanceof URL) url = input.toString()
  else url = input.url
  return url
}

export const createFetcher = (options?: Partial<FetcherConfig>) => {
  const { loggerConfig, retries, retryInterval } = _.merge(defaultConfig, options)

  const logger = createLogger(
    typeof loggerConfig === 'string'
      ? {
          prefix: loggerConfig,
        }
      : {
          ...loggerConfig,
        },
  )

  type SingleFetch = (...args: [...FetchParams, retryCounter: number]) => Promise<Response | string>

  const singleFetch: SingleFetch = async (input, init, retryCounter) => {
    const url = extractUrl(input)
    const retryStub = retryCounter ? `(retry #${retryCounter})` : ''

    logger.log(`Fetching ${retryStub} ${url}...`)

    try {
      const response = await fetch(input, init)

      if (response.ok) {
        logger.log(`Fetch ${retryStub} ${url} successful.`)
      } else {
        logger.warn(`Fetch ${retryStub} ${url} not successful (${response.status}):`)
      }
      return response
    } catch (e) {
      const errorMessage = getErrorMessage(e)
      logger.error(`Fetch ${retryStub} ${url} errored: ${errorMessage}`, e)
      return errorMessage
    }
  }

  const enhancedFetch = async (...[input, init]: FetchParams) => {
    const url = extractUrl(input)
    let response: string | Response = ''

    for (let retryCounter = 0; retryCounter <= retries; retryCounter++) {
      if (retryCounter) await delay(retryInterval)
      response = await singleFetch(input, init, retryCounter)
      if (response instanceof Response && response.ok) return response
    }

    const messageStart = `Failed to fetch ${url}, retried ${retries} times`

    if (response instanceof Response) {
      logger.warn(`${messageStart}. Response status: ${response.status}`)
      return response
    }

    const errorMessage = `${messageStart}. Error details: ${response}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  const emptyBodyMethods = ['GET', 'HEAD'] as const
  const [GET] = emptyBodyMethods

  const fetchJsonAndResponse = async <T extends Serializable = undefined, B extends Serializable = undefined>(
    ...[input, init]: JSONFetchParams<B>
  ): Promise<{ response: Response; json: T }> => {
    const method = (init?.method || GET) as (typeof emptyBodyMethods)[number]

    const headers = new Headers(init?.headers)
    for (const [key, val] of Object.entries(jsonHeaders)) {
      if (!headers.has(key)) headers.set(key, val)
    }

    const allowBody = emptyBodyMethods.includes(method)
    const parsedInit = {
      ...init,
      ...(allowBody && { body: JSON.stringify(init?.body || {}) }),
      body: allowBody && init?.body ? JSON.stringify(init.body || {}) : undefined,
      headers,
    }

    const response = await enhancedFetch(input, parsedInit)
    const json = (await response.json()) as T
    return { json, response }
  }

  const fetchJson = <T extends Jsonifiable, B extends Serializable = EmptyObject | undefined>(
    ...[url, init]: JSONFetchParams<B>
  ): Promise<T> => fetchJsonAndResponse<T, B>(url, init).then((response) => response.json)

  return {
    fetch: enhancedFetch,
    fetchJson,
    fetchJsonAndResponse,
  }
}
