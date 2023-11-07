import { HarvestProjectAssignment, TimeEntry } from './types'
export declare function getFirstDayPrevMonth(): Date
export declare function getLastDayPrevMonth(): Date
export declare const formatDate: (date: Date) => string
export declare function getProjectId(projectAssignments: HarvestProjectAssignment[], timeEntry: TimeEntry): number
type SearchParams = ConstructorParameters<typeof URLSearchParams>[0]
export declare const parsePath: (path: string, searchParams: SearchParams) => string
export declare const getErrorMessage: (error: unknown) => string
export declare const responseIsSuccessful: (response: Response) => boolean
export declare const isWorkDay: (date: Date) => boolean
export {}
//# sourceMappingURL=helpers.d.ts.map
