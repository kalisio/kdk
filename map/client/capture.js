import { Notify } from 'quasar'
import { capture } from './utils/utils.capture.js'
import { i18n } from '../../core/client/index.js'

// Export singleton
export const Capture = {
  processing: false,
  async process (values) {
    if (this.processing) Notify.create({ type: 'negative', message: i18n.t('KCapture.ERROR_MESSAGE') })
    else {
      this.processing = true
      await capture(values)
      this.processing = false
    }
  }
}
