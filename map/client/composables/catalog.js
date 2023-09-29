import { ref } from 'vue'
import { setEngineJwt } from '../utils.js'

export function useCatalog (planetApi, options = {}) {
  _.defaults(options, {
    layers: {},
    categories: {}
  })

  // Data
  const layers = ref([])
  const categories = ref([])

  // Functions
  async function getLayers() {
    layers.value = []
    const catalogService = planetApi.getService('catalog', options.context)
    if (catalogService) {
      const response = await catalogService.find({ query: options.layers })
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
      categories.value = categories.value.concat(response.data)
    }
    return categories.value
  }

  // Expose
  return {
    layers,
    categories,
    getLayers,
    getCategories
  }
}
