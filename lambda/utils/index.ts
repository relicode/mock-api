import { DateStr } from '../types.js'
import { ImportantDates } from './constants.js'

export * from './logger.js'
export * from './config.js'
export * from './constants.js'
export * from './api-gw.js'
export * from './file-system.js'
export * from './fetcher.js'
export * from './authorization.js'

export const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : '')

export const responseIsSuccessful = (response: Response) => response.status >= 200 && response.status <= 399

export const delay = (ms = 250): Promise<void> => new Promise((r) => setTimeout(r, ms))

export const deepCopy = <T>(serializable: T): T => JSON.parse(JSON.stringify(serializable))

type SearchParams = ConstructorParameters<typeof URLSearchParams>[0]

export const parsePath = (path: string, searchParams: SearchParams) =>
  [path, new URLSearchParams(searchParams).toString()].join('?')

/**
 *
 * @param date Date instance or an ImportantDate
 * @returns DateStr
 */
export const formatDate = (date: Date | ImportantDates) =>
  (date instanceof Date
    ? [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((n) => String(n).padStart(2, '0')).join('-')
    : date.slice(0, 10)) as DateStr

/**
 *
 * @param dateStr DateStr 2012-12-31
 * @returns Date instance
 */
export const parseDate = (dateStr: string) => {
  const split = dateStr.split('-')
  const parsed = split.map((s, idx) => {
    const asNumber = parseInt(s, 10)
    if (isNaN(asNumber)) throw new Error('Invalid string')
    return idx === 1 ? asNumber - 1 : asNumber // Reduce for month
  })
  const [year, month, day, ...rest] = parsed
  return new Date(year, month, day, ...rest)
}
