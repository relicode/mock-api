import { HarvestProjectAssignment, HarvestTask, TimeEntry, TimeEntryToHarvest, UserFromHarvest } from '../utils/types'
export declare const generateAuthorizationHeaders: (accountId: string, accessToken: string) => Headers
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
