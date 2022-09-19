import _ from 'lodash'
import path from 'path'
import fs from 'fs-extra'
import zlib from 'zlib'
import request from 'superagent'
import makeDebug from 'debug'
import { fileURLToPath } from 'url'
import * as permissions from '../../../core/common/permissions.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
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
    events: ['features'],
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove', 'heatmap']
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

// Helper to register service and permissions for a layer
export async function createFeaturesServiceForLayer (options) {
  const app = this
  const service = await createFeaturesService.call(app, options)
  // Register default permissions for it
  permissions.defineAbilities.registerHook((subject, can, cannot) => {
    can('service', options.collection)
    can('read', options.collection)
  })
  return service
}

export async function createDefaultCatalogLayers () {
  const app = this
  const catalogService = app.getService('catalog')
  const catalog = app.get('catalog')

  const defaultLayers = catalog ? catalog.layers || [] : []
  const layers = await catalogService.find({ query: {}, paginate: false })
  for (let i = 0; i < defaultLayers.length; i++) {
    const defaultLayer = defaultLayers[i]
    const createdLayer = _.find(layers, { name: defaultLayer.name })
    try {
      if (!createdLayer) {
        app.logger.info('Adding default layer (name = ' + defaultLayer.name + ')')
        await catalogService.create(defaultLayer)
      } else {
        app.logger.info('Updating default layer (name = ' + defaultLayer.name + ')')
        await catalogService.update(createdLayer._id, defaultLayer)
      }
    } catch (error) {
      console.error(error)
    }
    // Check if service(s) are associated to this layer
    let featuresService
    if (defaultLayer.service) {
      featuresService = app.getService(defaultLayer.service)
      // Avoid create it twice as we can share services between different layers
      if (featuresService) continue
      featuresService = await createFeaturesServiceForLayer.call(app, {
        collection: defaultLayer.service,
        ttl: defaultLayer.ttl,
        featureId: defaultLayer.featureId,
        featureIdType: defaultLayer.featureIdType,
        db: app.db.db(defaultLayer.dbName)
      })
    }
    if (defaultLayer.probeService) {
      await createFeaturesServiceForLayer.call(app, {
        collection: defaultLayer.probeService,
        db: app.db.db(defaultLayer.dbName)
      })
    }
    // And if we need to initialize some data as well
    if (!createdLayer && featuresService && (defaultLayer.url || defaultLayer.fileName)) {
      // Cleanup
      try {
        await featuresService.remove(null, { query: {} })
      } catch (error) {
        console.error(error)
      }
      // Data requested from external service ?
      if (defaultLayer.url) {
        try {
          const response = await request.get(defaultLayer.url)
          await featuresService.create(response.body.features)
        } catch (error) {
          console.error(error)
        }
      } else if (path.extname(defaultLayer.fileName) === '.gz') {
        const extractedFileName = path.join(path.dirname(defaultLayer.fileName), path.basename(defaultLayer.fileName, '.gz'))
        fs.createReadStream(defaultLayer.fileName)
          .pipe(zlib.createGunzip())
          .pipe(fs.createWriteStream(extractedFileName))
          .on('close', async () => {
            const geojson = fs.readJsonSync(extractedFileName)
            try {
              await featuresService.create(geojson.features)
            } catch (error) {
              console.error(error)
            }
          })
          .on('error', (error) => { console.log(error) })
      } else {
        const geojson = fs.readJsonSync(defaultLayer.fileName)
        try {
          await featuresService.create(geojson.features)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
}

export default async function () {
  const app = this

  const catalogConfig = app.get('catalog')
  if (catalogConfig) {
    await createCatalogService.call(app)
  }
  const geocoderConfig = app.get('geocoder')
  if (geocoderConfig) {
    await app.createService('geocoder', { servicesPath })
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
    await createAlertsService.call(app)
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
