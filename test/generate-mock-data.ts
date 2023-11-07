import { faker } from '@faker-js/faker'

import type { HarvestTimeEntry, HarvestUser } from '../lambda/external-types/utils/types.d.ts'
import { createLogger } from '../lambda/utils/index.js'

import type { HarvestTask } from '../lambda/external-types/utils/types.d.ts'

const logger = createLogger('generate-mock-data')

const generateId = (() => {
  let counter = 0
  return () => counter++
})()

/**
 *
 * @param [source] Years since
 *
 * @return object with created_at and updated_at props
 *
 * Actual harvest string format:
 * 2023-09-06T13:41:34Z
 *
 * ISO string format used by Date():
 * 2023-09-06T13:41:34.000Z
 *
 */
const generateTimeStamps = (years?: number) => {
  const updatedAt = faker.date.past({ ...(years !== undefined && { years }) })
  const createdAt = faker.date.past({ refDate: updatedAt })
  return {
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
  }
}

const generateHarvestUser = (props: Partial<HarvestUser> | HarvestUser): HarvestUser => ({
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
  // calendar_integration_source: {},
  can_create_projects: faker.datatype.boolean(),
  default_hourly_rate: faker.number.int({ min: 20, max: 100 }),
  cost_rate: faker.number.int(),
  roles: faker.helpers.uniqueArray(faker.person.jobTitle, faker.helpers.rangeToNumber({ min: 0, max: 5 })),
  access_roles: faker.lorem.words({ min: 0, max: 3 }).split(' '),
  permissions_claims: faker.lorem.words({ min: 0, max: 3 }).split(' '),
  avatar_url: faker.image.avatar(),
  ...generateTimeStamps(),
  ...props,
})

const generateHarvestTask = ({
  id = generateId(),
  name = [faker.word.adjective(), faker.word.noun(), 'of the', faker.word.adjective(), faker.word.noun()].join(' '),
  billable_by_default = faker.datatype.boolean(),
  default_hourly_rate = faker.number.int({ min: 20, max: 100 }),
  is_default = faker.datatype.boolean(),
  is_active = faker.datatype.boolean(),
}: Partial<HarvestTask> = {}): HarvestTask => ({
  id,
  name,
  billable_by_default,
  default_hourly_rate,
  is_default,
  is_active,
  ...generateTimeStamps(),
})

const generateTimeEntry = ({ id, first_name, last_name }: HarvestUser, task: HarvestTask): HarvestTimeEntry => ({
  id: generateId(),
  spent_date: faker.date.past().toISOString(),
  user: { id, name: `${first_name} ${last_name}` },
  project: { id: generateId() },
  task: { id: task.id },
})

const harvestUsers = Array.from({ length: 100 }, generateHarvestUser)
const harvestTasks = Array.from({ length: 10 }, generateHarvestTask)
const harvestTimeEntries = Array.from({ length: 100 }, () =>
  generateTimeEntry(faker.helpers.arrayElement(harvestUsers), faker.helpers.arrayElement(harvestTasks)),
)
const data = { harvestUsers, harvestTasks, harvestTimeEntries }

export type MockData = typeof data

if (!process.env.SILENCE_MOCK_DATA) logger.console.log(JSON.stringify(data, null, 2)) // eslint-disable-line no-process-env
