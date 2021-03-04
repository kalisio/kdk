import { Selector } from 'testcafe'
import BasePage from '../core/base-page'

export default class MapActivity extends BasePage {
  constructor () {
    super()
    this.map = Selector('#map')
  }

  async click (test) {
    await test
      .click(this.map)
      .wait(1000)
  }

  async move (test, dx, dy) {
    await test
      .drag(this.map, dx, dy)
      .click(this.map)
      .wait(1000)
  }
}
