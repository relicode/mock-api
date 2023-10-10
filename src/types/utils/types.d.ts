import type CinodeService from '../services/CinodeService'
import HarvestService from '../services/HarvestService'
import HibobService from '../services/HibobService'
export type HiBobChangeType = 'Created' | 'Canceled' | 'Deleted'
export type HarvestTaskName = 'Annual leave'
export type HiBobTimeOff = {
  totalDuration: number
  policyTypeDisplayName: string
  changeReason: string
  endDate: string
  changeType: HiBobChangeType
  employeeEmail: string
  employeeId: string
  type: string
  requestId: number
  startPortion: string
  employeeDisplayName: string
  durationUnit: string
  endPortion: string
  totalCost: number
  startDate: string
}
export type HiBobChanges = {
  changes: HiBobTimeOff[]
}
export type TimeOff = {
  id: number
  email: string
  policy: string
  startDate: string
  endDate: string
  totalDuration: number
  billableDuration: number
  changeType: HiBobChangeType
  harvestProjectId?: number
}
export type HarvestTimeEntry = {
  id: number
  spent_date: string
  hours: number
  hours_without_timer: number
  rounded_hours: number
  notes: unknown
  is_locked: boolean
  locked_reason: unknown
  is_closed: boolean
  is_billed: boolean
  timer_started_at: unknown
  started_time: unknown
  ended_time: unknown
  is_running: boolean
  billable: boolean
  budgeted: boolean
  billable_rate: number
  cost_rate: unknown
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
  }
  client: {
    id: number
    name: string
    currency: string
  }
  project: {
    id: number
    name: string
    code: unknown
  }
  task: {
    id: number
    name: string
  }
  user_assignment: {
    id: number
    is_project_manager: boolean
    is_active: boolean
    use_default_rates: boolean
    budget: unknown
    created_at: string
    updated_at: string
    hourly_rate: unknown
  }
  task_assignment: {
    id: number
    billable: boolean
    is_active: boolean
    created_at: string
    updated_at: string
    hourly_rate: number
    budget: unknown
  }
  invoice: unknown
  external_reference: unknown
}
export type HarvestTimeEntries = {
  time_entries: HarvestTimeEntry[]
  per_page: number
  total_pages: number
  total_entries: number
  next_page: unknown
  previous_page: unknown
  page: number
  links: {
    first: string
    next: unknown
    previous: unknown
    last: string
  }
}
export type TimeEntry = {
  id: number
  date: string
  userId: number
  projectId: number
  taskId: number
}
export type HarvestUser = {
  id: number
  first_name: string
  last_name: string
  email: string
  telephone: string
  timezone: string
  weekly_capacity: number
  has_access_to_all_future_projects: boolean
  is_contractor: boolean
  is_active: boolean
  calendar_integration_enabled: boolean
  calendar_integration_source: unknown
  created_at: string
  updated_at: string
  can_create_projects: boolean
  default_hourly_rate: unknown
  cost_rate: unknown
  roles: unknown[]
  access_roles: string[]
  permissions_claims: string[]
  avatar_url: string
}
export type HarvestUsers = {
  users: HarvestUser[]
  per_page: number
  total_pages: number
  total_entries: number
  next_page: unknown
  previous_page: unknown
  page: number
  links: {
    first: string
    next: unknown
    previous: unknown
    last: string
  }
}
export type UserFromHarvest = {
  id: number
  email: string
  name: string
}
export type HarvestTask = {
  id: number
  name: HarvestTaskName
  billable_by_default: boolean
  default_hourly_rate: unknown
  is_default: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}
export type HarvestTasks = {
  tasks: HarvestTask[]
  per_page: number
  total_pages: number
  total_entries: number
  next_page: unknown
  previous_page: unknown
  page: number
  links: {
    first: string
    next: unknown
    previous: unknown
    last: string
  }
}
export type HarvestProjectAssignment = {
  id: number
  is_project_manager: boolean
  is_active: boolean
  use_default_rates: boolean
  budget: unknown
  created_at: string
  updated_at: string
  hourly_rate: unknown
  project: {
    id: number
    name: string
    code: string
    is_billable: boolean
  }
  client: {
    id: number
    name: string
    currency: string
  }
  task_assignments: NonNullable<unknown>[]
}
export type HarvestProjectAssignments = {
  project_assignments: HarvestProjectAssignment[]
  per_page: number
  total_pages: number
  total_entries: number
  next_page: unknown
  previous_page: unknown
  page: number
  links: {
    first: string
    next: unknown
    previous: unknown
    last: string
  }
}
export type TimeEntryToHarvest = {
  project_id: number
  task_id: number
  user_id: number
  hours: number
  spent_date: string
}
export type UserEmailRequestParams = {
  userEmail: string
  subject: string
  message: string
}
export type CinodeSessionToken = {
  access_token: string
  refresh_token: string
}
export type CinodeUser = {
  status: number
  title: string
  companyUserEmail: string
  createdDateTime: string
  updatedDateTime: string
  companyAddress: string | null
  homeAddress: string | null
  image: {
    imageId: number
    companyId: number
    url: string
    largeImageUrl: string
    uploadedWhen: string
    links: object[] | null
  }
  desiredAssignment: string | null
  internalIdentifier: string | null
  twitter: string | null
  linkedIn: string | null
  homepage: string | null
  blog: string | null
  gitHub: string | null
  companyUserId: number
  companyId: number
  seoId: string
  firstName: string
  lastName: string
  companyUserType: number
  id: number
  links: [
    {
      href: string
      rel: string
      methods: string[]
    },
  ]
}
export type CinodeAbsenceType = {
  id: number
  name: string
}
export type CinodeAbsence = {
  id: number
  absenceType: CinodeAbsenceType
  startDate: string
  endDate: string
  extentPercentage: number
  companyUserId: number
  companyUserSeoId: string
  companyId: number
  companySeoId: string
  links: []
}
type ClassToService<T extends Record<keyof T, unknown>> = {
  [K in keyof T]: T[K]
}
export declare namespace Services {
  type Harvest = ClassToService<HarvestService>
  type HiBob = ClassToService<HibobService>
  type Cinode = ClassToService<CinodeService>
}
export {}
