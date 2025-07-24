import _ from 'lodash'
import configuration from 'config'
import { api } from '../api.js'
import { LocalCache } from '../local-cache.js'

export async function createOfflineServices (offlineDocument) {
  // Try to get it from cache if not provided
  if (!offlineDocument) offlineDocument = await getOfflineDocument()
  // Nothing available offline yet
  if (!offlineDocument) return
  const services = await LocalCache.getItem('services')
  if (services) {
    const { documentHandle } = offlineDocument
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

export async function removeOfflineServices () {
  const services = await LocalCache.getItem('services')
  if (services) {
    const serviceNames = Object.keys(services)
    for (let i = 0; i < serviceNames.length; i++) {
      const serviceName = serviceNames[i]
      const serviceOptions = services[serviceName]
      // Do we need to clear data first ?
      //const offlineService = api.getOfflineService(serviceName, serviceOptions.context)
      //await offlineService.remove(null, { query: {} })
      api.removeService(serviceName, serviceOptions.context)
    }
  }
}

export async function createOfflineDocument(query) {
  // Create automerge document for it if required
  // at the current time any change in query requires a new document
  await removeOfflineDocument()
  const offlineDocument = await api.getService('offline').create({ query })
  await LocalCache.setItem('offlineDocument', offlineDocument)
  return offlineDocument
}

export async function getOfflineDocument() {
  const offlineDocument = await LocalCache.getItem('offlineDocument')
  // Nothing available offline yet
  if (!offlineDocument) return
  const repo = api.get('repo')
  offlineDocument.documentHandle = await repo.find(offlineDocument.url)
  return offlineDocument
}

export async function getOfflineDocumentContent(offlineDocument) {
  // Try to get it from cache if not provided
  if (!offlineDocument) offlineDocument = await getOfflineDocument()
  // Nothing available offline yet
  if (offlineDocument) {
    const repo = api.get('repo')
    offlineDocument.documentHandle = await repo.find(offlineDocument.url)
    offlineDocument.content = await offlineDocument.documentHandle.doc()
    // Store metadata separated from actual content
    offlineDocument.metadata = offlineDocument.content.__meta || {}
    // Take care that feathers strip slashes in meta, go from /api to api/
    const apiPath = configuration.apiPath.substr(1) + '/'
    offlineDocument.metadata = _.mapKeys(offlineDocument.metadata, (value, key) => {
      return key.replace(apiPath, '')
    })
    offlineDocument.content = _.omit(offlineDocument.content, ['__meta'])
  }
  return offlineDocument
}

export async function removeOfflineDocument() {
  const offlineDocument = await LocalCache.getItem('offlineDocument')
  if (offlineDocument) {
    // TODO: delete existing document is not yet available
    // await api.getService('offline').remove(offlineDocument.url)
  }
  return offlineDocument
}

export async function addServiceToCache (service, options = {}) {
  const services = await LocalCache.getItem('services') || {}
  services[service] = Object.assign({}, options)
  await LocalCache.setItem('services', services)
  return services
}

export async function removeServiceFromCache (service) {
  const services = await LocalCache.getItem('services') || {}
  const serviceOptions = services[service]
  // Nothing to do if not cached
  if (!serviceOptions) return
  delete services[service]
  if (_.isEmpty(services)) await LocalCache.removeItem('services')
  else await LocalCache.setItem('services', services)
  return serviceOptions
}
