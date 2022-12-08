import config from 'config'
import logger from 'loglevel'
import { getClientService } from '@kalisio/feathers-s3/client.js'
import { api } from './api.js'
import { i18n } from './i18n.js'
import { Events } from './events.js'
import { Notify } from 'quasar'

export const Storage = {
  initialize () {
    this.useProxy = _.get(config, 'useProxy', false)
  },
  getService (context) {
    // Even when service is not yet declared feathers returns a wraper
    let service = api.getService('storage', context)
    // So we check if it has the right methods to initialize on first call
    if (!service.upload && !service.download) {
      service = getClientService(api, {
        servicePath: api.getServicePath('storage', context).substr(1),
        transport: api.transporter,
        fetch: window.fetch.bind(window),
        useProxy: this.useProxy
      })
      service = api.createService('storage', {
        service,
        context,
        methods: ['create', 'get', 'find', 'remove', 'createMultipartUpload', 'completeMultipartUpload', 'uploadPart', 'putObject']
      })
    }
    return service
  },
  async upload (params) {
    const { file, key, blob, context } = params
    const service = this.getService(context)
    const dismiss = Notify.create({
      message: i18n.t('storage.UPLOADING_FILE', { file }),
      color: 'primary',
      timeout: 0,
      spinner: true
    })
    try {
      const response = await service.upload(key, blob, { expiresIn: 60 })
      dismiss()
      Events.emit('file-uploaded', { name: file, key, type: blob.type, context })
      return response
    } catch (error) {
      dismiss()
      logger.error(`Cannot upload ${key} on ${service.path}`, error)
      throw error
    }
  },
  async download (params) {
    const { file, key, context, asDataUrl } = params
    const service = this.getService(context)
    const dismiss = Notify.create({
      message: i18n.t('storage.DOWNLOADING_FILE', { file }),
      color: 'primary',
      timeout: 0,
      spinner: true
    })
    try {
      const response = await service.download(key, { expiresIn: 60 })
      Events.emit('file-downloaded', { name: file, key, type: response.type, context })
      dismiss()
      // Transform buffer into data url if required
      return new Promise((resolve, reject) => {
        if (asDataUrl) {
          const reader = new FileReader()
          reader.onload = (event) => {
            delete response.buffer
            response.uri = event.target.result
            resolve(response)
          }
          reader.readAsDataURL(new Blob([response.buffer], { type: response.type }))
        } else {
          resolve(response)
        }
      })
    } catch (error) {
      dismiss()
      logger.error(`Cannot download ${key} on ${service.path}`, error)
      throw error
    }
  },
  async getObjectUrl (params) {
    const { key, context } = params
    // Ensure service is created
    const service = this.getService(context)
    // Get proxy route to object storage
    let url = api.getBaseUrl() + config.apiPath
    if (service.context) url += `/${context}`
    url += `/storage-objects/${key}`
    // Add the Authorization header if jwt is defined
    const jwt = await api.get('storage').getItem(config.apiJwt)
    if (jwt) url += '?jwt=' + jwt
    return url
  }
}
