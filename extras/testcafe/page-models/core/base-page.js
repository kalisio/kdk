import { Selector } from 'testcafe'

export default class BasePage {
  constructor () {
    this.error = Selector('.q-notification')
  }

  // Error helper
  async isErrorVisible () {
    const isVisible = await this.error.visible
    return isVisible
  }
}
