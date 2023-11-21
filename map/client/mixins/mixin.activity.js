import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { i18n, Store, utils as kCoreUtils } from '../../../core/client/index.js'
import { Geolocation } from '../geolocation.js'
import { setEngineJwt, getLayers, getCategories } from '../utils/utils.catalog.js'
import * as layers from '../utils/utils.layers.js'
import { getProjectQuery } from '../utils/utils.project.js'

export const activity = {
  data () {
    return {
      layerCategories: [],
      variables: [],
      engine: 'leaflet',
      engineReady: false,
      engineContainerWidth: null,
      engineContainerHeight: null
    }
  },
  computed: {
    viewStyle () {
      return 'width: 100%; height: 100%; fontWeight: normal; zIndex: 0; position: absolute;'
    },
    variablesForCurrentLevel () {
      return this.variables.map(variable => Object.assign({ name: `${variable.name}-${this.selectedLevel}` }, _.omit(variable, ['name'])))
    },
    currentVariables () {
      return this.forecastLevel ? this.variablesForCurrentLevel : this.variables
    }
  },
  methods: {
    is2D () {
      return (this.engine === 'leaflet')
    },
    is3D () {
      return (this.engine === 'cesium')
    },
    hasProject () {
      return _.has(this.$route, 'query.project')
    },
    // This method should be overriden in activities
    getFeatureActions (feature, layer) {
      return []
    },
    async getCatalogLayers () {
      const query = {}
      // Do we get layers coming from project ?
      if (this.hasProject()) {
        this.project = await this.$api.getService('projects').get(_.get(this.$route, 'query.project'))
        Object.assign(query, getProjectQuery(this.project))
      } else {
        this.project = null
      }

      // We get layers coming from global catalog first if any
      let layers = await getLayers({ query })
      // Then we get layers coming from contextual catalog if any
      const context = Store.get('context')
      if (context) layers = layers.concat(await getLayers({ query, context }))
      return layers
    },
    async addCatalogLayer (layer) {
      // Check if available for current engine
      if (layer[this.engine]) {
        // Check for Weacast API availability
        const isWeacastLayer = _.get(layer, `${this.engine}.type`, '').startsWith('weacast.')
        if (isWeacastLayer && (!this.getWeacastApi() || !this.forecastModel)) return
        await this.addLayer(layer)
      }
      // Filter layers with variables, not just visible ones because we might want to
      // probe weather even if there is no visual representation (e.g. in globe)
      // FIXME: https://github.com/kalisio/kdk/issues/375
      if (layer.variables) this.variables = _.uniqBy(this.variables.concat(layer.variables), (variable) => variable.name)
    },
    async removeCatalogLayer (layer) {
      // Check if available for current engine
      if (layer[this.engine]) {
        await this.removeLayer(layer.name)
      }
    },
    async getCatalogCategories () {
      // We get categories coming from global catalog first if any
      let categories = await getCategories()
      // Then we get categories coming from contextual catalog if any
      const context = Store.get('context')
      if (context) categories = categories.concat(await getCategories({ context }))
      return categories
    },
    async addCatalogCategory (category) {
      // Process i18n
      if (category.i18n) i18n.registerTranslation(category.i18n)
      category.label = this.$tie(category.name)
      category.description = this.$tie(category.description)
      this.layerCategories.push(category)
    },
    async refreshLayerCategories () {
      this.layerCategories.splice(0, this.layerCategories.length)
      const layerCategories = await this.getCatalogCategories()
      for (let i = 0; i < layerCategories.length; i++) {
        this.addCatalogCategory(layerCategories[i])
      }
    },
    async refreshLayers () {
      // Clear layers and variables
      this.clearLayers()
      this.variables = []
      const catalogLayers = await this.getCatalogLayers()
      // Iterate and await layers as creation is async and we need to have all layers ready
      // before checking if there is some background layer
      for (let i = 0; i < catalogLayers.length; i++) {
        await this.addCatalogLayer(catalogLayers[i])
      }
      // We need at least an active background
      const hasVisibleBaseLayer = catalogLayers.find((layer) => (layer.type === 'BaseLayer') && layer.isVisible)
      if (!hasVisibleBaseLayer) {
        const baseLayer = catalogLayers.find((layer) => (layer.type === 'BaseLayer'))
        if (baseLayer) await this.showLayer(baseLayer.name)
      }
    },
    isInMemoryLayer: layers.isInMemoryLayer,
    isUserLayer: layers.isUserLayer,
    isFeatureLayer: layers.isFeatureLayer,
    hasFeatureSchema: layers.hasFeatureSchema,
    isLayerSelectable (layer) {
      // Only possible when not edited by default
      if ((typeof this.isLayerEdited === 'function') && this.isLayerEdited(layer)) return false
      return layers.isLayerSelectable(layer)
    },
    isLayerProbable: layers.isLayerProbable,
    isLayerStorable: layers.isLayerStorable,
    isLayerEditable: layers.isLayerEditable,
    isLayerRemovable: layers.isLayerRemovable,
    isLayerStyleEditable: layers.isLayerStyleEditable,
    isLayerDataEditable: layers.isLayerDataEditable,
    async resetLayer (layer) {
      // Reset layer with new setup but keep track of current visibility state
      // as adding the layer back will restore default visibility state
      const isVisible = this.isLayerVisible(layer.name)
      await this.removeLayer(layer.name)
      await this.addLayer(layer)
      if (isVisible) await this.showLayer(layer.name)
    },
    configureLayerActions (layer) {
      let actions = _.get(this, 'activityOptions.layers.actions', [])
      // Apply filtering
      actions = kCoreUtils.filterContent(actions, _.get(this, 'activityOptions.layers.filter', {}))
      // As context is different for each item we need to clone the global action configuration
      // otherwise context will always reference the last processed item
      actions = kCoreUtils.bindContent(_.cloneDeep(actions), this)
      // Add 'virtual' actions used to trigger the layer/filters
      actions.push({ id: 'toggle', handler: () => this.onTriggerLayer(layer) })
      actions.push({ id: 'toggle-filter', handler: (filter) => this.onTriggerLayerFilter(layer, filter) })
      // Store the actions
      layer.actions = actions
      return actions
    },
    async onTriggerLayer (layer) {
      if (!this.isLayerVisible(layer.name)) {
        await this.showLayer(layer.name)
      } else {
        await this.hideLayer(layer.name)
      }
      // Check if the activity is using context restoration
      const hasContext = (typeof this.storeContext === 'function')
      if (hasContext) this.storeContext('layers')
    },
    async onTriggerLayerFilter (layer, filter) {
      // Can only apply to realtime layers as we need to force a data refresh
      if (typeof this.updateLayer === 'function') await this.updateLayer(layer.name)
    },
    onZoomIn () {
      const center = this.getCenter()
      this.center(center.longitude, center.latitude, center.zoomLevel ? center.zoomLevel + 1 : center.altitude * 0.5)
    },
    onZoomOut () {
      const center = this.getCenter()
      this.center(center.longitude, center.latitude, center.zoomLevel ? center.zoomLevel - 1 : center.altitude * 2)
    },
    onZoomToLayer (layer) {
      this.zoomToLayer(layer.name)
    },
    async onSaveLayer (layer) {
      // Stop any running edition
      if ((typeof this.isLayerEdited === 'function') && this.isLayerEdited(layer)) await this.stopEditLayer('accept')
      let createdLayer
      // Take care that WFS layers rely on the same type as our own feature layers
      if (!_.has(layer, 'wfs') && _.get(layer, `${this.engine}.type`) === 'geoJson') {
        const geoJson = this.toGeoJson(layer.name)
        createdLayer = await layers.saveGeoJsonLayer(layer, geoJson, _.get(this, 'activityOptions.featuresChunkSize', 5000))
      } else {
        // Otherwise simply save in catalog
        createdLayer = await layers.saveLayer(layer)
      }
      // Add layer to current project ?
      if (this.hasProject()) {
        this.project.layers.push({ _id: createdLayer._id })
        await this.$api.getService('projects').patch(this.project._id, {
          layers: this.project.layers
        })
      }
      // Reset layer with new setup
      // It should be triggerred by real-time event
      // but as we might not always use sockets perform it anyway
      if (createdLayer) await this.resetLayer(createdLayer)
    },
    editLayerByName (name, editOptions = {}) {
      // this one is used through postRobot to trigger edition
      // on a layer
      const layer = this.getLayerByName(name)
      if (!layer) return
      this.startEditLayer(layer, editOptions)
    },
    async onEditLayerData (layer) {
      // this one is triggered by a layer action (toggle)
      if (this.isLayerEdited(layer)) {
        // always accept editions in the action
        await this.stopEditLayer('accept')
      } else {
        // start editing properties by default
        await this.startEditLayer(layer, { editMode: 'edit-properties' })
      }
    },
    async onEndLayerEdition (status = 'accept') {
      // this one can be triggered from a toolbar to accept or reject changes
      await this.stopEditLayer(status)
    },
    async onRemoveLayer (layer) {
      // Stop any running edition
      if ((typeof this.isLayerEdited === 'function') && this.isLayerEdited(layer)) await this.stopEditLayer('reject')
      if (await layers.removeLayer(layer)) {
        // Actual layer removal should be triggerred by real-time event
        // but as we might not always use sockets perform it anyway
        this.removeLayer(layer.name)
      }
      // Removing the layer should automatically update all projects
    },
    onEngineReady (engine) {
      this.engine = engine
      this.engineReady = true
    },
    onToggleFullscreen () {
      if (!this.$q.fullscreen.isActive) this.$q.fullscreen.request()
      else this.$q.fullscreen.exit()
    },
    async initialize () {
      // Check if the activity is using context restoration
      const hasContext = (typeof this.restoreContext === 'function')
      // Retrieve the forecast models
      if (this.setupWeacast) {
        try {
          await this.setupWeacast()
        } catch (error) {
          logger.error(`[KDK] ${error}`)
        }
      }
      // Retrieve the layers
      try {
        await this.refreshLayerCategories()
        await this.refreshLayers()
        if (hasContext) await this.restoreContext('layers')
      } catch (error) {
        logger.error(`[KDK] ${error}`)
      }
      // Retrieve the time
      if (hasContext) await this.restoreContext('time')
      // Geolocate by default if view has not been restored
      const viewRestored = (hasContext ? await this.restoreContext('view') : false)
      if (!viewRestored && _.get(this, 'activityOptions.restore.geolocation', true)) {
        // Provided by geolocation if enabled
        await Geolocation.update()
        if (Geolocation.hasLocation()) this.center(Geolocation.getLongitude(), Geolocation.getLatitude())
      }
      // Listen about changes in global/contextual catalog services
      const globalCatalogService = this.$api.getService('catalog', '')
      const catalogService = this.$api.getService('catalog')
      // Keep track of binded listeners as we use the same function with different contexts
      this.catalogListeners = {}
      if (globalCatalogService.events !== undefined) {
        globalCatalogService.events.forEach(event => {
          this.catalogListeners[event] = (object) => this.onCatalogUpdated(event, object)
          globalCatalogService.on(event, this.catalogListeners[event])
          if (catalogService && (catalogService !== globalCatalogService)) {
            catalogService.on(event, this.catalogListeners[event])
          }
        })
      }
    },
    finalize () {
      // Stop listening about changes in global/contextual catalog services
      const globalCatalogService = this.$api.getService('catalog', '')
      const catalogService = this.$api.getService('catalog')
      if (globalCatalogService.events !== undefined) {
        globalCatalogService.events.forEach(event => {
          globalCatalogService.removeListener(event, this.catalogListeners[event])
          if (catalogService && (catalogService !== globalCatalogService)) {
            catalogService.removeListener(event, this.catalogListeners[event])
          }
        })
      }
      this.catalogListeners = {}
    },
    async onCatalogUpdated (event, object) {
      switch (object.type) {
        case 'Category':
          // In any case we rebuild categories
          this.refreshLayerCategories()
          break
        case 'Context':
        case 'Service':
          // Nothing to do
          break
        default: {
          // Updating a layer requires to remove/add it again to cover all use cases
          // (eg style edition, etc.)
          // Here we find layer by ID as renaming could have occured from another client
          const layer = this.getLayerById(object._id)
          if (layer) {
            // Stop any running edition
            if ((typeof this.isLayerEdited === 'function') && this.isLayerEdited(layer)) await this.stopEditLayer('reject')
            await this.removeCatalogLayer(layer)
          }
          if (event !== 'removed') {
            // Do we need to inject a token ?
            await setEngineJwt([object])
            await this.addCatalogLayer(object)
          }
          break
        }
      }
    }
  },
  // Need to be in the first lifecycle hook as others mixins might use activity options
  created () {
    // Merge the engine options using defaults
    const defaultOptions = _.get(config, `engines.${this.engine}`)
    if (defaultOptions) {
      logger.debug(`[KDK] ${this.engine} engine use defaults: ${JSON.stringify(defaultOptions, null, 2)}`)
      // Take care that if we only use the default options the specific options will be undefined
      this.activityOptions.engine = _.defaultsDeep(_.get(this.activityOptions, 'engine', {}), defaultOptions)
    }
  },
  mounted () {
    this.$engineEvents.on('map-ready', this.onEngineReady)
    this.$engineEvents.on('globe-ready', this.onEngineReady)
    this.$engineEvents.on('layer-added', this.configureLayerActions)
  },
  beforeUnmount () {
    this.$engineEvents.off('map-ready', this.onEngineReady)
    this.$engineEvents.off('globe-ready', this.onEngineReady)
    this.$engineEvents.off('layer-added', this.configureLayerActions)
    this.finalize()
  }
}
