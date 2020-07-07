import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from './base-page'

export default class Account extends BasePage {
  constructor () {
    super()
    // Profile Tab
    this.profileEditor = VueSelector('k-account-activity k-editor')
    this.fileInput = Selector('.dz-hidden-input')
    // Security Tab
    this.changePasswordButton = VueSelector('k-account-security k-block q-btn').nth(0)
    this.changePasswordScreen = VueSelector('k-change-password')
    this.changeEmailButton = VueSelector('k-account-security k-block q-btn').nth(1)
    this.changeEmailScreen = VueSelector('k-send-change-identity')
  }

  static get PROFILE_TAB () {
    return '#profile'
  }

  static get SECURITY_TAB () {
    return '#security'
  }

  static get DANGER_ZONE_TAB () {
    return '#danger-zone'
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
      .click(Selector('.q-card button'))
      .wait(250)
      .typeText(VueSelector('k-password-field').nth(0), oldPassword, { replace: true })
      .typeText(VueSelector('k-password-field').nth(1), newPassword, { replace: true })
      .typeText(VueSelector('k-password-field').nth(2), newPassword, { replace: true })
      .click(this.changePasswordScreen.find('#change-password'))
      .wait(5000)
  }

  async updateEmail (test, email, password) {
    await test
      .click(Selector('.q-card button').nth(1))
      .wait(250)
      .typeText(VueSelector('k-password-field'), password, { replace: true })
      .typeText(VueSelector('k-email-field'), email, { replace: true })
      .click(this.changeEmailScreen.find('#change-identity'))
      .wait(5000)
  }

  async delete (test, name) {
    await test
      .click(Selector('.q-card button'))
      .wait(250)
      .typeText(Selector('.q-dialog-plugin input[type=text]'), name)
      .click(Selector('.q-dialog-plugin button').nth(1))
      .wait(5000)
  }
}
