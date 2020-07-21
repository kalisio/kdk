import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
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

  async title (name) {
    return this.tags.withText(name).find('.text-subtitle1').innerText
  }

  async checkExists (test, name) {
    const card = await this.tags.withText(name)
    await test.expect(card.exists).ok(`The tag ${name} should exist`)
  }

  async checkCounter (test, name, count) {
    const membersCount = await this.tags.withText(name).find('#tag-count').withText(count.toString())
    await test.expect(membersCount.exists).ok(`The tag ${name} should have a counter equal to ${count}`)
  }

  async clickToolBar (test, name, action) {
    await test
      .click(this.tags.withText(name).find(action))
  }

  async clickOverflowMenu (test, name, entry) {
    await test
      .click(this.tags.withText(name).find('#card-overflow-menu'))
      .click(Selector('.q-menu').find(entry))
  }

  async edit (test, name, data) {
    await this.clickToolBar(test, name, '#edit-tag')
    await test
      .typeText(VueSelector('k-text-field').nth(0), data.name, { replace: true })
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(2000)
  }

  async checkCount (test, count) {
    const tagsCount = this.tags.count
    await test.expect(tagsCount).eql(count, 'Invalid tags count')
  }
}
