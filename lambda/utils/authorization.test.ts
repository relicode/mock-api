import { strict as assert } from 'node:assert'
import test from 'node:test'

import { checkAuthorization } from '.'

test('authorization', async (t) => {
  await t.test('checkAuthorization is a function', () => {
    assert.equal(typeof checkAuthorization, 'function')
  })

  await t.test('checkAuthorization is still a function', () => {
    assert.equal(typeof checkAuthorization, 'function')
  })
})
