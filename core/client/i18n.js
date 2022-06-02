import _ from 'lodash'
import logger from 'loglevel'
import { createI18n } from 'vue-i18n'
import { getAppLocale, getAppFallbackLocale } from './utils.js'

// Helper function to load a translation file
// @i18n alias shoud be added in the quasar.config build section
async function loadTranslationBundles (bundles, locale, fallbackLocale) {
  try {
    const translations = {}
    translations[locale] = {}
    translations[fallbackLocale] = {}
    for (let i = 0; i < bundles.length; i++) {
      const localeTranslationsModule = await import(`@i18n/${bundles[i]}_${locale}.json`)
      _.merge(translations[locale], localeTranslationsModule.default)
      const fallbackTranslationModule = await import(`@i18n/${bundles[i]}_${fallbackLocale}.json`)
      _.merge(translations[fallbackLocale], fallbackTranslationModule.default)
    }
    return translations
  } catch (error) {
    logger.error(error)
  }
}

export const i18n = {
  async initialize (app, bundles) {
    // Define the locale to be used
    const fallbackLocale = getAppFallbackLocale()
    const locale = getAppLocale()
    // Create i18n instance using the translation bundles
    this.i18n = createI18n({
      locale,
      fallbackLocale,
      messages: await loadTranslationBundles(bundles, locale, fallbackLocale),
      silentFallbackWarn: true
    })
    app.use(this.i18n)
  },
  get () {
    return this.i18n.global
  },
  t (key) {
    return this.i18n.global.t(key)
  }
}
