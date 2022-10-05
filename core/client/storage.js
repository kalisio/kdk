import config from 'config'
import { api } from './api.js'
import { i18n } from './i18n.js'
import { Events } from './events.js'
import { Notify } from 'quasar'

export async function upload (buffer, key, contextId) {
  // First create the signed url
  const storageService = api.getService('storage', contextId)
  const createResponse = await storageService.create({ id: key, Expires: 60 })
  // Upload the buffer using the signed url
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signedUrl: createResponse.signedUrl, buffer })
  }
  const uploadUrl = api.getBaseUrl() + config.apiPath + '/upload'
  const dismiss = Notify.create({
    group: 'upload',
    icon: 'las la-hourglass-half',
    message: i18n.t('storage.UPLOADING_FILE'),
    color: 'primary',
    timeout: 0,
    spinner: true
  })
  const fetchResponse = await window.fetch(uploadUrl, requestOptions)
  console.log(fetchResponse)
  dismiss()
  if (!fetchResponse.ok) {
    Events.emit('error', { message: i18n.t('errors.' + fetchResponse.status) })
  }
  return fetchResponse
}

export async function download (key, contextId) {
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
      message: this.$t('storage.UPLOADING_FILE'),
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
