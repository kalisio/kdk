import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from './base-page'

export default class OrganisationsSettings extends BasePage {
  constructor () {
    super()
    // Properties
    this.editorNameField = VueSelector('k-text-field').nth(0)
    this.editoDescriptionField = VueSelector('k-text-field').nth(1)
    this.editorCancelButton = Selector('.q-card button[type=button]').nth(0)
    this.editorCreateButton = Selector('.q-card button[type=button]').nth(1)
    this.registerConfirmPasswordInput = VueSelector('k-register k-password-field').nth(1)
    // Billing
    this.customerBlock = Selector('#customer-block')
    this.customerEditor = VueSelector('organisation-billing k-customer-editor')
    this.cardFieldNumber = Selector('organisation-billing k-customer-editor .Cardfield-number')
    this.cardFieldExpiry = VueSelector('organisation-billing k-customer-editor .Cardfield-expiry')
    this.cardFieldCVC = VueSelector('organisation-billing k-customer-editor .Cardfield-cvc')
  }

  static get OVERFLOW_MENU_ENTRY () {
    return 'settings'
  }

  static get PROPERTIES_TAB () {
    return 'properties'
  }

  static get BILLING_TAB () {
    return 'billing'
  }

  static get DANGER_ZONE_TAB () {
    return 'danger-zone'
  }

  async checkCustomerBlockDisabled (test) {
    await test.expect(this.customerBlock.find('button').hasAttribute('disabled')).ok()
  }

  async checkCustomerBlockEnabled (test) {
    await test.expect(this.customerBlock.find('button').hasAttribute('disabled')).notOk()
  }

  async updateCustomer (test, customer) {
    await test
      .click(this.customerBlock.find('button'))
      .wait(250)
      .click(Selector('.q-dialog').find('#email-field'))
      .click(Selector('.q-menu .q-item').nth(customer.index))
      .typeText(Selector('.q-dialog').find('#description-field'), customer.description, { replace: true })
      .typeText(Selector('.q-dialog').find('#vatNumber-field'), customer.vatNumber, { replace: true })
    if (customer.card) {
      await test
        .switchToIframe(Selector('.q-dialog iframe'))
        .typeText(Selector('input[type=tel]').nth(0), customer.card.number, { replace: true })
        .typeText(Selector('input[type=tel]').nth(1), customer.card.expiry, { replace: true })
        .typeText(Selector('input[type=tel]').nth(2), customer.card.cvc, { replace: true })
        .typeText(Selector('input[type=tel]').nth(3), customer.card.postalCode, { replace: true })
        .switchToMainWindow()
        .wait(2000)
    }
    await test
      .click(Selector('.q-dialog').find('#update-button'))
      .wait(2000)
  }

  async clearCustomerCard (test) {
    await test
      .click(this.customerBlock.find('button'))
      .wait(250)
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .click(Selector('.q-dialog').find('#update-button'))
      .wait(2000)
  }

  async checkCustomerCard (test, mustHaveCard) {
    await test
      .click(this.customerBlock.find('button'))
      .wait(250)
    const cardSelector = Selector('.q-dialog').withText('XXXX-')
    if (mustHaveCard) await test.expect(cardSelector.visible).ok()
    else await test.expect(cardSelector.exists).notOk()
  }

  async checkPlanDisabled (test, name) {
    await test.expect(Selector('#' + name + '-card').find('button').hasAttribute('disabled')).ok()
  }

  async checkPlanEnabled (test, name) {
    await test.expect(Selector('#' + name + '-card').find('button').hasAttribute('disabled')).notOk()
  }

  async selectPlan (test, name) {
    await test
      .click(Selector('#' + name + '-card').find('button'))
      .click(Selector('.q-dialog .q-btn').nth(1))
      .wait(5000)
  }

  async delete (test, name) {
    await test
      .click(Selector('.q-card button'))
      .wait(250)
    await test
      .typeText(Selector('.q-dialog-plugin input[type=text]'), name)
      .click(Selector('.q-dialog-plugin button').nth(1))
      .wait(5000)
  }
}
