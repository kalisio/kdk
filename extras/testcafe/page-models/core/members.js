import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BaseCollection from './base-collection'
import Layout from './layout'

export default class Members extends BaseCollection {
  constructor () {
    super('membersGrid', 'QCard')
    this.layout = new Layout()
  }

  static get ADD_MEMBER_ENTRY () {
    return 'add-member'
  }

  async add (test, email, role) {
    await this.layout.clickFab(test, 'add-member')
    await test
      .typeText(VueSelector('k-email-field'), email, { replace: true })
      .wait(Members.SHORT_WAIT)
      .click(Selector('.q-dialog').find('#continue-button'))
      .wait(Members.SHORT_WAIT)
      .click(VueSelector('k-select-field'))
      .wait(Members.SHORT_WAIT)
      .click(Selector('.q-menu .q-item').nth(role))
      .wait(Members.SHORT_WAIT)
      .click(Selector('.q-dialog').find('#add-button'))
      .wait(Members.LONG_WAIT)
  }

  async invite (test, email, name, role) {
    await this.layout.clickFab(test, 'add-member')
    await test
      .typeText(VueSelector('k-email-field'), email, { replace: true })
      .wait(Members.SHORT_WAIT)
      .click(Selector('.q-dialog').find('#continue-button'))
      .wait(Members.SHORT_WAIT)
      .typeText(VueSelector('k-text-field'), name, { replace: true })
      .click(VueSelector('k-select-field'))
      .wait(Members.SHORT_WAIT)
      .click(Selector('.q-menu .q-item').nth(role))
      .wait(Members.SHORT_WAIT)
      .click(Selector('.q-dialog').find('#add-button'))
      .wait(Members.EXTRA_LONG_WAIT)
  }

  async tag (test, name, tag) {
    await this.clickAction(test, name, 'tag-member')
    await test
      .wait(Members.LONG_WAIT)
      .typeText(VueSelector('k-tag-field'), tag, { replace: true })
      .pressKey("enter")
      .wait(Members.SHORT_WAIT)
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(Members.LONG_WAIT)
  }

  async changeRole (test, name, role) {
    await this.clickAction(test, name, 'change-role')
    await test
      .click(VueSelector('k-select-field'))
      .click(Selector('.q-menu .q-item').nth(role))
      .wait(500)
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(2000)
  }

  async delete (test, name) {
    await this.clickMenuEntry(test, name, 'card-overflow-menu', 'remove-member')
    await test
      .click(Selector('.q-dialog .q-btn').nth(1))
      .wait(5000)
  }

  async joinGroup (test, memberName, groupName, role) {
    await test
      .click(this.collection.withText(memberName).find('#join-group'))
      .typeText(VueSelector('k-item-field'), groupName, { replace: true })
      .wait(Members.LONG_WAIT)
      .click(Selector('.q-menu .q-item').nth(0))
      .click(VueSelector('k-select-field'))
      .wait(Members.SHORT_WAIT)
      .click(Selector('.q-menu .q-item').nth(role))
      .wait(Members.SHORT_WAIT)
      .click(Selector('.q-dialog #join-button'))
      .wait(2000)
  }

  async leaveGroup (test, memberName, groupName) {
    await test
      .click(this.collection.withText(memberName).find('#group-button'))
      .wait(Members.SHORT_WAIT)
      .click(Selector('.q-menu').find('#leave-group'))
      .wait(Members.SHORT_WAIT)
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(2000)
  }
}
