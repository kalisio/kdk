import _ from 'lodash'
import config from 'config'

export function getBrowserLocale () {
  return navigator.language ||
    _.get(navigator, 'languages.0') ||
    navigator.browserLanguage ||
    navigator.userLanguage ||
    navigator.systemLanguage
}

export function getLocale (languageOnly = true) {
  const locale = _.get(config, 'locale.default', getBrowserLocale())
  if (!languageOnly) return locale
  const codes = _.split(locale, '-')
  return _.head(codes)
}

export function getFallbackLocale (languageOnly = true) {
  const locale = _.get(config, 'locale.fallbackLocale', 'en-GB')
  if (!languageOnly) return locale
  const codes = _.split(locale, '-')
  return _.head(codes)
}
