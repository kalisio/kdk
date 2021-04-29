import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BaseCollection from './base-collection'

export default class Tags extends BaseCollection {
  constructor () {
    super('tagsGrid', 'QCard')
  }

  async title (name) {
    return this.tags.withText(name).find('.text-subtitle1').innerText
  }

  async edit (test, name, data) {
    await this.clickAction(test, name, 'edit-tag')
    await test
      .typeText(VueSelector('k-text-field').nth(0), data.name, { replace: true })
      .click(Selector('.q-dialog #apply-button'))
      .wait(2000)
  }
}
