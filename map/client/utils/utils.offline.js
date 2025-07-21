import _ from 'lodash'
import configuration from 'config'
import { api, LocalCache } from '../../../core/client/index.js'
import { setLayerCached, setLayerUncached } from './utils.layers.js'

export async function createOfflineServices () {
  const services = await LocalCache.getItem('services')
  if (services) {
    const offlineDocument = await LocalCache.getItem('offlineDocument')
    const repo = api.get('repo')
    const documentHandle = await repo.find(offlineDocument.url)
    const serviceNames = Object.keys(services)
    for (let i = 0; i < serviceNames.length; i++) {
      const serviceName = serviceNames[i]
      const serviceOptions = services[serviceName]
      if (serviceOptions.features) {
        await api.createOfflineFeaturesService(serviceName, { documentHandle, ...serviceOptions })
      } else {
        await api.createOfflineService(serviceName, { documentHandle, ...serviceOptions })
      }
    }
  }
}

export async function cacheView (view, layers, options = {}) {
  // Take care that catalog only returns items of layer types by default
  const catalogQuery = { $or: [{ type: { $nin: ['Context', 'Service', 'Category'] } }, { type: { $in: ['Context', 'Service', 'Category'] } }] }
  // Take care that projects are not populated by default
  const projectQuery = { populate: true }
  // Take care to only retrieve features in bbox
  let featuresQuery = _.pick(view, ['south', 'north', 'west', 'east'])
  // Create automerge document for it if required
  // at the current time any change in query requires a new document
  let offlineDocument = await LocalCache.getItem('offlineDocument')
  if (offlineDocument) {
    // TODO: delete existing document is not yet available
    // await api.getService('offline').remove(offlineDocument.url)
    
    // We need to update the document queries for the new view
    // At the present time only the new bbox needs to be added as we synchronize the whole catalog/projects service
    featuresQuery = (_.has(offlineDocument, 'query.featuresQuery.$or') ?
      { $or: [featuresQuery].concat(_.get(offlineDocument, 'query.featuresQuery.$or')) } :
      { $or: [featuresQuery, _.get(offlineDocument, 'query.featuresQuery')] })
  }
  offlineDocument = await api.getService('offline').create({
    query: {
      catalog: catalogQuery,
      projects: projectQuery,
      features: featuresQuery
    }
  })
  await LocalCache.setItem('offlineDocument', offlineDocument)
  const documentUrl = offlineDocument.url
  const documentHandle = await api.get('repo').find(documentUrl)
  const views = await LocalCache.getItem('views')
  if (views) {
    views[view._id] = options
    await LocalCache.setItem('views', views)
  } else {
    await LocalCache.setItem('views', { [view._id]: options })
  }
  // We need at least catalog/project/features offline services
  // If they already exist this should update internal data
  await api.createOfflineService('catalog', { documentHandle })
  if (options.contextId) {
    await api.createOfflineService('catalog', {
      documentHandle,
      context: options.contextId
    })
  }
  await api.createOfflineService('projects', { documentHandle })
  await api.createOfflineFeaturesService('features', {
    documentHandle,
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

