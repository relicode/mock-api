import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda'
import { HarvestTask, HarvestUser } from '../external-types/utils/types.js'
import createStore, { Store } from '../store.js'
import { ImportantDates } from '../utils/constants.js'
import { parseDate, formatDate } from '../utils/index.js'

const dayZero = formatDate(ImportantDates.DAY_ZERO)
const endOfDays = formatDate(ImportantDates.LAST_DAY)

const createHarvestService = (store: Store = createStore()) => ({
  getUsers: () => store.getState().harvestUsers,
  getUser(harvestUserId: HarvestUser['id']) {
    return this.getUsers().find(({ id }) => id === harvestUserId)
  },
  getTasks: () => store.getState().harvestTasks,
  getTask(harvestTaskId: HarvestTask['id']) {
    return this.getUsers().find(({ id }) => id === harvestTaskId)
  },
  getTimeEntries: (params: APIGatewayProxyEventQueryStringParameters | null) => {
    const entries = store.getState().harvestTimeEntries
    if (!params) return entries
    const from = parseDate(params.from || dayZero)
    const to = parseDate(params.to || endOfDays)

    return entries.filter(({ spent_date }) => {
      if (!spent_date) return false
      const spentDate = new Date(spent_date)
      return new Date(from) <= spentDate && new Date(to) >= spentDate
    })
  },
})

export default createHarvestService
