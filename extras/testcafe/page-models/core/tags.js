import { Selector } from 'testcafe'
import BasePage from './base-page'

export default class Tags extends BasePage {
  constructor () {
    super()
    this.tags = Selector('.q-page .q-card')
  }

  static get OVERFLOW_MENU_ENTRY () {
    return '#tags'
  }

  static get TAB_BAR_ENTRY () {
    return '#tags'
  }

  async clickToolBar (test, member, action) {
    await test
      .click(this.tags.withText(member).find(action))
  }

  async clickOverflowMenu (test, member, entry) {
    await test
      .click(this.tags.withText(member).find('#card-overflow-menu'))
      .click(Selector('.q-menu').find(entry))
  }

  async checkCount (test, count) {
    const tagsCount = this.tags.count
    await test.expect(tagsCount).eql(count, 'Invalid members count')
  }
}
