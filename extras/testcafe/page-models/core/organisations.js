import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BaseCollection from './base-collection'
import Layout from './layout'

export default class Organisations extends BaseCollection {
  constructor () {
    super('organisationsGrid', 'QCard')
    this.layout = new Layout()
    // Organisation create editor
    this.editorNameField = VueSelector('k-text-field').nth(0)
    this.editoDescriptionField = VueSelector('k-text-field').nth(1)
  }

  static get ENTRY () {
    return 'organisations'
  }

  async goToMembers (test, name) {
    await this.clickAction(test, name, 'organisation-members', Organisations.LONG_WAIT)
  }

  async goToGroups (test, name) {
    await this.clickAction(test, name, 'organisation-groups', Organisations.LONG_WAIT)
  }

  async goToProperties (test, name) {
    await this.clickAction(test, name, 'edit-organisation', Organisations.LONG_WAIT)
  }

  async goToBilling (test, name) {
    await this.clickAction(test, name, 'organisation-billing', Organisations.LONG_WAIT)
  }

  async create (test, name, description) {
    await this.layout.clickFab(test, 'create-organisation')
    await test
      .typeText(this.editorNameField, name, { replace: true })
      .typeText(this.editoDescriptionField, description, { replace: true })
      .click(Selector('.q-dialog #apply-button'))
      .wait(Organisations.EXTRA_LONG_WAIT)
  }

  async delete (test, name) {
    await this.clickAction(test, name, 'remove-organisation')
    await test
      .typeText(Selector('.q-dialog-plugin input[type=text]'), name)
      .click(Selector('.q-dialog-plugin button').nth(1))
      .wait(Organisations.EXTRA_LONG_WAIT)
  }
}
