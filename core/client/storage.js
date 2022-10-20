import config from 'config'
import _ from 'lodash'
import { api } from './api.js'
import { i18n } from './i18n.js'
import { Events } from './events.js'
import { Notify } from 'quasar'

export const Storage = {
  initialize () {
    this.proxy = _.get(config, 'storage.proxy')
  },
  async upload (params) {
    const { file, key, buffer, type } = params
    const contextId = params.context
    // First create the signed url
    const storageService = api.getService('storage', contextId)
    const createResponse = await storageService.create({ id: key, expiresIn: 60 })
    const signedUrl = createResponse.signedUrl
    // Configure the upload request
    let uploadUrl = signedUrl
    let uploadOptions = {
      method: 'PUT',
      body: buffer,
      headers: {
        'Content-Type': type,
        'Content-Length': buffer.length
      }
    }
    if (this.proxy) {
      const headers = { 'Content-Type': 'application/json' }
      // Add the Authorization header if jwt is defined
      const jwt = await api.get('storage').getItem(config.apiJwt)
      if (jwt) headers.Authorization = 'Bearer ' + jwt
      uploadUrl = api.getBaseUrl() + config.apiPath + '/' + this.proxy
      uploadOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: file,
          contextId,
          contentBuffer: Array.from(new Uint8Array(buffer)),
          contentType: type,
          signedUrl
        })
      }
    }
    const dismiss = Notify.create({
      message: i18n.t('storage.UPLOADING_FILE', { file }),
      color: 'primary',
      timeout: 0,
      spinner: true
    })
    const uploadResponse = await window.fetch(uploadUrl, uploadOptions)
    dismiss()
    if (uploadResponse.ok) {
      Events.emit('file-uploaded', { name: file, key, type, context: contextId })
    }
    return uploadResponse
  },
  async download (params) {
    const { file, key, type } = params
    const contextId = params.context
    const storageService = api.get('storage', contextId)
    const getResponse = await storageService.get({ id: key, expiresIn: 60 })
    const signedUrl = getResponse.signedUrl
    // Configure the download request
    let downloadUrl = signedUrl
    const downloadOptions = {
      method: 'GET',
      headers: {
        'Content-Type': type
      }
    }
    if (this.proxy) {
      downloadUrl = api.getBaseUrl() + config.apiPath + '/' + this.proxy + '?signedUrl=' + signedUrl
      // Add the Authorization header if jwt is defined
      const jwt = await api.get('storage').getItem(config.apiJwt)
      if (jwt) downloadOptions.headers.Authorization = 'Bearer ' + jwt
    }
    const dismiss = this.$q.notify({
      message: this.$t('storage.UPLOADING_FILE', { file }),
      color: 'primary',
      timeout: 0,
      spinner: true
    })
    const downloadResponse = window.fetch(downloadUrl, downloadOptions)
    dismiss()
    if (downloadResponse.ok) {
      Events.emit('file-downloaded', { name: file, key, type, context: contextId })
    }
    return downloadResponse
  }
}
