import { ClientFunction } from 'testcafe'
import Screens from './screens'
import Layout from './layout'
import SideNav from './side-nav'

export { Screens }
export { Layout }
export { SideNav }

// Access store
export const getFromStore = ClientFunction((path) => window.$store.get(path))

// Access Feathers services
export const api = {
  logout: ClientFunction(() => window.$api.logout()),
  get: ClientFunction((service, id) => window.$api.getService(service).get(id)),
  find: ClientFunction((service, params) => window.$api.getService(service).find(params)),
  remove: ClientFunction((service, id) => window.$api.getService(service).remove(id))
}

// Acces window size
export const getWindowInnerWidth = ClientFunction(() => window.innerWidth)
export const getWindowInnerHeight = ClientFunction(() => window.innerHeight)

// Access routes
const baseUrl = process.env.APP_URL || process.env.CLIENT_PORT ||
  (process.env.NODE_ENV === 'production' ? 'http://localhost:8081' : 'http://localhost:8080')
export const getUrl = (path) => path ? baseUrl + '/#/' + path : baseUrl
export const goBack = ClientFunction(() => window.history.back())

// Access console errors
export const checkNoClientError = async (test) => {
  const { error } = await test.getBrowserConsoleMessages()
  await test.expect(error[0]).notOk()
}
export const checkClientError = async (test) => {
  const { error } = await test.getBrowserConsoleMessages()
  await test.expect(error[0]).ok()
}
