import _ from 'lodash'
import localforage from 'localforage'
import { api } from '../../../core/client/index.js'

export async function createOfflineServiceForView (serviceName, view, options = {}) {
  const services = await localforage.getItem('services')
  if (services) {
    if (services[serviceName]) {
      services[serviceName].push(view)
    } else {
      services[serviceName] = [view]
    }
    await localforage.setItem('services', services)
  } else {
    await localforage.setItem('services', { [serviceName]: [view] })
  }
  
  const offlineService = await api.createOfflineService(serviceName, options)
  return offlineService
}
