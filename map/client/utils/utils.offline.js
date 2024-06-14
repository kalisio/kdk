import _ from 'lodash'
import localforage from 'localforage'
import { api } from '../../../core/client/index.js'

export async function  createOfflineServiceForView (serviceName, view, options = {}) {
  const services = await localforage.getItem('services') || {}

  const service = services[serviceName] || {}
  _.get(service, 'views', []).push(view)
  _.set(service, 'layerService', _.get(options, 'layerService', false))
  _.set(service, 'tiledService', _.get(options, 'tiledService', false))
  _.set(services, serviceName, service)
  await localforage.setItem('services', services)
  
  const offlineService = await api.createOfflineService(serviceName, options)
  return offlineService
}
