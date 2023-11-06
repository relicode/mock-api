import _ from 'lodash'

import type { MockData } from '../test/generate-mock-data.js'
import defaultInitialData from './initial-data.json'
import { deepCopy } from './utils/index.js'

const initState = (resetInitialData: MockData): MockData => deepCopy(resetInitialData)

export const createStore = (initialData: MockData = defaultInitialData) => {
  let state = initState(initialData)

  return {
    getState: (): MockData => state,
    resetState: (resetInitialData: MockData = initialData): MockData => {
      state = initState(resetInitialData)
      return state
    },
  }
}

export type Store = ReturnType<typeof createStore>

export const cloneStore = (store: Store): Store => createStore(store.getState())

export default createStore
