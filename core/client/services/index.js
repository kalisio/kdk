import LocalSettingsService from './local-settings.service'
import config from 'config'

export { LocalSettingsService }

export default function init () {
  const api = this

  // Declare the built-in services, others are optional
  api.declareService('users')
  api.declareService('authorisations')
  api.declareService('tags', { context: true })
  api.declareService('organisations')
  api.declareService('members', { context: true })
  api.declareService('groups', { context: true })
  api.declareService('storage', { context: true })
  api.declareService('account')
  api.declareService('devices')

  // Setup service for settings edition
  api.createService('settings', Object.assign({
    service: LocalSettingsService,
    propertyMapping: {
      shortTime: 'time.format.time.short',
      longTime: 'time.format.time.long',
      shortDate: 'time.format.date.short',
      longDate: 'time.format.date.long',
      shortYear: 'time.format.year.short',
      longYear: 'time.format.year.long',
      utc: 'time.format.utc',
      timelineStep: 'time.step',
      timeseriesSpan: 'timeseries.span',
      location: 'locationFormat',
      restoreView: 'restore.view',
      restoreLayers: 'restore.layers'
    }
  }, config.settings || {})) // Default options can be overriden from app config
}
