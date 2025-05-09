import _ from 'lodash'
import { api, LocalCache } from '../../../core/client/index.js'
import { setLayerCached, setLayerUncached } from './utils.layers.js'

export async function createOfflineServices () {
  const services = await LocalCache.getItem('services')
  if (services) {
    const serviceNames = Object.keys(services)
    for (let i = 0; i < serviceNames.length; i++) {
      const serviceName = serviceNames[i]
      const serviceOptions = services[serviceName]
      if (serviceOptions.features) {
        await api.createOfflineFeaturesService(serviceName, { snapshot: false, ...serviceOptions })
      } else {
        await api.createOfflineService(serviceName, { snapshot: false, ...serviceOptions })
      }
    }
  }
}

export async function cacheView (view, layers, options = {}) {
  const views = await LocalCache.getItem('views')
  if (views) {
    views[view._id] = options
    await LocalCache.setItem('views', views)
  } else {
    await LocalCache.setItem('views', { [view._id]: options })
  }
  // We need at least catalog/project/features offline services
  // If they already exist this will update internal data

  // Take care that catalog only returns items of layer types by default
  const catalogQueries = [{ type: { $nin: ['Context', 'Service', 'Category'] } }, { type: { $in: ['Context', 'Service', 'Category'] } }]
  await api.createOfflineService('catalog', {
    baseQueries: catalogQueries
  })
  if (options.contextId) {
    await api.createOfflineService('catalog', {
      baseQueries: catalogQueries,
      context: options.contextId
    })
  }
  // Take care that projects are not populated by default
  const projectQuery = { populate: true }
  await api.createOfflineService('projects', {
    baseQuery: projectQuery
  })
  await api.createOfflineFeaturesService('features', {
    context: options.contextId
  })
  // Then data layer
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]
    await setLayerCached(layer, Object.assign({ bounds: [[view.south, view.west], [view.north, view.east]] }, options))
  }
}

export async function uncacheView (view, layers, options = {}) {
  const views = await LocalCache.getItem('views') || {}
  // Nothing to do if not cached
  if (!views[view._id]) return
  // Retrieve stored options in cache
  Object.assign(options, views[view._id] || {})
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]
    await setLayerUncached(layer, Object.assign({ bounds: [[view.south, view.west], [view.north, view.east]] }, options))
  }
  delete views[view._id]
  // FIXME: we should clear catalog/project services as well but it's harder to know if they are still required by some other view.
  // For instance categories are indirectly related to layers by filtering options, a project might contains multiple views so one still cached, etc.
  // So for now we only clear it when no views remain
  if (_.isEmpty(views)) {
    await LocalCache.removeItem('views')
    const services = await LocalCache.getItem('services') || {}
    const serviceNames = Object.keys(services)
    for (let i = 0; i < serviceNames.length; i++) {
      const serviceName = serviceNames[i]
      const serviceOptions = services[serviceName]
      const offlineService = api.getOfflineService(serviceName, serviceOptions.context)
      await offlineService.remove(null, { query: {} })
      api.removeService(serviceName, serviceOptions.context)
    }
    await LocalCache.removeItem('services')
  }
  else {
    await LocalCache.setItem('views', views)
  }
}

