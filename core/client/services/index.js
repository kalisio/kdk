import _ from 'lodash'
import LocalSettingsService from './local-settings.service.js'
import config from 'config'

export { LocalSettingsService }

export default function init () {
  const api = this
  
  // Initialize mandatory services as some singletons might rely on it
  // Optional services should be initialized by the application
  api.createService('users')
  api.createService('authorisations')
  api.createService('import-export')
  api.createService('account', { methods: ['create', 'verifyEmail'] })

  // Setup service for settings edition
  const propertyMapping = _.get(config, 'settings.propertyMapping', {
    shortTime: 'time.format.time.short',
    longTime: 'time.format.time.long',
    shortDate: 'time.format.date.short',
    longDate: 'time.format.date.long',
    shortYear: 'time.format.year.short',
    longYear: 'time.format.year.long',
    timezone: 'time.format.timezone',
    timelineStep: 'time.step',
    timelineInterval: 'time.interval',
    timeseriesSpan: 'timeseries.span',
    timeseriesGroupBy: 'timeseries.groupBy',
    location: 'locationFormat',
    navigator: 'navigator',
    restoreView: 'restore.view',
    restoreLayers: 'restore.layers',
    defaultLength: 'units.default.length',
    defaultAltitude: 'units.default.altitude',
    defaultArea: 'units.default.area',
    defaultVelocity: 'units.default.velocity',
    defaultTemperature: 'units.default.temperature',
    defaultAngle: 'units.default.angle',
    defaultEquivalentDoseRate: 'units.default.equivalentDoseRate',
    defaultNotation: 'units.default.notation',
    defaultPrecision: 'units.default.precision'
  })
  const settingsSchema = _.get(config, 'settings.schema', 'settings.update')
  api.createService('settings', {
    service: LocalSettingsService,
    propertyMapping,
    settingsSchema
  }) // Default options can be overriden from app config
}
