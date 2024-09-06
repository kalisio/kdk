import _ from 'lodash'
import { ref, computed } from 'vue'
import * as catalog from '../utils/utils.catalog.js'
import { getCatalogProjectQuery } from '../utils/utils.project.js'
import { api } from '../../../core/client/api.js'

export function useCatalog (options = {}) {
  // Options might also contains a project object to filter the catalog
  _.defaults(options, {
    // Default filter queries
    layers: {},
    categories: {},
    sublegends: {},
    views: {},
    // Default to global catalog
    context: '',
    // Default to app API
    planetApi: api
  })

  // Data
  const layers = ref([])
  const categories = ref([])
  const sublegends = ref([])
  const views = ref([])

  // Computed
  const layersByCategory = computed(() => catalog.getLayersByCategory(layers.value, categories.value))
  const orphanLayers = computed(() => catalog.getOrphanLayers(layers.value, layersByCategory.value))

  // Functions
  async function getLayers (filterQuery = {}) {
    const query = Object.assign({},
      options.project ? Object.assign(getCatalogProjectQuery(options.project), options.layers) : options.layers,
      filterQuery)
    layers.value = await catalog.getLayers({
      query,
      context: options.context,
      planetApi: options.planetApi
    })
    return layers.value
  }
  async function getCategories () {
    categories.value = await catalog.getCategories({
      query: options.categories,
      context: options.context,
      planetApi: options.planetApi
    })
    return categories.value
  }
  async function getSublegends () {
    sublegends.value = await catalog.getSublegends({
      query: options.sublegends,
      context: options.context,
      planetApi: options.planetApi
    })
    return sublegends.value
  }
  async function getViews () {
    views.value = await catalog.getViews({
      query: options.project ? Object.assign(getCatalogProjectQuery(options.project), options.views) : options.views,
      context: options.context,
      planetApi: options.planetApi
    })
    return views.value
  }

  // Expose
  return {
    layers,
    categories,
    sublegends,
    layersByCategory,
    orphanLayers,
    views,
    getLayers,
    getCategories,
    getSublegends,
    getViews
  }
}
