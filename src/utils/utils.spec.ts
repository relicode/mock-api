import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

import { Service } from '.'
import { resolveService } from './api-gw'

const gen = (path: string) =>
  ({
    requestContext: {
      http: {
        path,
      },
    },
  }) as APIGatewayProxyEventV2

describe('right service is derived from event', () => {
  const validPaths = [
    ['api.cinode.com/', Service.CINODE, ''],
    ['api.cinode.com/a', Service.CINODE, 'a'],
    ['api.cinode.com/a/b/c?yy=kaa', Service.CINODE, 'a/b/c'],
    ['api.hibob.com/v1/', Service.HIBOB, ''],
    ['api.harvestapp.com/v2/eeh', Service.HARVEST, 'eeh'],
  ]

  for (const [path, expectedService, expectedPath] of validPaths) {
    it(`Path ${path} should resolve to service ${expectedService} with path of ${expectedPath}.`, () => {
      assert.deepEqual(resolveService(gen(path)), [expectedService, expectedPath])
    })
  }

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
    it(`Path ${path} should throw an error.`, () => {
      assert.throws(() => resolveService(gen(path)))
    })
  }
})
