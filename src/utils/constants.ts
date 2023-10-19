export const INVOCATION_URL = 'http://localhost:9000/2015-03-31/functions/function/invocations' as const
export const PORT = 8080 as const
export const DATA_PATH = '/data.json' as const

enum HiBobMockCredentials {
  SERVICE_ID = 'MOCK_HIBOB_SERVICE_ID',
  SERVICE_TOKEN = 'MOCK_HIBOB_SERVICE_TOKEN',
}

export const mockCredentials = {
  hibob: HiBobMockCredentials,
} as const

export enum Service {
  CINODE = 'cinode',
  HARVEST = 'harvest',
  HIBOB = 'hibob',
}
