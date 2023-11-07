import { CinodeAbsence, CinodeUser } from '../utils/types'
export default class CinodeService {
  private readonly baseUrl
  private headers
  private fetch
  constructor(baseUrl?: string, fetch?: typeof globalThis.fetch)
  init(fetch?: typeof globalThis.fetch): Promise<this>
  private getToken
  getUsers(compunknownId?: string, fetch?: typeof globalThis.fetch): Promise<CinodeUser[]>
  saveAbsence(compunknownUserId: number, start: string, end: string, fetch?: typeof globalThis.fetch): Promise<Response>
  getAbsenceList(compunknownUserId: number, fetch?: typeof globalThis.fetch): Promise<unknown>
  getFutureAbsenceList(
    compunknownUserId: number,
    today?: Date,
    fetch?: typeof globalThis.fetch,
  ): Promise<CinodeAbsence[]>
  clearFutureAbsencesByUser(compunknownUserId: number, today?: Date): Promise<void>
}
//# sourceMappingURL=CinodeService.d.ts.map
