/* eslint-disable no-process-env */

import chalk from 'chalk'
import jsonServer from 'json-server'
import { resolve } from 'node:path'

import authorizationMiddleware from './authorization-middleware.js'
import { createLogger, getConfig } from './utils.js'
import { loadJsonData } from './generate-mock-data.js'

const { underline, bold } = chalk

const logger = createLogger('index')

const server = jsonServer.create()

server.use(jsonServer.defaults())

const config = await getConfig()
const { dataPath, port, useAuth } = config
logger.table(config)

if (useAuth) server.use(authorizationMiddleware)

server.use(
  jsonServer.rewriter({
    '/harvest/users': '/harvestUsers',
    '/harvest/time_entries': '/harvestTimeEntries',

    /*
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id',
    */
  }),
)

server.use(jsonServer.router(await loadJsonData()))

server.listen(port, () => {
  logger.success(
    `JSON Server is running at ${underline(`http://localhost:${port}`)} using data from ${bold(resolve(dataPath))}.`,
  )
})
