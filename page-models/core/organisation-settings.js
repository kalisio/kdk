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
    this.customerEditor = VueSelector('organisation-billing k-customer-editor')
    this.cardFieldNumber = Selector('organisation-billing k-customer-editor .Cardfield-number')
    this.cardFieldExpiry = VueSelector('organisation-billing k-customer-editor .Cardfield-expiry')
    this.cardFieldCVC = VueSelector('organisation-billing k-customer-editor .Cardfield-cvc')
  }

  static get OVERFLOW_MENU_ENTRY () {
    return '#settings'
  }

  static get PROPERTIES_TAB () {
    return '#properties'
  }

  static get BILLING_TAB () {
    return '#billing'
  }

  static get DANGER_ZONE_TAB () {
    return '#danger-zone'
  }

  async getOrganisationBillingState (test) {
    const billingPane = await VueSelector('organisation-billing').getVue()
    return billingPane.state
  }

  async canEditOrganisationCustomer (test) {
    const customerBlock = await VueSelector('organisation-billing k-block').getVue()
    if (customerBlock.props.disabled) return !customerBlock.props.disabled
    return true
  }

  async checkOrganisationCustomer (test, pattern) {
    const customerBlock = await VueSelector('organisation-billing k-block').getVue()
    await test.expect(customerBlock.props.text).contains(pattern)
    return true
  }

  async updateOrganisationCustomer (test, orgName, customer) {
    await this.selectOrganisationSettingsTab(test, orgName, '#billing')
    await test
      .click(VueSelector('organisation-billing k-block q-btn'))
      .wait(250)
    await test
      .click(this.customerEditor.find('#email-field'))
      .click(Selector('.q-popover .q-item').nth(customer.index))
      .typeText(this.customerEditor.find('#description-field'), customer.description, { replace: true })
      .typeText(this.customerEditor.find('#vatNumber-field'), customer.vatNumber, { replace: true })
    if (customer.card) {
      await test
        .switchToIframe(Selector('.modal iframe'))
        .typeText(Selector('input[type=tel]').nth(0), customer.card.number, { replace: true })
        .typeText(Selector('input[type=tel]').nth(1), customer.card.expiry, { replace: true })
        .typeText(Selector('input[type=tel]').nth(2), customer.card.cvc, { replace: true })
        .typeText(Selector('input[type=tel]').nth(3), customer.card.postalCode, { replace: true })
        .switchToMainWindow()
        .wait(2000)
    }
    await test
      .click(this.customerEditor.find('#update-button'))
      .wait(5000)
  }

  async clearOrganisationCustomerCard (test, orgName) {
    await this.selectOrganisationSettingsTab(test, orgName, '#billing')
    await test
      .click(VueSelector('organisation-billing k-block q-btn'))
      .wait(250)
      .click(this.customerEditor.find('#clear-card-button'))
      .wait(250)
      .click(this.customerEditor.find('#update-button'))
      .wait(5000)
  }

  async canSelectOrganisationPlan (test, plan) {
    const planAction = await VueSelector('organisation-billing k-plan-chooser').find('#' + plan + '-action').getVue()
    return !planAction.props.disable
  }

  async selectOrganisationPlan (test, orgName, plan) {
    await this.selectOrganisationSettingsTab(test, orgName, '#billing')
    await test
      .click(VueSelector('organisation-billing k-plan-chooser').find('#' + plan + '-action'))
      .click(Selector('.modal-buttons button').nth(0))
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
