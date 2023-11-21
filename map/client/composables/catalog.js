import _ from 'lodash'
import { ref, computed } from 'vue'
import * as catalog from '../utils/utils.catalog.js'
import { api } from '../../../core/client/api.js'
import { i18n } from '../../../core/client/i18n.js'

export function useCatalog (options = {}) {
  _.defaults(options, {
    // Default filter queries
    layers: {},
    categories: {},
    views: {},
    // Default to global catalog
    context: '',
    // Default to app API
    planetApi: api
  })

  // Data
  const layers = ref([])
  const categories = ref([])
  const views = ref([])

  // Computed
  const layersByCategory = computed(() => catalog.getLayersByCategory(layers.value, categories.value))
  const orphanLayers = computed(() => catalog.getOrphanLayers(layers.value, layersByCategory.value))

  // Functions
  async function getLayers() {
    layers.value = await catalog.getLayers({
      query: options.layers,
      context: options.context,
      planetApi: options.planetApi
    })
  }
  async function getCategories () {
    categories.value = await catalog.getCategories({
      query: options.categories,
      context: options.context,
      planetApi: options.planetApi
    })
  }
  async function getViews () {
    views.value = await catalog.getViews({
      query: options.views,
      context: options.context,
      planetApi: options.planetApi
    })
  }

  // Expose
  return {
    layers,
    categories,
    layersByCategory,
    orphanLayers,
    views,
    getLayers,
    getCategories,
    getViews
  }
}
