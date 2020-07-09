import { Selector, t } from 'testcafe'
import BasePage from '../core/base-page'

export default class LayerImportDialog extends BasePage {
  constructor () {
    super()

    this.dialog = Selector('.q-dialog')
    this.input = this.dialog.find('.q-field__input')
    this.import = this.dialog.find('#import-button')
    this.cancel = this.dialog.find('#cancel-button')
  }

  async importLayer (file) {
    await t
      .setFilesToUpload(this.input, file)
      .click(this.import)
  }
}
