import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from './base-page'

export default class Groups extends BasePage {
  constructor () {
    super()
    this.groups = Selector('.q-page .q-card')
  }

  static get OVERFLOW_MENU_ENTRY () {
    return '#groups'
  }

  static get TAB_BAR_ENTRY () {
    return '#groups'
  }

  /* static get CREATE_GROUP_FAB_ENTRY () {
    return '#create-group'
  } */

  async clickToolBar (test, member, action) {
    await test
      .click(this.groups.withText(member).find(action))
  }

  async clickOverflowMenu (test, member, entry) {
    await test
      .click(this.groups.withText(member).find('#card-overflow-menu'))
      .click(Selector('.q-menu').find(entry))
  }

  async checkCount (test, count) {
    const tagsCount = this.groups.count
    await test.expect(tagsCount).eql(count, 'Invalid members count')
  }

  async create (test, name, description) {
    await test
      .typeText(VueSelector('k-text-field').nth(0), name, { replace: true })
      .typeText(VueSelector('k-text-field').nth(1), description, { replace: true })
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(2000)
  }

  async edit (test, name, description) {
    await this.clickToolBar(test, name, '#edit-group')
    await test
      .typeText(VueSelector('k-text-field').nth(0), name, { replace: true })
      .typeText(VueSelector('k-text-field').nth(1), description, { replace: true })
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(2000)
  }

  async delete (test, name) {
    await this.clickOverflowMenu(test, name, '#remove-group')
    await test
      .click(Selector('.q-dialog .q-btn').nth(1))
      .wait(5000)
  }
}
