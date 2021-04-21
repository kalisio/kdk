import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from './base-page'

export default class BaseCollection extends BasePage {
  constructor (grid, type) {
    super()
    this.collection = VueSelector(`ref:${grid} ${type}`)
  }

  async checkExists (test, name) {
    await test.expect(this.collection.withText(name).exists).ok()
  }

  async checkNotExists (test, name) {
    await test.expect(this.collection.withText(name).exists).notOk()
  }

  async clickAction (test, name, action) {
    await test
      .click(this.collection.withText(name).find(`#${action}`))
  }

  async clickMenuEntry (test, name, menu, entry) {
    await test
      .click(this.collection.withText(name).find(`#${menu}`))
      .click(Selector('.q-menu').find(`#${entry}`))
  }

  async count () {
    const itemsCount = await this.collection.count
    return itemsCount
  }

  async checkCount (test, count) {
    const itemsCount = await this.collection.count
    await test.expect(itemsCount).eql(count, 'Invalid items count')
  }
}
