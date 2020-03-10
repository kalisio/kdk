import _ from 'lodash'
import path from 'path'
import makeDebug from 'debug'
const modelsPath = path.join(__dirname, '..', 'models')
const servicesPath = path.join(__dirname, '..', 'services')

const debug = makeDebug('kalisio:kMap:services')

export function createFeaturesService (options = {}) {
  const app = this

  debug('Creating features service with options', options)
  return app.createService(options.collection, Object.assign({
    fileName: 'features',
    servicesPath,
    modelsPath,
    paginate: { default: 5000, max: 10000 },
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
    paginate: { default: 100, max: 100 }
  }, options))
}

export function removeCatalogService (options) {
  // TODO
}

export function createAlertsService (options = {}) {
  const app = this

  debug('Creating alerts service with options', options)
  const paginate = { default: 5000, max: 10000 }
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

  const catalogOptions = app.getServiceOptions('catalog')
  if (!_.get(catalogOptions.disabled)) {
    createCatalogService.call(app, catalogOptions)
  }
  const geocoderOptions = app.getServiceOptions('geocoder')
  if (!_.get(geocoderOptions.disabled)) {
    app.createService('geocoder', Object.assign({ servicesPath }, geocoderOptions))
  }
  // Add app-specific hooks to required services
  app.on('service', async service => {
    if (service.name === 'alerts') {
      // On startup restore alerts CRON tasks if service not disabled
      if (!service.memory) {
        const alerts = await service.find({ paginate: false })
        alerts.forEach(alert => service.registerAlert(alert, false))
      }
    }
  })
  const alertsOptions = app.getServiceOptions('alerts')
  if (!_.get(alertsOptions.disabled)) {
    createAlertsService.call(app, alertsOptions)
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
