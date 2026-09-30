import kdkMapApi from '@kalisio/kdk-map-api'
import { createAlertsService, removeAlertsService, initializeAlerts } from './services/alerts.js'

export * from '@kalisio/kdk-map-api'
export { createAlertsService, removeAlertsService }

// The alerts service has no equivalent in @kalisio/kdk-map-api yet (see services/alerts.js),
// so it's initialized here alongside the package's own service registration
export default async function init () {
  const app = this
  await kdkMapApi.call(app)
  await initializeAlerts(app)
}
