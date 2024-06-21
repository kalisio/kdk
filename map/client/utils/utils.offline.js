import _ from 'lodash'
import localforage from 'localforage'
import { api } from '../../../core/client/index.js'

export async function uncacheView (view, project, kActivity) {
  const views = await localforage.getItem('views') || {}
  delete views[view._id]
  await localforage.setItem('views', views)
  const layers = project.layers
  for (let i = 0; i < layers.length; i++) {
    const layer = (layers[i]._id ? kActivity.getLayerById(layers[i]._id) : kActivity.getLayerByName(layers[i].name))
    await kActivity.setLayerUncached(layer, view._id, { bounds: [[view.south, view.west], [view.north, view.east]] })
  }
}

export async function createOfflineServiceForView (serviceName, view, options = {}) {
  const services = await localforage.getItem('services') || {}

  const service = services[serviceName] || {}
  let views = _.get(service, 'views', [])
  views.push(view)
  _.set(service, 'views', views)
  _.set(service, 'layerService', _.get(options, 'layerService', false))
  _.set(service, 'tiledService', _.get(options, 'tiledService', false))
  _.set(services, serviceName, service)
  await localforage.setItem('services', services)
  
  const offlineService = await api.createOfflineService(serviceName, options)
  return offlineService
}
