import { strict as assert } from 'node:assert'
import test from 'node:test'

import { createStore } from '../../lambda/store.js'
import initialData from '../../lambda/initial-data.json'
import { MockData } from '../generate-mock-data.js'
import _ from 'lodash'

test('createStore', async (t) => {
  const store = createStore()
  const { state } = store

  await t.test('should return an object with default initial state', async () => {
    assert.deepEqual(state, initialData)
  })

  await t.test('should return an object with customised initial state', async () => {
    const customSource: MockData = { harvestUsers: [], harvestTimeEntries: [] }
    const { state: customState } = createStore(customSource)

    assert.deepEqual(customState, customSource)

    customSource.harvestUsers.push({
      id: 9,
      first_name: 'Luigi',
      last_name: 'Goodwin',
      email: 'Cathryn_Bernier@hotmail.com',
      telephone: '(855) 829-8686 x323',
      timezone: 'America/Montevideo',
      weekly_capacity: 16,
      has_access_to_all_future_projects: true,
      is_contractor: false,
      is_active: true,
      calendar_integration_enabled: true,
      calendar_integration_source: {},
      created_at: '2023-01-26T14:14:03.957Z',
      updated_at: '2023-05-10T04:59:18.039Z',
      can_create_projects: true,
      default_hourly_rate: 4710377961029632,
      cost_rate: 4152284783050752,
      roles: ['Principal Division Engineer'],
      access_roles: ['volubilis', 'crastinus', 'terra'],
      permissions_claims: ['non', 'ubi'],
      avatar_url: 'https://avatars.githubusercontent.com/u/28666382',
    })

    assert.notDeepEqual(customState, customSource, 'mutating source does not mutate store state')
  })

  await t.test('should return the email of the second harvest user', async () => {
    assert.equal(_.get(state, 'harvestUsers[1].email'), 'Emmanuel.OConnell@yahoo.com')
  })
})
