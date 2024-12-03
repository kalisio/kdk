import _ from 'lodash'
import config from 'config'
import logger from 'loglevel'
import { getClientService } from '@kalisio/feathers-s3/client.js'
import { api } from './api.js'
import { i18n } from './i18n.js'
import { Events } from './events.js'
import { Notify } from 'quasar'

export const Storage = {
  initialize () {
    this.useProxy = _.get(config, 'storage.useProxy', false)
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
  async upload (options, params) {
    const { file, key, blob, context } = options
    const service = this.getService(context)
    const dismiss = Notify.create({
      type: 'ongoing',
      message: i18n.t('storage.UPLOADING_FILE', { file }),
      timeout: 0
    })
    try {
      const response = await service.upload(key, blob, { expiresIn: 60 }, params)
      dismiss()
      Events.emit('file-uploaded', { name: file, key, type: blob.type, context })
      return response
    } catch (error) {
      dismiss()
      logger.error(`[KDK] Cannot upload ${file} with key '${key}'`, error)
      throw error
    }
  },
  async download (options, params) {
    const { file, key, context, asDataUrl } = options
    const service = this.getService(context)
    const dismiss = Notify.create({
      type: 'ongoing',
      message: i18n.t('storage.DOWNLOADING_FILE', { file }),
      color: 'info',
      timeout: 0
    })
    try {
      const response = await service.download(key, { expiresIn: 60 }, params)
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
      logger.error(`[KDK] Cannot download '${file}' with key '${key}'`, error)
      throw error
    }
  },
  async export (options) {
    const { file, key, context } = options
    const service = this.getService(context)
    const response = await service.create({
      id: key,
      command: 'GetObject',
      expiresIn: 60,
      ResponseContentDisposition: `attachment; filename="${file}"`
    })
    if (response.SignedUrl) {
      let iframe = document.getElementById('export-hidden-frame')
      if (!iframe) {
        iframe = document.createElement('iframe')
        iframe.id = 'export-hidden-frame'
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      }
      iframe.src = response.SignedUrl
    } else {
      logger.error(`[KDK] Cannot export ${file} with key '${key}'`)
    }
  },
  async getObjectUrl (options) {
    const { key, context } = options
    // Ensure service is created
    const service = this.getService(context)
    // Get proxy route to object storage
    let url = api.getConfig('domain') + config.apiPath
    if (service.context) url += `/${context}`
    url += `/storage-objects/${key}`
    // Handle extra query params
    const query = _.get(options, 'query', {})
    // Add the jwt to the query
    const jwt = await api.get('storage').getItem(config.apiJwt)
    query.jwt = jwt
    // Transform the query params
    url += `?${new URLSearchParams(query)}`
    return url
  },
  async getPresignedUrl (options) {
    const { key, context } = options
    // Ensure service is created
    const service = this.getService(context)
    // Get a presigned url
    const { SignedUrl } = await service.create({ id: key, command: 'GetObject', ..._.omit(options, ['key', 'context']) })
    return SignedUrl
  }
}
