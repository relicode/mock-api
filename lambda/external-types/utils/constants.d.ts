import { CinodeAbsenceType } from './types'
export declare const AWS_DEFAULT_REGION = 'eu-west-3'
export declare const WHITELIST: string[]
export declare const HARVEST_WUNDERDOG_CLIENT = 'Wunderdog M\u00E1laga'
export declare const HARVEST_ANNUAL_LEAVE = 'Annual leave'
export declare const HARVEST_DEFAULT_HOURS = 8
export declare const PUBLIC_HOLIDAYS: string[]
export declare const CINODE_API_BASE_URL = 'https://api.cinode.com'
export declare const cinodeAbsences: Record<string, CinodeAbsenceType>
export declare const ENV_VARIABLE_NAMES: readonly [
  'CINODE_ACCESSID',
  'CINODE_ACCESSSECRET',
  'CINODE_COMPANY_ID',
  'EMAIL_FOR_REPORT',
  'HARVEST_ACCESS_TOKEN',
  'HARVEST_ACCOUNT_ID',
  'HIBOB_SERVICE',
  'HIBOB_SERVICE_TOKEN',
  'INTEGRATION_TEST_BASE_URL',
  'INTERNAL_EMAIL',
]
export declare const HARVEST_REPORT_MESSAGE: {
  readonly CONSULTANT_SUBJECT: 'Conflicting time entries between HiBob and Harvest'
  readonly CONSULTANT_MESSAGE: 'Conflicting time entries between HiBob and Harvest were found. Please check them.'
  readonly REPORT_SUBJECT: 'Report about conflicting time entries between HiBob and Harvest'
  readonly NO_CONFLICTS_REPORT_MESSAGE: 'No conflicts, all good.'
  readonly CONFLICTS_REPORT_MESSAGE: 'Conflicting time entries between HiBob and Harvest were found. Please check them.'
}
export declare const DYNAMODB_TABLES: {
  readonly TIMEOFFS: 'timeoffs'
}
export declare const HIBOB_CHANGE_TYPES: {
  readonly APPROVED: 'Created'
  readonly CANCELED: 'Canceled'
}
//# sourceMappingURL=constants.d.ts.map
