import LocalSettingsService from './local-settings.service'

export { LocalSettingsService }

export default function init () {
  const api = this

  api.declareService('users')
  api.declareService('authorisations')
  api.declareService('tags', { context: true })
  api.declareService('organisations')
  api.declareService('members', { context: true })
  api.declareService('groups', { context: true })
  api.declareService('storage', { context: true })
  api.declareService('account')
  api.declareService('devices')
}
