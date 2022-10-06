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
      uploadUrl = api.getBaseUrl() + config.apiPath + '/' + this.proxy
      uploadOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentBuffer: Array.from(new Uint8Array(buffer)),
          contentType: type,
          signedUrl
        })
      }
    }
    const dismiss = Notify.create({
      icon: 'las la-hourglass-half',
      message: i18n.t('storage.UPLOADING_FILE', { file }),
      color: 'primary',
      timeout: 0,
      spinner: true
    })
    const uploadResponse = await window.fetch(uploadUrl, uploadOptions)
    dismiss()
    if (uploadResponse.ok) {
      Events.emit('file-uploaded', { file, key })
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
    }
    const dismiss = this.$q.notify({
      icon: 'las la-hourglass-half',
      message: this.$t('storage.UPLOADING_FILE', { file }),
      color: 'primary',
      timeout: 0,
      spinner: true
    })
    const downloadResponse = window.fetch(downloadUrl, downloadOptions)
    dismiss()
    if (downloadResponse.ok) {
      Events.emit('file-downloaded', { file, key })
    }
    return downloadResponse
  }
}
