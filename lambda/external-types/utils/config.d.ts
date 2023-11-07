export declare const isDevelopment: () => boolean
export declare const isProduction: () => boolean
export declare const getConfig: () => {
  nodeEnv: string
  CINODE_ACCESSID: string
  CINODE_ACCESSSECRET: string
  CINODE_COMPANY_ID: string
  EMAIL_FOR_REPORT: string
  HARVEST_ACCESS_TOKEN: string
  HARVEST_ACCOUNT_ID: string
  HIBOB_SERVICE: string
  HIBOB_SERVICE_TOKEN: string
  INTEGRATION_TEST_BASE_URL: string
  INTERNAL_EMAIL: string
  AWS_DEFAULT_REGION: 'eu-west-3'
  WHITELIST: string[]
  HARVEST_WUNDERDOG_CLIENT: 'Wunderdog Málaga'
  HARVEST_ANNUAL_LEAVE: 'Annual leave'
  HARVEST_DEFAULT_HOURS: 8
  PUBLIC_HOLIDAYS: string[]
  CINODE_API_BASE_URL: 'https://api.cinode.com'
  cinodeAbsences: Record<string, import('./types').CinodeAbsenceType>
  HARVEST_REPORT_MESSAGE: {
    readonly CONSULTANT_SUBJECT: 'Conflicting time entries between HiBob and Harvest'
    readonly CONSULTANT_MESSAGE: 'Conflicting time entries between HiBob and Harvest were found. Please check them.'
    readonly REPORT_SUBJECT: 'Report about conflicting time entries between HiBob and Harvest'
    readonly NO_CONFLICTS_REPORT_MESSAGE: 'No conflicts, all good.'
    readonly CONFLICTS_REPORT_MESSAGE: 'Conflicting time entries between HiBob and Harvest were found. Please check them.'
  }
  DYNAMODB_TABLES: {
    readonly TIMEOFFS: 'timeoffs'
  }
  HIBOB_CHANGE_TYPES: {
    readonly APPROVED: 'Created'
    readonly CANCELED: 'Canceled'
  }
}
declare const config: {
  nodeEnv: string
  CINODE_ACCESSID: string
  CINODE_ACCESSSECRET: string
  CINODE_COMPANY_ID: string
  EMAIL_FOR_REPORT: string
  HARVEST_ACCESS_TOKEN: string
  HARVEST_ACCOUNT_ID: string
  HIBOB_SERVICE: string
  HIBOB_SERVICE_TOKEN: string
  INTEGRATION_TEST_BASE_URL: string
  INTERNAL_EMAIL: string
  AWS_DEFAULT_REGION: 'eu-west-3'
  WHITELIST: string[]
  HARVEST_WUNDERDOG_CLIENT: 'Wunderdog Málaga'
  HARVEST_ANNUAL_LEAVE: 'Annual leave'
  HARVEST_DEFAULT_HOURS: 8
  PUBLIC_HOLIDAYS: string[]
  CINODE_API_BASE_URL: 'https://api.cinode.com'
  cinodeAbsences: Record<string, import('./types').CinodeAbsenceType>
  HARVEST_REPORT_MESSAGE: {
    readonly CONSULTANT_SUBJECT: 'Conflicting time entries between HiBob and Harvest'
    readonly CONSULTANT_MESSAGE: 'Conflicting time entries between HiBob and Harvest were found. Please check them.'
    readonly REPORT_SUBJECT: 'Report about conflicting time entries between HiBob and Harvest'
    readonly NO_CONFLICTS_REPORT_MESSAGE: 'No conflicts, all good.'
    readonly CONFLICTS_REPORT_MESSAGE: 'Conflicting time entries between HiBob and Harvest were found. Please check them.'
  }
  DYNAMODB_TABLES: {
    readonly TIMEOFFS: 'timeoffs'
  }
  HIBOB_CHANGE_TYPES: {
    readonly APPROVED: 'Created'
    readonly CANCELED: 'Canceled'
  }
}
export default config
//# sourceMappingURL=config.d.ts.map
