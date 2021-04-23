import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BaseCollection from './base-collection'

export default class Members extends BaseCollection {
  constructor () {
    super('membersGrid', 'QCard')
  }

  static get ADD_MEMBER_ENTRY () {
    return 'add-member'
  }

  async add (test, email, role) {
    await test
      .typeText(VueSelector('k-email-field'), email, { replace: true })
      .wait(250)
      .click(Selector('.q-dialog').find('#continue-button'))
      .wait(250)
      .click(VueSelector('k-select-field'))
      .wait(250)
      .click(Selector('.q-menu .q-item').nth(role))
      .wait(250)
      .click(Selector('.q-dialog').find('#add-button'))
      .wait(2000)
  }

  async invite (test, email, name, role) {
    await test
      .typeText(VueSelector('k-email-field'), email, { replace: true })
      .wait(250)
      .click(Selector('.q-dialog').find('#continue-button'))
      .wait(250)
      .typeText(VueSelector('k-text-field'), name, { replace: true })
      .click(VueSelector('k-select-field'))
      .wait(250)
      .click(Selector('.q-menu .q-item').nth(role))
      .wait(250)
      .click(Selector('.q-dialog').find('#add-button'))
      .wait(2000)
  }

  async tag (test, name, tag) {
    await this.clickCardToolBar(test, name, '#tag-member')
    await test
      .wait(500)
      .typeText(VueSelector('k-tag-field'), tag, { replace: true })
      .wait(2000)
      .click(Selector('.q-menu .q-item').nth(0))
      .wait(250)
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(2000)
  }

  async changeRole (test, name, role) {
    await this.clickCardToolBar(test, name, '#change-role')
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
      .click(this.members.withText(memberName).find('#join-group'))
      .typeText(VueSelector('k-item-field'), groupName, { replace: true })
      .wait(2000)
      .click(Selector('.q-menu .q-item').nth(0))
      .click(VueSelector('k-select-field'))
      .wait(250)
      .click(Selector('.q-menu .q-item').nth(role))
      .wait(250)
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(2000)
  }

  async leaveGroup (test, memberName, groupName) {
    await test
      .click(this.members.withText(memberName).find('#group-button'))
      .wait(250)
      .click(Selector('.q-menu').find('#leave-group'))
      .wait(250)
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(2000)
  }
}
