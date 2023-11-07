import { UserEmailRequestParams } from './types'
type ParseEmailToConsultant = (
  reportEntry: [email: string, dates: string[]],
  reportMessage: string,
) => {
  parsedMessage: string
  emailParams: UserEmailRequestParams
}
export declare const parseEmailToConsultant: ParseEmailToConsultant
export declare const sendEmail: (requestParams: UserEmailRequestParams) => Promise<UserEmailRequestParams>
export {}
//# sourceMappingURL=send-email.d.ts.map
