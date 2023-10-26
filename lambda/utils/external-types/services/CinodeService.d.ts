import { CinodeAbsence, CinodeUser } from '../utils/types'
export default class CinodeService {
  private readonly baseUrl
  private headers
  private fetch
  constructor(baseUrl?: string, fetch?: typeof globalThis.fetch)
  init(fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>): Promise<this>
  private getToken
  getUsers(companyId?: string, fetch?: typeof globalThis.fetch): Promise<CinodeUser[]>
  saveAbsence(companyUserId: number, start: string, end: string, fetch?: typeof globalThis.fetch): Promise<unknown>
  getAbsenceList(companyUserId: number, fetch?: typeof globalThis.fetch): Promise<unknown>
  getFutureAbsenceList(companyUserId: number, today?: Date, fetch?: typeof globalThis.fetch): Promise<CinodeAbsence[]>
  clearFutureAbsencesByUser(companyUserId: number, today?: Date): Promise<void>
}
