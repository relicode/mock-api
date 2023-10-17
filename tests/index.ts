import axios from 'axios'
import * as url from 'url'
import { resolve } from 'path'
import { createLogger, jsonHeaders, loadJsonData } from '../src/utils.js'

// const __filename = url.fileURLToPath(import.meta.url)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const data = await loadJsonData(resolve(__dirname, 'test-events', 'get.json'))
// const postData = await loadJsonData(resolve(__dirname, 'test-events', 'post'))

const logger = createLogger('test-runner')

const api = axios.create({
  baseURL: 'http://localhost:9000/2015-03-31/functions/function/invocations',
  headers: jsonHeaders,
})

const resp = await api.get('', { data })
logger.log(resp.headers)
console.log(resp.data)
logger.log(JSON.parse(resp.data.body))
