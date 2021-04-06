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
      .click(VueSelector('k-account-activity k-editor').find('#avatar-field'))
      .setFilesToUpload(Selector('.dz-hidden-input'), avatar)
      .wait(1000)
      .typeText(VueSelector('k-text-field'), name, { replace: true })
      .click(VueSelector('k-account-activity k-editor').find('#apply-button'))
      .wait(5000)
  }

  async updatePassword (test, oldPassword, newPassword) {
    await test
      .click(this.passwordBlock.find('button'))
      .wait(250)
      .typeText(VueSelector('k-password-field').nth(0), oldPassword, { replace: true })
      .typeText(VueSelector('k-password-field').nth(1), newPassword, { replace: true })
      .typeText(VueSelector('k-password-field').nth(2), newPassword, { replace: true })
      .click(this.changePasswordScreen.find('#change-password'))
      .wait(5000)
  }

  async updateEmail (test, email, password) {
    await test
      .click(this.emailBlock.find('button'))
      .wait(250)
      .typeText(VueSelector('k-password-field'), password, { replace: true })
      .typeText(VueSelector('k-email-field'), email, { replace: true })
      .click(this.changeEmailScreen.find('#change-identity'))
      .wait(5000)
  }

  async delete (test, name) {
    await test
      .click(this.deleteBlock.find('button'))
      .wait(250)
      .typeText(Selector('.q-dialog-plugin input[type=text]'), name)
      .click(Selector('.q-dialog-plugin button').nth(1))
      .wait(5000)
  }
}
