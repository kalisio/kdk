import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BaseCollection from './base-collection'
import Layout from './layout'

export default class Organisations extends BaseCollection {
  constructor () {
    super('organisationsGrid', 'QCard')
    this.layout = new Layout()
    // Organisation editor 
    this.editorNameField = VueSelector('k-text-field').nth(0)
    this.editoDescriptionField = VueSelector('k-text-field').nth(1)
  }

  static get ENTRY () {
    return 'organisations'
  }

  static get PROPERTIES_ENTRY () {
    return 'edit-organisation'
  }

  static get MEMBERS_ENTRY () {
    return 'organisation-members'
  }

  static get TAGS_ENTRY () {
    return 'organisation-tags'
  }

  static get GROUPS_ENTRY () {
    return 'organisation-groups'
  }

  async goTo (test, name, route, wait = Organisations.LONG_WAIT) {
    await this.clickAction(test, name, route, wait)
  }

  async goToMembers (test, name) {
    await this.goTo(test, name, Organisations.MEMBERS_ENTRY)
  }

  async goToTags (test, name) {
    await this.goTo(test, name, Organisations.TAGS_ENTRY)
  }

  async goToGroups (test, name) {
    await this.goTo(test, name, Organisations.GROUPS_ENTRY)
  }

  async create (test, name, description) {
    await this.layout.clickFab(test, 'create-organisation')
    await test
      .typeText(this.editorNameField, name, { replace: true })
      .typeText(this.editoDescriptionField, description, { replace: true })
      .click(Selector('.q-dialog #apply-button'))
      .wait(Organisations.EXTRA_LONG_WAIT)
  }

  async edit (test, name, data) {
    await this.clickAction(test, name, 'edit-organisation', Organisations.LONG_WAIT)
    await test
      .typeText(this.editorNameField, data.name, { replace: true })
      .typeText(this.editoDescriptionField, data.description, { replace: true })
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
