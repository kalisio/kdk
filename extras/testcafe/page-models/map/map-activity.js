import { Selector } from 'testcafe'
import BasePage from '../core/base-page'
import { getCurrentUrl } from '../core'

export default class MapActivity extends BasePage {
  constructor () {
    super()
    this.map = Selector('#map')
  }

  async click (test) {
    await test
      .click(this.map)
      .wait(500)
  }

  async clickAt (test, x, y) {
    await test
      .click(this.map, { offsetX: x, offsetY: y })
      .wait(500)
  }

  async move (test, dx, dy) {
    await test
      .drag(this.map, dx, dy)
      .click(this.map)
      .wait(500)
  }

  async zoomTo (test, bbox) {
    let url = await getCurrentUrl()
    // Create URL parser
    url = new URL(url)
    // Remove current bbox from URL if any
    console.log(url)
    url.hash = url.hash.replace(/[0-9]/g, '')
    // Then push new one
    url.hash += '/' + bbox.join('/')
    console.log(url)
    await test
      .navigateTo(url.toString())
  }
}
