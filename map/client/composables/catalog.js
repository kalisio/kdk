import sift from 'sift'
import _ from 'lodash'
import { ref, computed } from 'vue'
import { setEngineJwt } from '../utils.js'
import { i18n } from '../../../core/client/i18n.js'

export function useCatalog (planetApi, options = {}) {
  _.defaults(options, {
    // Default filter queries
    layers: {},
    categories: {},
    views: {}
  })

  // Data
  const layers = ref([])
  const categories = ref([])
  const views = ref([])

  // Computed
  const layersByCategory = computed(() => {
    const layersByCategory = {}
    _.forEach(categories.value, category => {
      // Built-in categories use filtering while user-defined ones use layers list
      let filter = null
      if (_.has(category, 'options.filter')) {
        filter = _.get(category, 'options.filter')
      } else if (_.has(category, 'layers')) {
        filter = { name: { $in: _.get(category, 'layers') } }
      }
      // If the list of layers in category is empty we can have a null filter
      layersByCategory[category.name] = filter ? _.remove(layers.value, sift(filter)) : []
      // Order by
      layersByCategory[category.name] = _.orderBy(layersByCategory[category.name],
        [(layer) => _.get(layer, _.get(category, 'options.orderBy', '_id'))],
        [_.get(category, 'options.order', 'asc')])
    })
    return layersByCategory
  })

  // Functions
  function processTranslations (item) {
    if (item.i18n) i18n.registerTranslation(item.i18n)
    item.label = i18n.tie(item.name)
    item.description = i18n.tie(item.description)
  }
  async function getLayers() {
    layers.value = []
    const catalogService = planetApi.getService('catalog', options.context)
    if (catalogService) {
      const response = await catalogService.find({ query: options.layers })
      _.forEach(response.data, processTranslations)
      // Set which API to use to retrieve layer data
      layers.value = layers.value.concat(response.data.map(layer => Object.assign(layer, { getPlanetApi: () => planetApi })))
    }
    // Do we need to inject a token ?
    await setEngineJwt(layers.value, planetApi)
    return layers.value
  }
  async function getCategories () {
    categories.value = []
    const catalogService = planetApi.getService('catalog', options.context)
    if (catalogService) {
      const response = await catalogService.find({ query: Object.assign({ type: 'Category' }, options.categories) })
      _.forEach(response.data, processTranslations)
      categories.value = categories.value.concat(response.data)
    }
    return categories.value
  }
  async function getViews () {
    views.value = []
    const catalogService = planetApi.getService('catalog', options.context)
    if (catalogService) {
      const response = await catalogService.find({ query: Object.assign({ type: 'Context' }, options.views) })
      _.forEach(response.data, processTranslations)
      views.value = views.value.concat(response.data)
    }
    return views.value
  }

  // Expose
  return {
    layers,
    categories,
    layersByCategory,
    views,
    getLayers,
    getCategories,
    getViews,
    processTranslations
  }
}
