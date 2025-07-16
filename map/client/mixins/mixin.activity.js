import config from 'config'
import _ from 'lodash'
import logger from 'loglevel'
import { Store } from '../../../core/client/index.js'
import { bindContent, filterContent, listenToServiceEvents, unlistenToServiceEvents } from '../../../core/client/utils/index.js'
import { Geolocation } from '../geolocation.js'
import { getCategories, getLayers, getSublegends, setEngineJwt } from '../utils/utils.catalog.js'
import * as layers from '../utils/utils.layers.js'
import { getCatalogProjectQuery } from '../utils/utils.project.js'

export const activity = {
  emits: [
    'layer-filter-toggled'
  ],
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
    // This method should be overriden in activities
    getFeatureActions (feature, layer) {
      return []
    },
    async getCatalogLayers () {
      const query = {}
      // Do we get layers coming from project ?
      if (this.project) {
        Object.assign(query, this.catalogProjectQuery ? this.catalogProjectQuery : getCatalogProjectQuery(this.project))
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
    async getCatalogSublegends () {
      // We get sublegends coming from global catalog first if any
      let sublegends = await getSublegends()
      // Then we get categories coming from contextual catalog if any
      const context = Store.get('context')
      if (context) sublegends = sublegends.concat(await getSublegends({ context }))
      return sublegends
    },
    async addCatalogCategory (category) {
      this.layerCategories.push(category)
    },
    async refreshLayerCategories () {
      this.layerCategories.splice(0, this.layerCategories.length)
      const layerCategories = await this.getCatalogCategories()
      for (let i = 0; i < layerCategories.length; i++) {
        this.addCatalogCategory(layerCategories[i])
      }
      if (typeof this.reorganizeLayers === 'function') this.reorganizeLayers()
    },
    async updateCategoriesOrder (sourceCategoryId, targetCategoryId) {
      // virtual method
    },
    async updateLayersOrder (sourceCategoryId, data) {
      // virtual method
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
    isLayerCached: layers.isLayerCached,
    isLayerCachable: layers.isLayerCachable,
    setLayerCached: layers.setLayerCached,
    setLayerUncached: layers.setLayerUncached,
    isLayerEditable: layers.isLayerEditable,
    isLayerFilterEditable: layers.isLayerFilterEditable,
    isLayerRemovable: layers.isLayerRemovable,
    isLayerStyleEditable: layers.isLayerStyleEditable,
    isLayerDataEditable: layers.isLayerDataEditable,
    canCreateLayer () {
      return this.$can('create', 'catalog')
    },
    canUpdateLayer (layer) {
      return layers.isInMemoryLayer(layer) || this.$can('update', 'catalog')
    },
    canRemoveLayer (layer) {
      return layers.isInMemoryLayer(layer) || this.$can('remove', 'catalog')
    },
    async resetLayer (layer) {
      // This requires to recreate the layer in the underlying engine with the new setup.
      // So it's only necessary if the layer is already visible.
      const isVisible = this.isLayerVisible(layer.name)
      if (isVisible) {
        // Keep track of data as the reset will los it for in-memory layers
        let geoJson
        if (layers.isInMemoryLayer(layer) && (typeof this.toGeoJson === 'function')) geoJson = await this.toGeoJson(layer.name)
        await this.hideLayer(layer.name)
        await this.showLayer(layer.name)
        if (geoJson) this.updateLayer(layer.name, geoJson)
        // If min/max zoom configuration has changed we need to refresh this state as well
        if (typeof this.updateLayerDisabled === 'function') this.updateLayerDisabled(layer)
      }
    },
    configureLayerActions (layer) {
      let actions = _.get(this, 'activityOptions.layers.actions', [])
      // Apply filtering
      actions = filterContent(actions, _.get(this, 'activityOptions.layers.filter', {}))

      // As context is different for each item we need to clone the global action configuration
      // otherwise context will always reference the last processed item
      actions = bindContent(_.cloneDeep(actions), this, ['dialog'])
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
      // removeMissing seems needed for 3d
      if (typeof this.updateLayer === 'function') await this.updateLayer(layer.name, null, { removeMissing: true })

      this.$emit('layer-filter-toggled', layer, filter)
      this.$engineEvents.emit('layer-filter-toggled', layer, filter)
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
    onBringLayerToFront (layer) {
      if (typeof this.bringLayerToFront === 'function') this.bringLayerToFront(layer.name)
    },
    onBringLayerToBack (layer) {
      if (typeof this.bringLayerToBack === 'function') this.bringLayerToBack(layer.name)
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
      // Add layer to current project ? Check if not coming from another planet first
      if (this.project && (this.project.getPlanetApi() === this.$api)) {
        this.project.layers.push({ _id: createdLayer._id })
        await this.$api.getService('projects').patch(this.project._id, {
          layers: this.project.layers
        })
      }
      // Reset layer with new setup
      // It should be triggerred by real-time event
      // but as we might not always use sockets perform it anyway
      if (createdLayer) {
        layer._id = createdLayer._id
        await this.resetLayer(createdLayer)
      }
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
    async onResetLayerStyle (layer) {
      await layers.editLayerStyle(layer, {})
      if (!layer._id) {
        await this.resetLayer(layer)
      }
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
    listenToCatalogServiceEvents () {
      // Listen about changes in global/contextual catalog services
      const globalCatalogService = this.$api.getService('catalog', 'global')
      const catalogService = this.$api.getService('catalog')
      this.globalCatalogListeners = listenToServiceEvents('catalog', {
        context: 'global', all: this.onCatalogUpdated, removed: (object) => this.onCatalogUpdated(object, 'removed')
      }, this.globalCatalogListeners)
      if (catalogService && (catalogService !== globalCatalogService)) {
        this.catalogListeners = listenToServiceEvents('catalog', {
          all: this.onCatalogUpdated, removed: (object) => this.onCatalogUpdated(object, 'removed')
        }, this.catalogListeners)
      }
    },
    unlistenToCatalogServiceEvents () {
      if (this.globalCatalogListeners) unlistenToServiceEvents(this.globalCatalogListeners)
      if (this.catalogListeners) unlistenToServiceEvents(this.catalogListeners)
      this.globalCatalogListeners = null
      this.catalogListeners = null
    },
    resetCatalogServiceEventsListeners () {
      // Listening again will unlisten previous ones if any
      this.listenToCatalogServiceEvents()
    },
    async initialize () {
      // Check if the activity is using context restoration
      const hasContext = (typeof this.restoreContext === 'function')
      // Retrieve the forecast models
      const weacastEnabled = _.get(config, 'weacast.enabled', true)
      if (weacastEnabled && this.setupWeacast) {
        try {
          await this.setupWeacast()
        } catch (error) {
          logger.error('[KDK]', error)
        }
      } else {
        if (weacastEnabled) logger.warn('[KDK] Weacast setup function is missing')
        else logger.debug('[KDK] disabling Weacast')
      }
      // Retrieve the layers
      try {
        await this.refreshLayers()
        await this.refreshLayerCategories()
        if (hasContext) await this.restoreContext('layers')
      } catch (error) {
        logger.error('[KDK]', error)
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
      this.listenToCatalogServiceEvents()
    },
    finalize () {
      this.unlistenToCatalogServiceEvents()
    },
    async onCatalogUpdated (object, event) {
      switch (object.type) {
        case 'Category':
          // In any case we rebuild categories
          await this.debouncedRefreshLayerCategories()
          break
        case 'Context':
        case 'Service':
          // Nothing to do
          break
        default: {
          // Updating a layer requires to remove/add it again to cover all use cases (eg style edition, etc.)
          // Here we preferably find layer by ID as renaming could have occured from another client
          const layer = this.getLayerById(object._id) || this.getLayerByName(object.name)
          let planetApi
          if (layer && (typeof layer.getPlanetApi === 'function')) {
            planetApi = layer.getPlanetApi()
          }
          if (layer) {
            // Stop any running edition
            if ((typeof this.isLayerEdited === 'function') && this.isLayerEdited(layer)) await this.stopEditLayer('reject')
            await this.removeCatalogLayer(layer)
          }
          if (event !== 'removed') {
            // Do we need to inject a token or restore planet API ?
            if (planetApi) Object.assign(object, { getPlanetApi: () => planetApi })
            await setEngineJwt([object], planetApi)
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
      logger.debug(`[KDK] Configuring '${this.engine}' engine with options:`, defaultOptions)
      // Take care that if we only use the default options the specific options will be undefined
      this.activityOptions.engine = _.defaultsDeep(_.get(this.activityOptions, 'engine', {}), defaultOptions)
    }
    // Listen to map events
    this.$engineEvents.on('map-ready', this.onEngineReady)
    this.$engineEvents.on('globe-ready', this.onEngineReady)
    this.$engineEvents.on('layer-added', this.configureLayerActions)
  },
  mounted () {
    this.debouncedRefreshLayerCategories = _.debounce(this.refreshLayerCategories, 200)
    // Target online/offline service depending on status
    this.$events.on('navigator-disconnected', this.resetCatalogServiceEventsListeners)
    this.$events.on('navigator-reconnected', this.resetCatalogServiceEventsListeners)
    this.$events.on('websocket-disconnected', this.resetCatalogServiceEventsListeners)
    this.$events.on('websocket-reconnected', this.resetCatalogServiceEventsListeners)
  },
  beforeUnmount () {
    this.$engineEvents.off('map-ready', this.onEngineReady)
    this.$engineEvents.off('globe-ready', this.onEngineReady)
    this.$engineEvents.off('layer-added', this.configureLayerActions)
    this.$events.off('navigator-disconnected', this.resetCatalogServiceEventsListeners)
    this.$events.off('navigator-reconnected', this.resetCatalogServiceEventsListeners)
    this.$events.off('websocket-disconnected', this.resetCatalogServiceEventsListeners)
    this.$events.off('websocket-reconnected', this.resetCatalogServiceEventsListeners)
    this.finalize()
  }
}
