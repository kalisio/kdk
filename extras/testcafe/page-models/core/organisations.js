import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from './base-page'
import _ from 'lodash'

export default class Organisations extends BasePage {
  constructor () {
    super()
    // Organisations collection
    this.organisations = VueSelector('ref:organisationsGrid QCard')
    // this.organisations = Selector('.q-page .q-card')
    this.grid = 'organisationsGrid'

    // Organisation create editor
    this.editorNameField = VueSelector('k-text-field').nth(0)
    this.editoDescriptionField = VueSelector('k-text-field').nth(1)
    this.editorCancelButton = Selector('.q-card button[type=button]').nth(0)
    this.editorCreateButton = Selector('.q-card button[type=button]').nth(1)
  }

  static get ENTRY () {
    return 'organisations'
  }

  async clickAction (test, name, action) {
    await test
      // .debug()
      .click(this.organisations.withText(name).find(`#${action}`))
  }

  async checkCount (test, count) {
    const organisations = this.organisations
    const organisationsCount = await organisations.count
    await test.expect(organisationsCount).eql(count, 'Invalid organisations count')
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

  async setup (test, name) {
    await test
      .click(this.organisations.find('#' + _.kebabCase(name)))
      .wait(250)
  }

  async delete (test, name) {
    await this.clickAction(test, name, 'remove-organisation')
    await test
      .typeText(Selector('.q-dialog-plugin input[type=text]'), name)
      .click(Selector('.q-dialog-plugin button').nth(1))
      .wait(5000)
  }
}
