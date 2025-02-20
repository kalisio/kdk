import { api } from '../api.js'

// Bind listeners to service events and store it in the returned object
export function listenToServiceEvents (service, {
  context = null, created = null, updated = null, patched = null, removed = null, all = null,
} = {}, listeners) { // Previous listeners if any
  // Check if already registered
  unlistenToServiceEvents(listeners)
  if (typeof service === 'string') service = api.getService(service, context)
  // Generate listeners having the event type as parameter, can be useful if registering the same listener for multiple events.
  const generateListenerForEvent = (listener, event) => (listener ? (object) => listener(object, event) : null)
  if (service) {
    if (created || all) {
      created = generateListenerForEvent(created || all, 'created')
      service.on('created', created)
    }
    if (updated || all) {
      updated = generateListenerForEvent(updated || all, 'updated')
      service.on('updated', updated)
    }
    if (patched || all) {
      patched = generateListenerForEvent(patched || all, 'patched')
      service.on('patched', patched)
    }
    if (removed || all) {
      removed = generateListenerForEvent(removed || all, 'removed')
      service.on('removed', removed)
    }
  }
  // We keep track of service as it might change between listen/unlisten (typically when going offline)
  return { service, created, updated, patched, removed }
}

// Unbind previously stored listeners from service events
export function unlistenToServiceEvents (listeners) {
  if (!listeners) return
  const { service, created, updated, patched, removed } = listeners
  if (created ) service.off('created', created)
  if (updated) service.off('updated', updated)
  if (patched) service.off('patched', patched)
  if (removed) service.off('removed', removed)
}
