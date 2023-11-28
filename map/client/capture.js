import { Notify } from 'quasar'
import { capture } from './utils/utils.capture.js'
import { i18n } from '../../core/client/index.js'

// Export singleton
export const CaptureProcessing = {
  processing: false,
  update () {
    this.processing = !this.processing
  },
  async capture (isValid, values) {
    if (this.processing) {
      return Notify.create({ type: 'negative', message: i18n.t('KCapture.ERROR_MESSAGE') })
    }
    if (isValid) {
      this.update()
      await capture(values)
      this.update()
      return true
    }
  }
}