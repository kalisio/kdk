import { Selector, t } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from '../core/base-page'

export default class Catalog extends BasePage {
  constructor () {
    super()

    this.opener = Selector('#opener-right')
    // testcafe wait for elements to come in foreground before click,
    // so use 0 timeout since it's always visible, but in background
    this.closer = Selector('#map', { timeout: 0 })
  }

  async getCategory (category) {
    const categories = VueSelector('k-catalog QExpansionItem')
    const count = await categories.count
    for (let i = 0; i < count; ++i) {
      const cat = categories.nth(i)
      const id = await cat.id
      if (id === category) return cat
    }

    throw new Error(`Catalog category '${category}' not found !`)
  }

  async getLayer (layer) {
    const layers = VueSelector('k-catalog k-layers-selector QItem')
    console.log(await layers.count)
    const count = await layers.count
    for (let i = 0; i < count; ++i) {
      const lay = layers.nth(i)
      const id = await lay.id
      if (id === layer) return lay
    }

    throw new Error(`Catalog layer '${layer}' not found !`)
  }

  async getForecastMode (mode) {
    const tabs = VueSelector('k-layers-selector QTab')
    const count = await tabs.count
    for (let i = 0; i < count; ++i) {
      const tab = tabs.nth(i)
      const id = await tab.id
      if (id === mode) return tab
    }

    throw new Error(`Forecast mode '${mode}' not found !`)
  }

  async getMeteoModel (model) {
    return Selector('.q-menu').find(`#${model}`)
  }

  async clickCategory (category, expectExpanded) {
    const item = await this.getCategory(category)
    await t
    // click on the QExpansionItem header (testcafe default is center of element which is not good
    // since expansion item element covers it's content too.
      .click(item.find('.q-item'))
      .expect(item.getVue(({ state }) => state.showing)).eql(expectExpanded, `catalog category '${category}' expanded state doesn't match expectation (${expectExpanded})`)
  }

  async clickLayer (layer, expectActive) {
    const item = await this.getLayer(layer)
    await t
      .expect(item.getVue(({ props }) => props.clickable)).ok(`catalog layer '${layer}' is not clickable`)
      .click(item)
      .expect(item.getVue(({ props }) => props.active)).eql(expectActive, `catalog layer '${layer}' active state doesn't match expectation (${expectActive})`)
  }

  async clickForecastMode (mode) {
    const item = await this.getForecastMode(mode)
    await t
      .click(item)
      .expect(item.getVue(({ computed }) => computed.isActive)).ok(`forecast mode '${mode}' isn't active`)
  }

  async clickForecast () {
    await this.clickForecastMode('forecast')
  }

  async clickArchives () {
    await this.clickForecastMode('archive')
  }

  async selectMeteoModel (model) {
    const select = VueSelector('k-catalog k-weather-layers-selector QSelect')
    await t.click(select)
    const entry = await this.getMeteoModel(model)
    const label = await Selector(entry).child('.q-item__section--main').child(0).innerText
    await t
      .click(entry)
    // robin: test may fail here, in that case, chrome was probably out of focus
    // try again and let chrome window focused ...
      .expect(select.getVue(({ computed }) => computed.selectedString)).eql(label, `meteo model '${model}' isn't selected`)
  }
}
