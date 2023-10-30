import type { ReadonlyDeep } from 'type-fest'

export const DATA_PATH = '/data.json' as const

export enum ContentTypes {
  JSON = 'application/json',
}

export enum Service {
  CINODE = 'cinode',
  HARVEST = 'harvest',
  HIBOB = 'hibob',
}

export enum HeadersNames {
  AUTHORIZATION = 'authorization',
  CONTENT_TYPE = 'content-type',
}

type MockCredentials = ReadonlyDeep<{
  [service in Service]: {
    headers: { [HeadersNames.AUTHORIZATION]: string; [key: string]: string }
    [key: string]: unknown
  }
}>

export const mockCredentials: MockCredentials = {
  hibob: {
    headers: {
      // Buffer.from('MOCK_HIBOB_SERVICE_ID:MOCK_HIBOB_SERVICE_TOKEN').toString('base64')
      authorization: 'TU9DS19ISUJPQl9TRVJWSUNFX0lEOk1PQ0tfSElCT0JfU0VSVklDRV9UT0tFTg==',
    },
    serviceId: 'MOCK_HIBOB_SERVICE_ID',
    serviceToken: 'MOCK_HIBOB_SERVICE_TOKEN',
  },
  harvest: {
    headers: {
      'Harvest-Account-Id': 'MOCK_HARVEST_ACCOUNT_ID',
      authorization: 'Bearer MOCK_HARVEST_ACCESS_TOKEN',
    },
  },
  cinode: {
    headers: {
      authorization: 'Bearer MOCK_CINODE_ACCESS_TOKEN',
    },
  },
} as const
