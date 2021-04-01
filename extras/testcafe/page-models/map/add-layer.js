import { Selector, t } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from '../core/base-page'

export default class AddLayer extends BasePage {
  constructor () {
    super()

    this.dialog = Selector('.q-dialog')
  }

  async importLayer (file, ID) {
    await t
      .click(this.dialog.find('#import-layer'))
      .setFilesToUpload(this.dialog.find('#file-field'), file)
      .click(this.dialog.find('#featureId-field'))
      .wait(1000)
      // Selection based on text content does not seem to work
      //.click(Selector('.q-menu').find('.q-item__label').withText(ID))
      .click(Selector('.q-menu .q-item').nth(ID))
      .wait(1000)
      .click(this.dialog.find('#import-layer-action'))
      .wait(1000)
  }

  async connectLayer (service, layerId) {
    await t
      .click(this.dialog.find('#connect-layer'))
      .typeText(this.dialog.find('#service-field'), service)
      .pressKey('enter')
      .wait(5000) // Need to wait for capabilities parsing
      .click(this.dialog.find('#layer-field'))
      .wait(500)
      // Selection based on text content does not seem to work
      .click(Selector('.q-menu').find(`#${layerId}`))
      .wait(1000)
      .click(this.dialog.find('#connect-layer-action'))
      .wait(1000)
  }

  async createLayer (layer, file, ID) {
    await t
      .click(this.dialog.find('#create-layer'))
      .typeText(this.dialog.find('#name-field'), layer)
      .typeText(this.dialog.find('#description-field'), `${layer} description`)
      .setFilesToUpload(this.dialog.find('#schema-field'), file)
      .click(this.dialog.find('#featureId-field'))
      .wait(1000)
      // Selection based on text content does not seem to work
      //.click(Selector('.q-menu').find('.q-item__label').withText(ID))
      .click(Selector('.q-menu .q-item').nth(ID))
      .wait(1000)
      .click(this.dialog.find('#create-layer-action'))
      .wait(1000)
  }
}
