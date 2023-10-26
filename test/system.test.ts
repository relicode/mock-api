import { strict as assert } from 'node:assert'
import test from 'node:test'
import { createFetcher } from '../lambda/utils/fetcher.js'
import { getHibobAuthHeaders } from '../lambda/utils/index.js'

const baseUrl = 'https://npadmyefpb.execute-api.eu-north-1.amazonaws.com/mock/'
const proxyParam = 'https://api.hibob.com/v1/'

const api = createFetcher({ loggerConfig: 'test fetcher' })

// TODO: Test for JSON header
// Authorization: Basic $(echo "MOCK_HIBOB_SERVICE_ID:MOCK_HIBOB_SERVICE_TOKEN" | base64)"

test('API authorizes requests', async (t) => {
  await t.test('Status 200 with valid credentials', async () => {
    const { response } = await api.fetchJsonAndResponse(baseUrl + proxyParam, {
      headers: getHibobAuthHeaders(),
    })
    assert.equal(response.status, 200)
  })

  await t.test('Status 401 with invalid credentials', async () => {
    const { response } = await api.fetchJsonAndResponse(baseUrl + proxyParam, {
      headers: {},
    })
    assert.equal(response.status, 401)
  })
})
