import _ from 'lodash'
import config from 'config'

export function getLocale () {
  const locale =
    navigator.language ||
    navigator.languages[0] ||
    navigator.browserLanguage ||
    navigator.userLanguage ||
    navigator.systemLanguage

  if (locale) {
    // see https://www.ietf.org/rfc/bcp/bcp47.txt
    const languageCodes = _.split(locale, '-')
    if (languageCodes.length > 0) return languageCodes[0]
  }
  // return undefined by default
}

export function getAppLocale () {
  const localeConfig = config.locale || {}
  const localeBrowser = getLocale()
  return localeConfig.default || localeBrowser
}

export function getAppFallbackLocale () {
  return config.fallbackLocale || 'en'
}
