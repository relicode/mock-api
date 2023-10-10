import { TimeOff } from '../utils/types'
export default class HibobService {
  private readonly baseUrl
  private readonly fetchService
  constructor(hibobServiceName: string, hibobServiceToken: string)
  getTimeoffsSince(since: string): Promise<TimeOff[]>
}
