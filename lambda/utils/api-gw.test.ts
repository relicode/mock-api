import { strict as assert } from 'node:assert'
import test from 'node:test'

import { Service } from '.'
import { resolveService } from './api-gw'

const genEv = (proxy: string) => ({ pathParameters: { proxy } })

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
