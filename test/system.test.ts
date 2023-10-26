import { strict as assert } from 'node:assert'
import test from 'node:test'
import { createFetcher } from '../lambda/utils'

const baseUrl = 'https://ltbis67qbi.execute-api.eu-north-1.amazonaws.com/mock/'
const proxyParam = 'https://api.hibob.com/v1/'

const api = createFetcher({ loggerConfig: 'test fetcher' })

// TODO: Test for JSON header

test('API authorizes requests', async (t) => {
  await t.test('Status 200 with right credentials', async () => {
    const { response } = await api.fetchJsonAndResponse(baseUrl + proxyParam, {
      headers: { Authorization: 'VALID AUTHORIZATION HEADER' },
    })
    assert.equal(response.status, 200)
  })

  await t.test('Status 401 with wrong credentials', async () => {
    const { response } = await api.fetchJsonAndResponse(baseUrl + proxyParam, {
      headers: { Authorization: 'INVALID AUTHORIZATION HEADER' },
    })
    assert.equal(response.status, 401)
  })
})
