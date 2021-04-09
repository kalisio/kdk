import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from './base-page'

export default class Groups extends BasePage {
  constructor () {
    super()
    this.groups = Selector('.q-page .q-card')
  }

  static get OVERFLOW_MENU_ENTRY () {
    return 'groups'
  }

  static get TAB_BAR_ENTRY () {
    return 'groups'
  }

  async clickCardToolBar (test, name, action) {
    await test
      .click(this.groups.withText(name).find(action))
  }

  async clickCardOverflowMenu (test, name, entry) {
    await test
      .click(this.groups.withText(name).find('#card-overflow-menu'))
      .click(Selector('.q-menu').find(entry))
  }

  async checkCount (test, count) {
    const tagsCount = this.groups.count
    await test.expect(tagsCount).eql(count, 'Invalid groups count')
  }

  async create (test, data) {
    await test
      .typeText(VueSelector('k-text-field').nth(0), data.name, { replace: true })
      .typeText(VueSelector('k-text-field').nth(1), data.description, { replace: true })
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(2000)
  }

  async edit (test, name, data) {
    await this.clickCardToolBar(test, name, '#edit-group')
    await test
      .typeText(VueSelector('k-text-field').nth(0), data.name, { replace: true })
      .typeText(VueSelector('k-text-field').nth(1), data.description, { replace: true })
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(2000)
  }

  async delete (test, name) {
    await this.clickCardOverflowMenu(test, name, '#remove-group')
    await test
      .click(Selector('.q-dialog .q-btn').nth(1))
      .wait(5000)
  }
}
