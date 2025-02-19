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
  const service = app.createService(options.collection, Object.assign({
    modelName: 'features',
    servicesPath,
    modelsPath,
    paginate: { default: 5000, max: 5000 },
    // FIXME: no real-time events for now since we create big batches,
    // does not seem to be sufficient also require a hook (see https://github.com/feathersjs/feathers/issues/922)
    events: ['features'],
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove', 'heatmap', 'formatGeoJSON']
  }, options))
  // As a features service can be created dynamically register default permissions for it
  permissions.defineAbilities.registerHook((subject, can, cannot) => {
    can('service', options.collection)
    can('read', options.collection)
  })
  // We then need to update abilities cache
  const authorisationService = app.getService('authorisations')
  if (authorisationService) authorisationService.clearAbilities()
  return service
}

export function removeFeaturesService (options = {}) {
  const app = this
  debug('Removing features service with options', options)
  return app.removeService(app.getService(options.collection, options.context))
}

export function createCatalogService (options = {}) {
  const app = this

  // Read default categories/sublegends config, which can be overriden by options
  const catalogConfig = app.get('catalog') || {}
  const categories = catalogConfig.categories
  const sublegends = catalogConfig.sublegends

  debug('Creating catalog service with options', options)
  return app.createService('catalog', Object.assign({
    servicesPath,
    modelsPath,
    paginate: { default: 1000, max: 1000 },
    categories,
    sublegends
  }, options))
}

export function removeCatalogService (options = {}) {
  const app = this
  debug('Removing catalog service with options', options)
  return app.removeService(app.getService('catalog', options.context))
}

export async function createProjectsService (options = {}) {
  const app = this

  debug('Creating projects service with options', options)
  await app.createService('projects', Object.assign({
    servicesPath,
    modelsPath,
    paginate: { default: 20, max: 5000 }
  }, options))
}

export function removeProjectsService (options = {}) {
  const app = this
  debug('Removing projects service with options', options)
  return app.removeService(app.getService('projects', options.context))
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

export function removeAlertsService (options = {}) {
  const app = this
  debug('Removing alerts service with options', options)
  return app.removeService(app.getService('alerts', options.context))
}

// Helper to register service and permissions for a layer
export async function createFeaturesServiceForLayer (layer, context) {
  const app = this
  // Check if service(s) are associated to this layer
  // Avoid create it twice as we can share services between different layers
  let probeService = (layer.probeService ? app.getService(layer.probeService, context) : null)
  if (layer.probeService && !probeService) {
    probeService = await createFeaturesService.call(app, Object.assign({
      collection: layer.probeService,
      context,
      db: app.db.db(layer.dbName)
    }, _.pick(layer, ['featureLabel', 'simplifyResult', 'skipEvents', 'simplifyEvents'])))
  }
  let service = (layer.service ? app.getService(layer.service, context) : null)
  if (layer.service && !service) {
    service = await createFeaturesService.call(app, Object.assign({
      collection: layer.service,
      context,
      db: app.db.db(layer.dbName)
    }, _.pick(layer, ['ttl', 'featureId', 'featureIdType', 'featureLabel', 'variables', 'simplifyResult', 'skipEvents', 'simplifyEvents'])))
  }
  return service || probeService
}
// Helper to unregister service for a layer
export async function removeFeaturesServiceForLayer (layer, context) {
  const app = this
  // Check if service(s) are associated to this layer and remove it
  let probeService = (layer.probeService ? app.getService(layer.probeService, context) : null)
  if (layer.probeService && probeService) {
    probeService = await removeFeaturesService.call(app, { collection: layer.probeService, context })
  }
  let service = (layer.service ? app.getService(layer.service, context) : null)
  if (layer.service && service) {
    service = await removeFeaturesService.call(app, { collection: layer.service, context })
  }
  return service || probeService
}
// Helper to create features from source for a layer
export async function createFeaturesForLayer (features, layer, options = {}) {
  const app = this
  const featuresService = app.getService(layer.service, options.context)
  if (options && options.filter) features = await options.filter(features, layer, app)
  if (!features.length) return
  // The unordered option ensure a faster processing when inserting multiple items
  // and that after an error remaining write operations in the queue will continue anyway
  await featuresService.create(features, { mongodb: { ordered: false } })
}

// Read default layers configured and create, if not found in DB, or update it accordingly
// Will also clean and feed default data (ie features) if provided as input file
export async function createDefaultCatalogLayers (options = {}) {
  const app = this
  const catalogService = app.getService('catalog', options.context)
  const catalog = app.get('catalog')

  const defaultLayers = catalog ? catalog.layers || [] : []
  const layers = await catalogService.find({ query: {}, paginate: false })
  for (let i = 0; i < defaultLayers.length; i++) {
    const defaultLayer = defaultLayers[i]
    const createdLayer = _.find(layers, { name: defaultLayer.name })
    let featuresService
    try {
      // Create or update the layer removing any option only used to manage layer setup
      if (!createdLayer) {
        app.logger.info('Adding default layer (name = ' + defaultLayer.name + ')')
        await catalogService.create(_.omit(defaultLayer, ['filter']))
      } else {
        app.logger.info('Updating default layer (name = ' + defaultLayer.name + ')')
        await catalogService.update(createdLayer._id, _.omit(defaultLayer, ['filter']))
      }
      // Check if service(s) are associated to this layer and create the related service(s) if required
      if (defaultLayer.service) {
        featuresService = app.getService(defaultLayer.service)
        // Avoid create it twice as we can share services between different layers
        featuresService = await createFeaturesServiceForLayer.call(app, defaultLayer, options.context)
      }
    } catch (error) {
      console.error(error)
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
          await createFeaturesForLayer.call(app, response.body.features, defaultLayer, options)
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
              await createFeaturesForLayer.call(app, geojson.features, defaultLayer, options)
            } catch (error) {
              console.error(error)
            }
          })
          .on('error', (error) => { console.log(error) })
      } else {
        const geojson = fs.readJsonSync(defaultLayer.fileName)
        try {
          await createFeaturesForLayer.call(app, geojson.features, defaultLayer, options)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
}

// Create the required features services for layers found in catalog
export async function createCatalogFeaturesServices (options = {}) {
  const app = this
  const catalogService = app.getService('catalog', options.context)
  const layers = await catalogService.find({ query: { service: { $exists: true } }, paginate: false, $select: ['service'] })
  for (let i = 0; i < layers.length; i++) {
    await createFeaturesServiceForLayer.call(app, layers[i], options.context)
  }
}

export default async function () {
  const app = this

  const catalogConfig = app.get('catalog')
  if (catalogConfig) {
    await createCatalogService.call(app)
  }
  const projectsConfig = app.get('projects')
  if (projectsConfig) {
    await createProjectsService.call(app)
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
