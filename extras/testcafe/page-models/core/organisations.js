import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BaseCollection from './base-collection'

export default class Organisations extends BaseCollection {
  constructor () {
    super('organisationsGrid', 'QCard')
    // Organisation create editor
    this.editorNameField = VueSelector('k-text-field').nth(0)
    this.editoDescriptionField = VueSelector('k-text-field').nth(1)
    this.editorCancelButton = Selector('.q-card button[type=button]').nth(0)
    this.editorCreateButton = Selector('.q-card button[type=button]').nth(1)
  }

  static get ENTRY () {
    return 'organisations'
  }

  async create (test, name, description) {
    await test
      .click(this.createLink)
      .wait(250)
    await test
      .typeText(this.editorNameField, name, { replace: true })
      .typeText(this.editoDescriptionField, description, { replace: true })
      .click(this.editorCreateButton)
      .wait(2000)
  }

  async delete (test, name) {
    await this.clickAction(test, name, 'remove-organisation')
    await test
      .typeText(Selector('.q-dialog-plugin input[type=text]'), name)
      .click(Selector('.q-dialog-plugin button').nth(1))
      .wait(5000)
  }
}
