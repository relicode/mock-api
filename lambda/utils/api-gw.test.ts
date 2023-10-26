import { strict as assert } from 'node:assert'
import test from 'node:test'

import { Service } from './constants.js'
import { parseHeaders, resolveService } from './api-gw.js'

const genEv = (proxy: string) => ({ pathParameters: { proxy } })

test('headers are parsed properly', async (t) => {
  const requestHeaders = {
    Accept: '*/*',
    'Accept-Encoding': 'br, gzip, deflate',
    'Accept-Language': '*',
    Authorization: 'Basic TU9DS19ISUJPQl9TRVJWSUNFX0lEOk1PQ0tfSElCT0JfU0VSVklDRV9UT0tFTg==',
    'CloudFront-Forwarded-Proto': 'https',
    'CloudFront-Is-Desktop-Viewer': 'true',
    'CloudFront-Is-Mobile-Viewer': 'false',
    'CloudFront-Is-SmartTV-Viewer': 'false',
    'CloudFront-Is-Tablet-Viewer': 'false',
    'CloudFront-Viewer-ASN': '34977',
    'CloudFront-Viewer-Country': 'ES',
    'content-type': 'application/json',
    Host: 'npadmyefpb.execute-api.eu-north-1.amazonaws.com',
    'sec-fetch-mode': 'cors',
    'User-Agent': 'undici',
    Via: '1.1 652331095b841aa2e89ce3a0cd676d04.cloudfront.net (CloudFront)',
    'X-Amz-Cf-Id': 'xozq-0__LbSQ8ffISiDNXyP3yqMwIwQ2crBGxROyOh-lghJrmRnAtg==',
    'X-Amzn-Trace-Id': 'Root=1-653a79e0-42227d333505640052af96ab',
    'X-Forwarded-For': '212.225.225.37, 130.176.186.72',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https',
  }

  await t.test('Headers are parsed from plain object', async () => {
    const parsed = parseHeaders(requestHeaders)
    assert.equal(parsed.authorization, requestHeaders.Authorization)
  })

  await t.test('Headers are parsed from request object', async () => {
    const parsed = parseHeaders({ headers: requestHeaders })
    assert.equal(parsed.authorization, requestHeaders.Authorization)
  })

  await t.test('Headers are parsed from Header instance', async () => {
    const VALUE = 'value'
    const parsed = parseHeaders(new Headers({ key: VALUE }))
    assert.equal(parsed.key, VALUE)
  })

  await t.test('Headers are appended', async () => {
    const ALL = '*/*'
    const APP_JSON = 'application/json'
    const parsed = parseHeaders({ 'Content-Type': ALL, 'content-type': APP_JSON })
    const contentType = parsed['content-type'].split(', ')
    assert.equal(contentType.includes(ALL) && contentType.includes(APP_JSON), true)
  })
})

test('right service is derived from event', async (t) => {
  const urls = [
    ['https://api.cinode.com/', Service.CINODE, '/'],
    ['https://api.cinode.com/a', Service.CINODE, '/a'],
    ['https://api.cinode.com/a/b/c?yy=kaa', Service.CINODE, '/a/b/c'],
    ['https://api.hibob.com/v1/', Service.HIBOB, '/v1/'],
    ['https://api.harvestapp.com/v2/eeh', Service.HARVEST, '/v2/eeh'],
  ]

  for (const [url, expectedService, expectedPath] of urls) {
    await t.test(`Path ${url} should resolve to service ${expectedService} with url of ${expectedPath}.`, () => {
      assert.deepEqual(resolveService(genEv(url)), [expectedService, expectedPath])
    })
  }
})

test('invalid paths throw an error', async (t) => {
  const invalidPaths = [
    'https://weighty-footwear.net',
    'https://spiteful-underwear.biz',
    'https://wobbly-claw.org',
    'https://incompatible-eavesdropper.info',
    'https://wary-farm.name',
    'https://white-veneer.name',
    'https://leading-corsage.net/',
    'https://thin-spelt.biz/',
    'https://pastel-singing.com/',
    'https://slippery-victim.net/',
  ]

  for (const path of invalidPaths) {
    await t.test(`Path ${path} should return undefined.`, () => {
      assert.equal(resolveService(genEv(path)), undefined)
    })
  }
})
