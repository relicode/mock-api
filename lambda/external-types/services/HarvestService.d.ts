import { HarvestProjectAssignment, HarvestTask, TimeEntry, TimeEntryToHarvest, UserFromHarvest } from '../utils/types'
export default class HarvestService {
  private readonly baseUrl
  private readonly fetchService
  constructor(harvestAccountId: string, harvestAccessToken: string)
  getTimeEntriesFromTo(from: string, to: string): Promise<TimeEntry[]>
  getAllUsers(): Promise<UserFromHarvest[]>
  getAllTasks(): Promise<HarvestTask[]>
  getProjectAssignmentsByUserId(userId: number): Promise<HarvestProjectAssignment[]>
  postTimeEntry(timeEntry: TimeEntryToHarvest): Promise<void>
}
//# sourceMappingURL=HarvestService.d.ts.map
