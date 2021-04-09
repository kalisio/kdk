import { Selector } from 'testcafe'

export default class BasePage {
  constructor () {
    this.error = Selector('.q-notification')
  }

  static get SHORT_WAIT () {
    return 500
  }

  static get LONG_WAIT () {
    return 1000
  }

  static get EXTRA_LONG_WAIT () {
    return 5000
  }

  // Error helper
  async isErrorVisible () {
    const isVisible = await this.error.visible
    return isVisible
  }
}
