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
    const { file, key, buffer } = params
    const contextId = params.context
    // First create the signed url
    const storageService = api.getService('storage', contextId)
    const createResponse = await storageService.create({ id: key, expiresIn: 60 })
    const signedUrl = createResponse.signedUrl
    // Upload the buffer using the signed url
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: this.proxy ? JSON.stringify({ signedUrl, buffer }) : buffer
    }
    const uploadUrl = this.proxy ? api.getBaseUrl() + config.apiPath + '/' + this.proxy : signedUrl
    const dismiss = Notify.create({
      group: 'upload',
      icon: 'las la-hourglass-half',
      message: i18n.t('storage.UPLOADING_FILE', { file }),
      color: 'primary',
      timeout: 0,
      spinner: true
    })
    const fetchResponse = await window.fetch(uploadUrl, requestOptions)
    dismiss()
    if (fetchResponse.ok) {
      Events.emit('file-uploaded', { file, key })
    }
    return fetchResponse
  },
  async download (params) {
    const { file, key } = params
    const contextId = params.context
    const storageService = api.get('storage', contextId)
    const response = await storageService.get({ id: key, Expires: 60 })
    // Downlaod the file using the signed url
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signedUrl: response.signedUrl })
    }
    const downloadUrl = api.getBaseUrl() + config.apiPath + '/download'
    let dismiss = null
    try {
      dismiss = this.$q.notify({
        group: 'upload',
        icon: 'las la-hourglass-half',
        message: this.$t('storage.UPLOADING_FILE', { file }),
        color: 'primary',
        timeout: 0,
        spinner: true
      })
      const response = window.fetch(downloadUrl, requestOptions)
      dismiss()
      if (!response.ok) {
        Events.emit('error', { message: this.$t('errors.' + response.status) })
      }
    } catch (error) {
      // Network error
      dismiss()
      Events.emit('error', { message: this.$t('errors.NETWORK_ERROR') })
    }
  }
}
