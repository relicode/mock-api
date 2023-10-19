import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

import { resolveService } from './utils'

const generateEventForServiceResolution = (path: string) =>
  ({
    requestContext: {
      http: {
        path,
      },
    },
  }) as APIGatewayProxyEventV2

describe('utils work as expected', () => {
  it('should work', () => {
    assert.equal(resolveService(generateEventForServiceResolution('/api.cinode.com/')), 'cinode')
    assert.equal(resolveService(generateEventForServiceResolution('/api.cinode.com/a')), 'cinode')
    assert.equal(resolveService(generateEventForServiceResolution('/api.cinode.com/a/b/c?yy=kaa')), 'cinode')
    assert.equal(resolveService(generateEventForServiceResolution('/api.harvestapp.com/v2/eeh')), 'harvest')
    assert.equal(resolveService(generateEventForServiceResolution('/api.hibob.com/v1/')), 'hibob')

    assert.throws(() => resolveService(generateEventForServiceResolution('api.cinode.com/')))
    assert.throws(() => resolveService(generateEventForServiceResolution('/https://api.cinode.com/')))
    assert.throws(() => resolveService(generateEventForServiceResolution('https://api.cinode.com/')))
    assert.throws(() => resolveService(generateEventForServiceResolution('/api.harvestapp.com/v1/')))
  })
})
