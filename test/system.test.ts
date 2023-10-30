import { strict as assert } from 'node:assert'
import test from 'node:test'

import { createFetcher, mockCredentials } from '../lambda/utils/index.js'

const hibobBaseUrl = 'https://npadmyefpb.execute-api.eu-north-1.amazonaws.com/mock/'
const hibobProxyParam = 'https://api.hibob.com/v1/'
const hibobUrl = `${hibobBaseUrl}${hibobProxyParam}`

const api = createFetcher({ loggerConfig: 'test fetcher' })

const hibobAuthHeaderBase = `${mockCredentials.hibob.serviceId}:${mockCredentials.hibob.serviceToken}`

test('API authorizes requests', async (t) => {
  await t.test('Status 200 with valid credentials', async () => {
    const { response } = await api.fetchJsonAndResponse(hibobUrl, {
      headers: { Authorization: Buffer.from(hibobAuthHeaderBase).toString('base64') },
    })
    assert.equal(response.status, 200)
  })

  await t.test('Status 401 with invalid credentials', async () => {
    const { response } = await api.fetchJsonAndResponse(hibobUrl, {
      headers: {},
    })
    assert.equal(response.status, 401)
  })
})

test('API responds with invalid', async (t) => {
  await t.test('Status 404 with invalid path', async () => {
    const { response } = await api.fetchJsonAndResponse(hibobUrl.slice(0, -3), {
      headers: { Authorization: Buffer.from(hibobAuthHeaderBase).toString('base64') },
    })
    assert.equal(response.status, 404)
  })
})
