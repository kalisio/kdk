import _ from 'lodash'
import logger from 'loglevel'
import { Quasar } from 'quasar'
import { createI18n } from 'vue-i18n'
import { getAppLocale, getAppFallbackLocale } from './utils/utils.locale.js'

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
    // Install Quasar langage pack
    try {
      const langagePack = await import(`quasar/lang/${locale}.js`)
      if (langagePack) Quasar.lang.set(langagePack.default)
    } catch (error) {
      logger.error(error)
    }
    // Create i18n instance using the translation bundles
    this.i18n = createI18n({
      locale,
      fallbackLocale,
      messages: await loadTranslationBundles(bundles, locale, fallbackLocale),
      silentFallbackWarn: true
    })
    app.use(this.i18n)
  },
  registerTranslation (translation) {
    if (!this.i18n) {
      logger.error('the i18n instance is not existing. Did you initialize it ?')
      return
    }
    const locale = this.i18n.global.locale
    let messages = translation[locale]
    if (messages) this.i18n.global.mergeLocaleMessage(locale, messages)
    const fallbackLocale = this.i18n.global.fallbackLocale
    messages = translation[fallbackLocale]
    if (messages) this.i18n.global.mergeLocaleMessage(fallbackLocale, messages)
  },
  t (key, param) {
    if (!this.i18n) {
      logger.error('the i18n instance is not existing. Did you initialize it ?')
      return key
    }
    return this.i18n.global.t(key, param)
  },
  tc (key, choice) {
    if (!this.i18n) {
      logger.error('the i18n instance is not existing. Did you initialize it ?')
      return key
    }
    return this.i18n.global.tc(key, choice)
  },
  tie (key, param) {
    if (!this.i18n) {
      logger.error('the i18n instance is not existing. Did you initialize it ?')
      return key
    }
    if (_.isEmpty(key)) return key
    return this.i18n.global.te(key) ? this.i18n.global.t(key, param) : key
  }
}
