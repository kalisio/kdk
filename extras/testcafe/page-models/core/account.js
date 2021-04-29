import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from './base-page'

export default class Account extends BasePage {
  constructor () {
    super()
    // Profile
    this.profileEditor = VueSelector('k-account-activity k-editor')
    this.fileInput = Selector('.dz-hidden-input')
    // Security
    this.passwordBlock = Selector('#password-block')
    this.changePasswordScreen = VueSelector('k-change-password')
    this.emailBlock = Selector('#email-block')
    this.changeEmailScreen = VueSelector('k-send-change-identity')
    // Danger zone
    this.deleteBlock = Selector('#delete-block')
  }

  static get MANAGE_ACCOUNT () {
    return 'manage-account'
  }

  static get PROFILE () {
    return 'profile'
  }

  static get SECURITY () {
    return 'security'
  }

  static get DANGER_ZONE () {
    return 'danger-zone'
  }

  async updateProfile (test, avatar, name) {
    await test
      .click(VueSelector('k-editor k-attachment-field'))
      .setFilesToUpload(Selector('.dz-hidden-input'), avatar)
      .wait(Account.LONG_WAIT)
      .typeText(VueSelector('k-text-field'), name, { replace: true })
      .click(VueSelector('k-editor').find('#apply-button'))
      .wait(Account.EXTRA_LONG_WAIT)
  }

  async updatePassword (test, oldPassword, newPassword) {
    await test
      .click(this.passwordBlock.find('button'))
      .wait(Account.SHORT_WAIT)
      .typeText(VueSelector('k-password-field').nth(0), oldPassword, { replace: true })
      .typeText(VueSelector('k-password-field').nth(1), newPassword, { replace: true })
      .typeText(VueSelector('k-password-field').nth(2), newPassword, { replace: true })
      .click(this.changePasswordScreen.find('#change-password'))
      .wait(Account.EXTRA_LONG_WAIT)
  }

  async updateEmail (test, email, password) {
    await test
      .click(this.emailBlock.find('button'))
      .wait(Account.SHORT_WAIT)
      .typeText(VueSelector('k-password-field'), password, { replace: true })
      .typeText(VueSelector('k-email-field'), email, { replace: true })
      .click(this.changeEmailScreen.find('#change-identity'))
      .wait(Account.EXTRA_LONG_WAIT)
  }

  async delete (test, name) {
    await test
      .click(this.deleteBlock.find('button'))
      .wait(Account.SHORT_WAIT)
      .typeText(Selector('.q-dialog-plugin input[type=text]'), name)
      .click(Selector('.q-dialog-plugin button').nth(1))
      .wait(Account.EXTRA_LONG_WAIT)
  }
}
