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
  const settingsService = api.createService('settings', Object.assign({
    service: LocalSettingsService,
    propertyMapping: {
      shortTime: 'timeFormat.time.short',
      longTime: 'timeFormat.time.long',
      shortDate: 'timeFormat.date.short',
      longDate: 'timeFormat.date.long',
      shortYear: 'timeFormat.year.short',
      longYear: 'timeFormat.year.long',
      utc: 'timeFormat.utc',
      location: 'locationFormat',
      restoreView: 'restore.view',
      restoreLayers: 'restore.layers',
      timelineStep: 'timeline.step',
      timeseriesSpan: 'timeseries.span'
    }
  }, config.settings || {})) // Default options can be overriden from app config
  // Restore previous settings if any
  settingsService.restoreSettings()
}
