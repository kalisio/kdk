import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from './base-page'
import _ from 'lodash'

export default class OrganisationsPanel extends BasePage {
  constructor () {
    super()
    // Organisation panel
    this.panel = VueSelector('k-organisations-panel')
    this.createLink = this.panel.find('#new-organisation')
    // Organisation create editor
    this.editorNameField = VueSelector('k-text-field').nth(0)
    this.editoDescriptionField = VueSelector('k-text-field').nth(1)
    this.editorCancelButton = Selector('.q-card button[type=button]').nth(0)
    this.editorCreateButton = Selector('.q-card button[type=button]').nth(1)
  }

  async checkCount (test, count) {
    const organisations = this.panel.find('.q-item') // create organisation item
    await test.expect(organisations.count).eql(count + 1, 'Private organisation should be created')
  }

  async select (test, name) {
    await test
      .click(this.panel.find('#' + _.kebabCase(name)))
      .wait(250)
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
}
