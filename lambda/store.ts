import _ from 'lodash'

import type { MockData } from '../test/generate-mock-data.js'
import defaultInitialData from './initial-data.json'
import { deepCopy } from './utils/index.js'

const initState = (resetInitialData: MockData): MockData => deepCopy(resetInitialData)

export const createStore = (initialData: MockData = defaultInitialData) => ({
  state: initState(initialData),
  getState() {
    return this.state
  },
  reset(resetInitialData: MockData = initialData) {
    this.state = initState(resetInitialData)
  },
})

export default createStore
