import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BaseCollection from './base-collection'
import Layout from './layout'

export default class Groups extends BaseCollection {
  constructor () {
    super('groupsGrid', 'QCard')
    this.layout = new Layout()
  }

  async create (test, data) {
    await this.layout.clickFab(test, 'create-group')
    await test
      .typeText(VueSelector('k-text-field').nth(0), data.name, { replace: true })
      .typeText(VueSelector('k-text-field').nth(1), data.description, { replace: true })
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(2000)
  }

  async edit (test, name, data) {
    await this.clickAction(test, name, 'edit-group')
    await test
      .typeText(VueSelector('k-text-field').nth(0), data.name, { replace: true })
      .typeText(VueSelector('k-text-field').nth(1), data.description, { replace: true })
      .click(Selector('.q-dialog #apply-button'))
      .wait(Groups.LONG_WAIT)
  }

  async delete (test, name) {
    await this.clickAction(test, name, 'delete-group')
    await test
      .click(Selector('.q-dialog .q-btn').nth(1))
      .wait(Groups.EXTRA_LONG_WAIT)
  }
}
