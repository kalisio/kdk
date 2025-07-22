import _ from 'lodash'
import configuration from 'config'
import { api, LocalCache, utils } from '../../../core/client/index.js'
import { setLayerCached, setLayerUncached } from './utils.layers.js'

export async function createOfflineServicesForViews () {
  // We at least need catalog/project/features
  await utils.addServiceToCache('catalog', {})
  await utils.addServiceToCache('projects', {})
  // Specific service option used to manage offline features services
  await utils.addServiceToCache('features', { features: true })
  await utils.createOfflineServices()
}

export async function removeOfflineServicesForViews () {
  await utils.removeOfflineServices()
  await utils.removeServiceFromCache('catalog')
  await utils.removeServiceFromCache('projects')
  await utils.removeServiceFromCache('features')
}

export async function getOfflineDocumentQueryForViews() {
  let views = await LocalCache.getItem('views')
  views = _.values(views)
  // Take care that catalog only returns items of layer types by default
  const catalogQuery = { type: { $exists: true } }
  // Take care that projects are not populated by default
  const projectQuery = { populate: true }
  // Take care to only retrieve features in bbox
  const featuresQuery = { $or: views.map(view => _.pick(view, ['south', 'north', 'west', 'east'])) }
  return {
    catalog: catalogQuery,
    projects: projectQuery,
    features: featuresQuery
  }
}

export async function addViewToCache (view, options = {}) {
  const views = await LocalCache.getItem('views') || {}
  views[view._id] = Object.assign({}, view, options)
  await LocalCache.setItem('views', views)
  return views
}

export async function removeViewFromCache (view) {
  const views = await LocalCache.getItem('views') || {}
  view = views[view._id]
  // Nothing to do if not cached
  if (!view) return
  delete views[view._id]
  if (_.isEmpty(views)) await LocalCache.removeItem('views')
  else await LocalCache.setItem('views', views)
  return view
}

export async function cacheLayersForView (view, layers, options = {}) {
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]
    await setLayerCached(layer, Object.assign({ bounds: [[view.south, view.west], [view.north, view.east]] }, options))
  }
}

export async function uncacheLayersForView (view, layers, options = {}) {
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]
    await setLayerUncached(layer, Object.assign({ bounds: [[view.south, view.west], [view.north, view.east]] }, options))
  }
}

export async function cacheView (view, layers, options = {}) {
  await addViewToCache(view, options)
  // Generate offline document for views in cache
  const query = await getOfflineDocumentQueryForViews()
  await utils.createOfflineDocument(query)
  // Then offline services
  await createOfflineServicesForViews()
  // Then data layer
  await cacheLayersForView(view, layers, options)
}

export async function uncacheView (view, layers, options = {}) {
  // Clear cache but update view as we should retrieve stored options in cache
  view = await removeViewFromCache(view)
  Object.assign(options, view || {})
  // Clear data layer
  await uncacheLayersForView(view, layers, options)
  // FIXME: we should clear catalog/project services as well but it's harder to know if they are still required by some other view.
  // For instance categories are indirectly related to layers by filtering options, a project might contains multiple views so one still cached, etc.
  // So for now we only clear it when no views remain
  const views = await LocalCache.getItem('views')
  if (_.isEmpty(views)) {
    await removeOfflineServicesForViews()
    await utils.removeOfflineDocument()
    await LocalCache.removeItem('views')
    await LocalCache.removeItem('services')
  }
}

