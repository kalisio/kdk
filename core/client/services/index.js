import LocalSettingsService from './local-settings.service'

export { LocalSettingsService }

export default function init () {
  const api = this

  api.declareService('users')
  api.declareService('authorisations')
  api.declareService('tags', { context: true })
}
