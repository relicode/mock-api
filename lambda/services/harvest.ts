import { HarvestUser } from '../external-types/utils/types.js'
import createStore, { Store } from '../store.js'

const createHarvestService = (store: Store = createStore()) => ({
  getUsers: () => store.getState().harvestUsers,
  getUser(harvestUserId: HarvestUser['id']) {
    return this.getUsers().find(({ id }) => id === harvestUserId)
  },
})

export default createHarvestService
