import { Selector, t } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from '../core/base-page'

export default class Catalog extends BasePage {
  constructor () {
    super()
    this.catalog = VueSelector('k-catalog')
    this.categories = VueSelector('k-catalog QExpansionItem')
    this.layers = VueSelector('k-catalog QItem')
  }
  
  // Categories
  
  async getCategory (category) {
    const categoryId = 'KCatalogPanel.' + category
    const categoriesCount = await this.categories.count
    let categoryEl = null
    for (let i = 0; i < categoriesCount; ++i) {
      if (!categoryEl) {
        const cat = this.categories.nth(i)
        const id = await cat.id
        if (id === categoryId) categoryEl = cat
      }
    }
    if (!categoryEl) throw new Error(`Catalog category '${category}' not found !`)
    const categoryVue = await categoryEl.getVue()
    return categoryVue
  }

  async clickCategory (test, category) {
    await test
      .click(this.categories.withAttribute('id', `KCatalogPanel.${category}`))
  }

  async manageCategories (test) {
    await test
      .click(VueSelector('k-catalog #manage-layer-categories'))
  }

  // layers

  async getLayer (layer) {
    const layersCount = await this.layers.count
    let layerEl = null
    for (let i = 0; i < layersCount; ++i) {
      if (!layerEl) {
        const lay = this.layers.nth(i)
        const id = await lay.id
        if (id === layer) layerEl = lay
      }
    }
    if (!layerEl) throw new Error(`Catalog layer '${layer}' not found !`)
    const layerVue = await layerEl.getVue()
    return layerVue
  }

  async clickLayer (test, layer) {
    await test
      .click(this.layers.withAttribute('id', `${layer}`))
  }

  async clickLayerAction (test, layer, action) {
    const layerSelector = VueSelector('k-catalog').find(`#${layer}`)
    await test
      .click(layerSelector.find('#layer-actions'))
      .click(Selector('.q-menu').find(`#${action}`))
  }

  // Meteo models

  async getMeteoModel (model) {
    return Selector('.q-menu').find(`#${model}`)
  }

  async clickForecastMode (test, mode) {
    const item = await this.getForecastMode(mode)
    await test
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
