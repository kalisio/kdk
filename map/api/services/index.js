import path from 'path'
import makeDebug from 'debug'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const modelsPath = path.join(__dirname, '..', 'models')
const servicesPath = path.join(__dirname, '..', 'services')

const debug = makeDebug('kdk:map:services')

export function createFeaturesService (options = {}) {
  const app = this

  debug('Creating features service with options', options)
  return app.createService(options.collection, Object.assign({
    fileName: 'features',
    servicesPath,
    modelsPath,
    paginate: { default: 5000, max: 5000 },
    // FIXME: no real-time events for now since we create big batches,
    // does not seem to be sufficient also require a hook (see https://github.com/feathersjs/feathers/issues/922)
    events: ['features']
  }, options))
}

export function removeFeaturesService (options) {
  // TODO
}

export function createCatalogService (options = {}) {
  const app = this

  debug('Creating catalog service with options', options)
  return app.createService('catalog', Object.assign({
    servicesPath,
    modelsPath,
    paginate: { default: 1000, max: 1000 }
  }, options))
}

export function removeCatalogService (options) {
  // TODO
}

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

export function removeAlertsService (options) {
  // TODO
}

export default async function () {
  const app = this

  const catalogConfig = app.get('catalog')
  if (catalogConfig) {
    createCatalogService.call(app)
  }
  const geocoderConfig = app.get('geocoder')
  if (geocoderConfig) {
    app.createService('geocoder', { servicesPath })
  }
  // Add app-specific hooks to required services
  app.on('service', async service => {
    if (service.name === 'alerts') {
      // On startup restore alerts CRON tasks if service not disabled
      const alerts = await service.find({ paginate: false })
      alerts.forEach(alert => service.registerAlert(alert, false))
    }
  })
  const alertsConfig = app.get('alerts')
  if (alertsConfig) {
    createAlertsService.call(app)
  }

  /*
  app.createService('daptiles', Object.assign({
    servicesPath,
    middlewares: {
      after: [
        (req, res, next) => {
          const buffers = _.get(res.data, 'buffers')
          if (buffers) {
            const binary = Buffer.concat(buffers)
            res.set({
              'Content-Type': 'application/octet-stream'
            }).status(200)
            // for (const buf of buffers) {
            //   // res.send(buf)
            //   res.write(buf)
            // }
            // res.end()
            res.end(binary)
          }
          next()
        }
      ]
    }
  }))
  */
}
