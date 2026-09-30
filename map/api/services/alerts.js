// The alerts service has no equivalent in @kalisio/kdk-map-api yet, kept here locally
// until it is ported over there (see map/api/services/alerts/ and map/api/models/alerts.model.mongodb.js)
import path from 'path'
import makeDebug from 'debug'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modelsPath = path.join(__dirname, '..', 'models')
const servicesPath = path.join(__dirname, '..', 'services')

const debug = makeDebug('kdk:map:services')

export function createAlertsService (options = {}) {
  const app = this

  debug('Creating alerts service with options', options)
  const paginate = { default: 5000, max: 5000 }
  return app.createService('alerts', Object.assign({
    servicesPath,
    modelsPath,
    paginate
  }, options))
}

export function removeAlertsService (options = {}) {
  const app = this
  debug('Removing alerts service with options', options)
  return app.removeService(app.getService('alerts', options.context))
}

// Mirrors the historical auto-configuration/restore behavior from map/api's own service
// registration: restore alerts CRON tasks on startup, and auto-create the service when configured
export async function initializeAlerts (app) {
  app.on('service', async service => {
    if (service.name === 'alerts') {
      // On startup restore alerts CRON tasks if service not disabled
      const alerts = await service.find({ paginate: false })
      alerts.forEach(alert => service.registerAlert(alert, false))
    }
  })
  const alertsConfig = app.get('alerts')
  if (alertsConfig) {
    await createAlertsService.call(app)
  }
}
