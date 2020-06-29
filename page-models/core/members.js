import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from './base-page'

export default class Members extends BasePage {
  constructor () {
    super()
    this.members = Selector('.q-page .q-card')
  }

  static get OVERFLOW_MENU_ENTRY () {
    return '#members'
  }

  static get TAB_BAR_ENTRY () {
    return '#members'
  }

  static get ADD_MEMBER_FAB_ENTRY () {
    return '#add-member'
  }

  static get INVITE_MEMBER_FAB_ENTRY () {
    return '#invite-member'
  }

  async clickToolBar (test, member, action) {
    await test
      .click(this.members.withText(member).find(action))
  }

  async clickOverflowMenu (test, member, entry) {
    await test
      .click(this.members.withText(member).find('#card-overflow-menu'))
      .click(Selector('.q-menu').find(entry))
  }

  async checkCount (test, count) {
    const membersCount = this.members.count
    await test.expect(membersCount).eql(count, 'Invalid members count')
  }

  async add (test, name, role) {
    await test
      .typeText(VueSelector('k-item-field'), name, { replace: true })
      .wait(2000)
      .click(Selector('.q-menu .q-item').nth(0))
      .wait(250)
      .click(VueSelector('k-select-field'))
      .wait(250)
      .click(Selector('.q-menu .q-item').nth(role))
      .wait(250)
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(2000)
  }

  async invite (test, name, email, role) {
    await test
      .typeText(VueSelector('k-text-field'), name, { replace: true })
      .typeText(VueSelector('k-email-field'), email, { replace: true })
      .click(VueSelector('k-select-field'))
      .click(Selector('.q-menu .q-item').nth(role))
      .wait(250)
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(2000)
  }

  async tag (test, name, tag) {
    await this.clickToolBar(test, name, '#tag-member')
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
    await this.clickToolBar(test, name, '#change-role')
    await test
      .click(VueSelector('k-select-field'))
      .click(Selector('.q-menu .q-item').nth(role))
      .wait(500)
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .wait(2000)
  }

  async delete (test, name) {
    await this.clickOverflowMenu(test, name, '#remove-member')
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
