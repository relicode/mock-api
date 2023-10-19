import _ from 'lodash'
import type { DevOnlyDefaultLoggerConfig, LoggerConfig } from '.'
import { createLogger, delay, getErrorMessage } from '.'
import type { EmptyObject, Jsonifiable } from 'type-fest'

type FetcherConfig = {
  loggerConfig: LoggerConfig
  interval: number
  retries: number
}

const defaultConfig: FetcherConfig = {
  loggerConfig: {
    prefix: 'fetcher',
    devOnly: true,
  },
  interval: 250,
  retries: 2,
}

type FetchParams = Parameters<typeof fetch>
type RequestInfo = FetchParams[0]
type Init = RequestInit

type JSONFetchParams<T extends Jsonifiable = EmptyObject> = [
  input: RequestInfo,
  init?: Omit<Init, 'body'> & { body: T },
]

const extractUrl = (input: RequestInfo) => {
  let url: string
  if (typeof input === 'string') url = input
  else if (input instanceof URL) url = input.toString()
  else url = input.url
  return url
}

export const createFetcher = (options?: Partial<FetcherConfig>) => {
  const { loggerConfig, retries, interval } = _.merge(defaultConfig, options)

  const fetchLoggerConfig: DevOnlyDefaultLoggerConfig =
    typeof loggerConfig === 'string'
      ? {
          prefix: loggerConfig,
          devOnly: true,
        }
      : {
          ...loggerConfig,
          devOnly: true,
        }

  const devLogger = createLogger(fetchLoggerConfig)

  type SingleFetch = (...args: [...FetchParams, retryCounter: number]) => Promise<Response | string>

  const singleFetch: SingleFetch = async (input, init, retryCounter) => {
    const url = extractUrl(input)
    const retryStub = retryCounter ? `(retry #${retryCounter})` : ''

    devLogger.log(`Fetching ${retryStub} ${url}...`)

    try {
      const response = await fetch(input, init)

      if (response.ok) {
        devLogger.log(`Fetch ${retryStub} ${url} successful.`)
      } else {
        devLogger.warn(`Fetch ${retryStub} ${url} not successful (${response.status}).`)
        devLogger.warn(await response.text())
      }
      return response
    } catch (e) {
      const errorMessage = getErrorMessage(e)
      devLogger.error(`Fetch ${retryStub} ${url} errored: ${errorMessage}`, e)
      return errorMessage
    }
  }

  const customFetch = async (...[input, init]: FetchParams) => {
    const url = extractUrl(input)
    let response: string | Response = ''

    for (let retryCounter = 0; retryCounter <= retries; retryCounter++) {
      if (retryCounter) await delay(interval)
      response = await singleFetch(input, init, retryCounter)
      if (response instanceof Response && response.ok) return response
    }

    const errorStart = `Failed to fetch ${url}, retried ${retries} times.`
    const errorDetails = typeof response === 'string' ? response : response.statusText

    devLogger.error(errorStart, errorDetails)
    throw new Error([errorStart, errorDetails].join(' '))
  }

  const fetchJsonResponse = async <T extends Jsonifiable, B extends Jsonifiable = EmptyObject>(
    ...[url, init]: JSONFetchParams<B>
  ): Promise<{ response: Response; json: T }> => {
    const allowBody = init && init.method !== 'GET' && init.method !== 'HEAD'

    const parsedInit = {
      ...init,
      ...(allowBody && { body: JSON.stringify(init?.body || {}) }),
      body: allowBody && init?.body ? JSON.stringify(init.body || {}) : undefined,
    }

    const response = await customFetch(url, parsedInit)
    const json = (await response.json()) as T
    const jsonResponse = {
      response,
      json,
    }
    return jsonResponse
  }

  const fetchJson = async <T extends Jsonifiable, B extends Jsonifiable = EmptyObject>(
    ...[url, init]: JSONFetchParams<B>
  ): Promise<T> => (await fetchJsonResponse<T, B>(url, init)).json

  return {
    fetch: customFetch,
    fetchJson,
    fetchJsonResponse,
  }
}
