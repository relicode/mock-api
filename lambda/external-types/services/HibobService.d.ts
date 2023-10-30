import { TimeOff } from '../utils/types'
export default class HibobService {
  private readonly baseUrl
  private readonly fetchService
  constructor(hibobServiceName: string, hibobServiceToken: string)
  getTimeoffsSince(since: Date): Promise<TimeOff[]>
}
//# sourceMappingURL=HibobService.d.ts.map
