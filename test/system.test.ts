import 'dotenv/config'

import { strict as assert } from 'node:assert'
import test from 'node:test'

import { ContentTypes, HeadersNames, createFetcher, mockCredentials } from '../lambda/utils/index.js'
import { HarvestTask, HarvestUser } from '../lambda/external-types/utils/types.js'

const api = createFetcher({ loggerConfig: 'system test fetcher', retries: 0 })
const baseUrl = process.env.BASE_URL // eslint-disable-line no-process-env
if (!baseUrl) throw new Error('Missing BASE_URL env variable')

const hibobUrl = `${baseUrl}https://api.hibob.com/v1/`
const hibobAuthHeaders = {
  authorization: Buffer.from(`${mockCredentials.hibob.serviceId}:${mockCredentials.hibob.serviceToken}`).toString(
    'base64',
  ),
}

const harvestUrl = `${baseUrl}https://api.harvestapp.com/v2/`
const harvestAuthHeaders = {
  'harvest-account-id': 'MOCK_HARVEST_ACCOUNT_ID',
  authorization: 'Bearer MOCK_HARVEST_ACCESS_TOKEN',
}

const jsonHeaders = {
  [HeadersNames.CONTENT_TYPE]: ContentTypes.JSON,
} as const

test('Hibob requests are authorized', async (t) => {
  await t.test('Status 501 with valid hibob credentials', async () => {
    const response = await api.fetch(hibobUrl, {
      headers: { ...jsonHeaders, ...hibobAuthHeaders },
    })
    assert.equal(response.status, 501)
  })

  await t.test('Status 401 with invalid hibob credentials', async () => {
    const response = await api.fetch(hibobUrl)
    assert.equal(response.status, 401)
  })

  await t.test('Status 404 for invalid hibob path', async () => {
    const response = await api.fetch(hibobUrl.slice(0, -3), {
      headers: hibobAuthHeaders,
    })
    assert.equal(response.status, 404)
  })
})

test('Harvest requests are authorized', async (t) => {
  await t.test('Status 501 with valid harvest credentials', async () => {
    const response = await api.fetch(harvestUrl, {
      headers: { ...jsonHeaders, ...harvestAuthHeaders },
    })
    assert.equal(response.status, 501)
  })

  await t.test('Status 401 with invalid harvest credentials', async () => {
    const response = await api.fetch(harvestUrl)
    assert.equal(response.status, 401)
  })

  await t.test('Status 404 for invalid harvest path', async () => {
    const response = await api.fetch(harvestUrl.slice(0, -3), {
      headers: harvestAuthHeaders,
    })
    assert.equal(response.status, 404)
  })
})

test('Harvest', async (t) => {
  const init = {
    headers: { ...jsonHeaders, ...harvestAuthHeaders },
  }

  await t.test('Retrieves all harvestUsers', async () => {
    const { users } = await api.fetchJson<{ users: HarvestUser[] }>(`${harvestUrl}users`, init)
    assert.equal(users.length, 100)
  })

  await t.test('Retrieves all harvestTask', async () => {
    const { tasks } = await api.fetchJson<{ tasks: HarvestTask[] }>(`${harvestUrl}tasks`, init)
    assert.equal(tasks.length, 10)
  })
})

test('Cinode requests are authorized', async (t) => {
  await t.test('Status 501 with cinode proxy param', async () => {
    const url = `${baseUrl}https://api.cinode.com/`
    const response = await api.fetch(url, { headers: jsonHeaders })
    assert.equal(response.status, 501)
  })
})
