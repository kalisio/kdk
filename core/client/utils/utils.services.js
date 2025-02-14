import { api } from '../api.js'

// Bind listeners to service events and store it in the returned object
export function listenToServiceEvents (service, {
  context = null, created = null, updated = null, patched = null, removed = null, all = null,
} = {}, listeners) { // Previous listeners if any
  // Check if already registered
  unlistenToServiceEvents(listeners)
  if (typeof service === 'string') service = api.getService(service, context)
  if (service) {
    if (created || all) service.on('created', created || all)
    if (updated || all) service.on('updated', updated || all)
    if (patched || all) service.on('patched', patched || all)
    if (removed || all) service.on('removed', removed || all)
  }
  // We keep track of service as it might change between listen/unlisten (typically when going offline)
  return { service, created, updated, patched, removed, all }
}

// Unbind previously stored listeners from service events
export function unlistenToServiceEvents (listeners) {
  if (!listeners) return
  const { service, created, updated, patched, removed, all } = listeners
  if (created || all) service.off('created', created || all)
  if (updated || all) service.off('updated', updated || all)
  if (patched || all) service.off('patched', patched || all)
  if (removed || all) service.off('removed', removed || all)
}
