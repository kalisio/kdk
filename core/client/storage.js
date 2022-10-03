import config from 'config'
import { api } from './api.js'

export async function upload (buffer, key, contextId) {
  // First create the signed url
  const storageService = api.getService('storage', contextId)
  const response = await storageService.create({ id: key, Expires: 60 })
  // Upload the buffer using the signed url
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ signedUrl: response.signedUrl, buffer })
  }
  const uploadUrl = api.getBaseUrl() + config.apiPath + '/upload'
  return window.fetch(uploadUrl, requestOptions)
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
  return window.fetch(downloadUrl, requestOptions)
}
