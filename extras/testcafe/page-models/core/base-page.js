import { Selector } from 'testcafe'

export default class BasePage {
  constructor () {
    this.error = Selector('.q-notification')
  }

  // Error helper
  async isErrorVisible () {
    return this.error.visible
  }
}
