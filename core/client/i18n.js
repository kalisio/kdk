import _ from 'lodash'
import logger from 'loglevel'
import { Quasar } from 'quasar'
import { createI18n } from 'vue-i18n'
import { getLocale, getFallbackLocale } from './utils/utils.locale.js'

// Helper function to load a translation file
// @i18n alias shoud be added in the quasar.config build section
async function loadTranslationBundles (bundles, locale, fallbackLocale) {
  const translations = {}
  translations[locale] = {}
  translations[fallbackLocale] = {}
  for (let i = 0; i < bundles.length; i++) {
    try {
      const localeTranslationsModule = await import(`@i18n/${bundles[i]}_${locale}.json`)
      _.merge(translations[locale], localeTranslationsModule.default)
    } catch (error) {
      logger.warn(`[KDK] unable to load translation file ${bundles[i]}_${locale}.json`)
    }
    try {
      const fallbackTranslationModule = await import(`@i18n/${bundles[i]}_${fallbackLocale}.json`)
      _.merge(translations[fallbackLocale], fallbackTranslationModule.default)
    } catch (error) {
      logger.error(`[KDK] unable to load translation file ${bundles[i]}_${fallbackLocale}.json`)
    }
  }
  return translations
}

export const i18n = {
  async initialize (app, bundles) {
    // Create i18n instance using the translation bundles
    const fallbackLocale = getFallbackLocale()
    const locale = getLocale()
    this.i18n = createI18n({
      locale,
      fallbackLocale,
      messages: await loadTranslationBundles(bundles, locale, fallbackLocale),
      silentFallbackWarn: true
    })
    app.use(this.i18n)
    // Install Quasar langage pack
    try {
      const langagePack = await import(`quasar/lang/${getLocale(false)}.js`)
      if (langagePack) Quasar.lang.set(langagePack.default)
    } catch (error) {
      logger.error(error)
    }
    
  },
  registerTranslation (translation) {
    if (!this.i18n) {
      logger.error('[KDK] i18n instance is not existing. Did you initialize it ?')
      return
    }
    const locale = this.i18n.global.locale
    let messages = translation[locale]
    if (messages) this.i18n.global.mergeLocaleMessage(locale, messages)
    const fallbackLocale = this.i18n.global.fallbackLocale
    messages = translation[fallbackLocale]
    if (messages) this.i18n.global.mergeLocaleMessage(fallbackLocale, messages)
  },
  t (key, params) {
    if (!this.i18n) {
      logger.error('[KDK] i18n instance is not existing. Did you initialize it ?')
      return key
    }
    return this.i18n.global.t(key, params)
  },
  tc (key, choice) {
    if (!this.i18n) {
      logger.error('[KDK] i18n instance is not existing. Did you initialize it ?')
      return key
    }
    if (this.i18n.global.te(key)) return this.i18n.global.tc(key, choice)
    if (this.i18n.global.te(key, this.i18n.global.fallbackLocale)) return this.i18n.global.tc(key, choice, this.i18n.global.fallbackLocale)
  },
  tie (key, params) {
    if (!this.i18n) {
      logger.error('[KDK] i18n instance is not existing. Did you initialize it ?')
      return key
    }
    if (_.isEmpty(key)) return key
    if (this.i18n.global.te(key)) return this.i18n.global.t(key, params)
    if (this.i18n.global.te(key, this.i18n.global.fallbackLocale)) return this.i18n.global.t(key, this.i18n.global.fallbackLocale, params)
    return key
  },
  localize (path) {
    if (!this.i18n) {
      logger.error('[KDK] i18n instance is not existing. Did you initialize it ?')
      return path
    }
    const index = path.lastIndexOf('.')
    const baseName = index > 0 ? path.substring(0, index) : path
    const extName = index > 0 ? path.substring(index, path.length) : ''
    return [
      `${baseName}_${this.i18n.global.locale}${extName}`,
      `${baseName}_${this.i18n.global.fallbackLocale}${extName}`,
      path
    ]
  }
}
