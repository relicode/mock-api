import { HarvestProjectAssignment, TimeEntry } from './types'
export declare function getFirstDayPrevMonth(): Date
export declare function getLastDayPrevMonth(): Date
export declare function formatDate(date: Date): string
export declare function getProjectId(projectAssignments: HarvestProjectAssignment[], timeEntry: TimeEntry): number
export declare const parsePath: (path: string, searchParams: ConstructorParameters<typeof URLSearchParams>[0]) => string
export declare const parseUrl: (...args: Array<string | ConstructorParameters<typeof URLSearchParams>[0]>) => URL
