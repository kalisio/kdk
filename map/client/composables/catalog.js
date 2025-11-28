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
    // Default to contextual or global catalog depending on store
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
    layers.value = await catalog.getLayers({
      query: Object.assign({}, options.layers, filterQuery),
      context: options.context,
      project: options.project
    })
    return layers.value
  }
  async function getCategories () {
    categories.value = await catalog.getCategories({
      query: options.categories,
      context: options.context,
      project: options.project
    })
    return categories.value
  }
  async function getSublegends () {
    sublegends.value = await catalog.getSublegends({
      query: options.sublegends,
      context: options.context,
      project: options.project
    })
    return sublegends.value
  }
  async function getViews () {
    views.value = await catalog.getViews({
      query: options.views,
      context: options.context,
      project: options.project
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
