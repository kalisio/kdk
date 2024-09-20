import _ from 'lodash'
import localforage from 'localforage'
import { api } from '../../../core/client/index.js'
import { setLayerCached, setLayerUncached } from './utils.layers.js'

export async function cacheView (view, layers, options = {}) {
  const views = await localforage.getItem('views')
  if (views) {
    views[view._id] = true
    await localforage.setItem('views', views)
  } else {
    await localforage.setItem('views', { [view._id]: true })
  }
  // We need at least catalog/project offline services
  // Take care that catalog only returns items of layer types by default
  const catalogQueries = [{ type: { $nin: ['Context', 'Service', 'Category'] } }, { type: { $in: ['Context', 'Service', 'Category'] } }]
  if (!api.getOfflineService('catalog')) {
    await api.createOfflineServiceForView('catalog', view._id, {
      baseQueries: catalogQueries
    })
    if (options.contextId) {
      await api.createOfflineServiceForView('catalog', view._id, {
        baseQueries: catalogQueries,
        context: options.contextId
      })
    }
  }
  // Take care that projects are not populated by default
  if (!api.getOfflineService('projects')) {
    const projectQuery = { populate: true }
    await api.createOfflineServiceForView('projects', view._id, {
      baseQuery: projectQuery
    })
  }
  // Then data layer
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]
    await setLayerCached(layer, view._id, Object.assign({ bounds: [[view.south, view.west], [view.north, view.east]] }, options))
  }
}

export async function uncacheView (view, layers) {
  const views = await localforage.getItem('views') || {}
  delete views[view._id]
  await localforage.setItem('views', views)
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]
    await setLayerUncached(layer, view._id, { bounds: [[view.south, view.west], [view.north, view.east]] })
  }
}

