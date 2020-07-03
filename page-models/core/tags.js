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

  async clickCardToolBar (test, name, action) {
    await test
      .click(this.tags.withText(name).find(action))
  }

  async clickCardOverflowMenu (test, name, entry) {
    await test
      .click(this.tags.withText(name).find('#card-overflow-menu'))
      .click(Selector('.q-menu').find(entry))
  }

  async checkCount (test, count) {
    const tagsCount = this.tags.count
    await test.expect(tagsCount).eql(count, 'Invalid tags count')
  }
}
