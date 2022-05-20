import { createI18n } from 'vue-i18n'
import * as utils from './utils.js'

export const i18n = {
  async initialize (app, bundles) {
    // Define the locale to be used
    const fallbackLocale = utils.getAppFallbackLocale()
    const locale = utils.getAppLocale()
    // Create i18n instance using the translation bundles
    this.i18n = createI18n({
      locale,
      fallbackLocale,
      messages: await utils.loadTranslations(bundles, locale, fallbackLocale),
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
