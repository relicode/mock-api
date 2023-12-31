import { faker } from '@faker-js/faker'
import type { PartialDeep } from 'type-fest'

import type { HarvestTimeEntry, HarvestUser } from './types/utils/types.js'
import { getConfig, createLogger } from './utils.js'
import { access, constants, readFile } from 'fs/promises'
import chalk from 'chalk'

const { red } = chalk

const logger = createLogger('generate-mock-data')

const generateId = (() => {
  let counter = 0
  return () => counter++
})()

export const generateHarvestUser = (props: Partial<HarvestUser> | HarvestUser): HarvestUser => {
  const updatedAt = faker.date.past()
  const createdAt = faker.date.past({ refDate: updatedAt })

  return {
    id: generateId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    telephone: faker.phone.number(),
    timezone: faker.location.timeZone(),
    weekly_capacity: faker.number.int({ min: 0, max: 40 }),
    has_access_to_all_future_projects: faker.datatype.boolean(),
    is_contractor: faker.datatype.boolean(),
    is_active: faker.datatype.boolean(),
    calendar_integration_enabled: faker.datatype.boolean(),
    calendar_integration_source: {},
    /**
     * Actual harvest string format:
     * 2023-09-06T13:41:34Z
     *
     * ISO string format used by Date():
     * 2023-09-06T13:41:34.000Z
     */
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
    can_create_projects: faker.datatype.boolean(),
    default_hourly_rate: faker.number.int(),
    cost_rate: faker.number.int(),
    roles: faker.helpers.uniqueArray(faker.person.jobTitle, faker.helpers.rangeToNumber({ min: 0, max: 5 })),
    access_roles: faker.lorem.words({ min: 0, max: 3 }).split(' '),
    permissions_claims: faker.lorem.words({ min: 0, max: 3 }).split(' '),
    avatar_url: faker.image.avatar(),
    ...props,
  }
}

export const generateTimeEntry = (
  { id, first_name, last_name }: HarvestUser,
  props: PartialDeep<HarvestTimeEntry> = {},
): typeof props => ({
  id: generateId(),
  spent_date: faker.date.past().toISOString(),
  user: { id, name: `${first_name} ${last_name}` },
  project: { id: generateId() },
  task: { id: generateId() },
})

const harvestUsers = Array.from({ length: 10 }, generateHarvestUser)

const harvestTimeEntries = Array.from({ length: 10 }, () => generateTimeEntry(faker.helpers.arrayElement(harvestUsers)))

export const generateData = () => ({
  harvestUsers,
  harvestTimeEntries,
})

export const loadJsonData = async (): Promise<Record<string, unknown>> => {
  const { dataPath } = getConfig()
  if (!dataPath) return generateData()
  try {
    await access(dataPath, constants.R_OK)
    const fileContent = await readFile(dataPath, 'utf8')
    return JSON.parse(fileContent)
  } catch (e) {
    logger.error(`Can't access or parse ${red(dataPath)}`, e)
    process.exit(1)
  }
}

const generateRE = /generate-mock-data/gi
if (process.argv.some((arg) => generateRE.test(arg))) {
  const data = await loadJsonData()
  logger.console(JSON.stringify(data, null, 2))
  process.exit(0)
}
