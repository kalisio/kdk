import config from 'config'
import _ from 'lodash'
import logger from 'loglevel'
import sift from 'sift'
import { Store } from '../../../core/client/store.js'
import { Events } from '../../../core/client/events.js'
import { api } from '../../../core/client/api.js'
import { isDataOperation } from '../../../core/client/utils/utils.services.js'
import { bindContent, filterContent, listenToServiceEvents, unlistenToServiceEvents } from '../../../core/client/utils/index.js'
import { Geolocation } from '../geolocation.js'
import { getCategories, getLayers, getLayersByCategory, getOrphanLayers, getSublegends, processTranslations, setEngineJwt } from '../utils/utils.catalog.js'
import * as layers from '../utils/utils.layers.js'
import { getCatalogProjectQuery } from '../utils/utils.project.js'

export const activity = {
  emits: [
    'layer-filter-toggled'
  ],
  data () {
    return {
      layerCategories: [],
      orphanLayers: [],
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
    // Retrieve layer categories from catalog
    async refreshLayerCategories () {
      this.layerCategories.splice(0, this.layerCategories.length)
      const layerCategories = await this.getCatalogCategories()
      for (let i = 0; i < layerCategories.length; i++) {
        this.addCatalogCategory(layerCategories[i])
      }
      await this.refreshOrphanLayers()
      this.reorderLayers()
    },
    getOrphanLayerByName (name) {
      return this.orphanLayers.find(l => l?.name === name)
    },
    isOrphanLayer (layer) {
      return this.orphanLayers.some(l => l?.name === layer.name)
    },
    // To be overriden by apps to perform any operation (eg serialization) when the category order has been changed by the user
    // By default perform layer ordering in the underlying engine
    async updateCategoriesOrder (sourceCategoryId, targetCategoryId) {
      this.reorderLayers()
    },
    // To be overriden by apps to perform any operation (eg serialization) when the layer order has been changed by the user in a category
    // By default perform layer ordering in the underlying engine
    // Data payload is like { layers } in order to ease direct update of the target category
    async updateLayersOrder (sourceCategoryId, data, movedLayer) {
      this.reorderLayers()
    },
    // To be overriden by apps to perform any operations (eg serialization) when the layer order has been changed by the user in the orphan layer list
    // By default perform layer ordering in the underlying engine
    async updateOrphanLayersOrder (orphanLayers, movedLayer) {
      this.reorderLayers()
    },
    // Perform layer ordering in the underlying engine according to current order in categories and layer list
    reorderLayers () {
      if (typeof this.bringLayerToFront !== 'function') return
      for (let i = this.layerCategories.length - 1; i >= 0; i--) {
        const category = this.layerCategories[i]
        if (!category?.layers) continue
        for (let j = category.layers.length - 1; j >= 0; j--) {
          const layer = category.layers[j]
          this.bringLayerToFront(layer)
        }
      }
      for (let i = this.orphanLayers.length - 1; i >= 0; i--) {
        const layer = this.orphanLayers[i]
        this.bringLayerToFront(layer.name)
      }
    },
    // Retrieve layers from catalog
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
      await this.refreshOrphanLayers()
      // We need at least an active background
      const hasVisibleBaseLayer = catalogLayers.find((layer) => (layer.type === 'BaseLayer') && layer.isVisible)
      if (!hasVisibleBaseLayer) {
        const baseLayer = catalogLayers.find((layer) => (layer.type === 'BaseLayer'))
        if (baseLayer) await this.showLayer(baseLayer.name)
      }
      this.reorderLayers()
    },
    // Update orphan layers list (ie layers without any category) based on current loaded categories/layers
    async refreshOrphanLayers () {
      const layersByCategory = getLayersByCategory(this.layers, this.layerCategories)
      this.orphanLayers = getOrphanLayers(this.layers, layersByCategory)
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
      return api.can('create', 'catalog')
    },
    canUpdateLayer (layer) {
      return layers.isInMemoryLayer(layer) || api.can('update', 'catalog')
    },
    canRemoveLayer (layer) {
      return layers.isInMemoryLayer(layer) || api.can('remove', 'catalog')
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
      this.zoomIn()
    },
    onZoomOut () {
      this.zoomOut()
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
      if (this.project && (this.project.getPlanetApi() === api)) {
        this.project.layers.push({ _id: createdLayer._id })
        await api.getService('projects').patch(this.project._id, {
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
    async onRemoveCategory (category) {
      // virtual method
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
    async onAddOrphanLayer (layer) {
      if (!this.isOrphanLayer(layer)) {
        await this.refreshOrphanLayers()
      }
    },
    onRemoveOrphanLayer (layer) {
      if (this.isOrphanLayer(layer)) {
        _.remove(this.orphanLayers, orphanLayer => layer._id ? orphanLayer._id === layer._id : orphanLayer.name === layer.name)
      }
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
      const globalCatalogService = api.getService('catalog', 'global')
      const catalogService = api.getService('catalog')
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
        await this.refreshLayerCategories()
        await this.refreshLayers()
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
    async refreshLayer (layer, event) {
      // Updating a layer requires to remove/add it again to cover all use cases (eg style edition, etc.)
      // Here we preferably find layer by ID as renaming could have occured from another client
      let planetApi
      if (layer && (typeof layer.getPlanetApi === 'function')) {
        planetApi = layer.getPlanetApi()
      }
      if (layer) {
        // Stop any running edition
        if ((typeof this.isLayerEdited === 'function') && this.isLayerEdited(layer)) await this.stopEditLayer('reject')
        // Check if available for current engine
        if (layer[this.engine]) {
          let name = layer.name
          // We might have a patch event changing the name so that in this case we need to use the old one
          // because layers are indexed by name in map activities
          const previousLayer = this.getLayerById(layer._id)
          if (previousLayer && (previousLayer.name !== name)) name = previousLayer.name
          await this.removeLayer(name)
        }
      }
      if (event !== 'removed') {
        // Do we need to inject a token or restore planet API ?
        if (planetApi) Object.assign(layer, { getPlanetApi: () => planetApi })
        await setEngineJwt([layer], planetApi)
        processTranslations(layer)
        await this.addCatalogLayer(layer)
      }
    },
    requestRefreshLayer (layer, event) {
      // As this is used by realtime events we need to avoid reentrance in any case
      // multiple events regarding the same layer come in at almost the same time.
      // This is for instance the case when saving a layer as a created then patched event come in.
      // So we need something similar to _.debounce() but for each possible layer argument.
      // Otherwise when two events are almost received at the same time but target different layers only the last one will be considered.
      // Realtime events only targets layer saved in DB so that they should always have a unique ID we can rely on
      const layerId = layer._id
      const refreshLayer = async () => {
        const requests = this.pendingLayerRefresh[layerId]
        delete this.pendingLayerRefresh[layerId]
        for (let i = 0; i< requests.length; i++) {
          const request = requests[i]
          await this.refreshLayer(request.layer, request.event)
        }
      }
      if (!this.pendingLayerRefresh) this.pendingLayerRefresh = {}
      // If a refresh has already been requested push new event to operation queue
      if (this.pendingLayerRefresh[layerId]) {
        // The way a layer is updated requires to remove/add it again to cover all use cases (eg style edition, etc.).
        // As a consequence create/patch/update operations results in the same operations, we can avoid multiple update by "merging"
        const lastRequest = _.last(this.pendingLayerRefresh[layerId])
        if (isDataOperation(lastRequest.event) !== isDataOperation(event)) {
          this.pendingLayerRefresh[layerId].push({ event, layer })
        } else {
          // The last operation "wins" otherwise
          this.pendingLayerRefresh[layerId].splice(-1, 1, { event, layer })
        }
      } else {
        this.pendingLayerRefresh[layerId] = [{ event, layer }]
        setTimeout(refreshLayer, 500)
      }
    },
    async onCatalogUpdated (object, event) {
      switch (object.type) {
        case 'Category':
          // In any case we rebuild categories
          await this.requestRefreshLayerCategories()
          break
        case 'Context':
        case 'Service':
          // Nothing to do
          break
        default: {
          await this.requestRefreshLayer(object, event)
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
    this.$engineEvents.on('layer-added', this.onAddOrphanLayer)
    this.$engineEvents.on('layer-removed', this.onRemoveOrphanLayer)
    // As we'd like to manage layer ordering we force to refresh it
    // because by default Leaflet will put new elements at the end of the DOM child list.
    this.$engineEvents.on('layer-shown', this.reorderLayers)
  },
  mounted () {
    this.requestRefreshLayerCategories = _.debounce(this.refreshLayerCategories, 200)
    // Target online/offline service depending on status
    Events.on('navigator-disconnected', this.resetCatalogServiceEventsListeners)
    Events.on('navigator-reconnected', this.resetCatalogServiceEventsListeners)
    Events.on('websocket-disconnected', this.resetCatalogServiceEventsListeners)
    Events.on('websocket-reconnected', this.resetCatalogServiceEventsListeners)
  },
  beforeUnmount () {
    this.$engineEvents.off('map-ready', this.onEngineReady)
    this.$engineEvents.off('globe-ready', this.onEngineReady)
    this.$engineEvents.off('layer-added', this.configureLayerActions)
    this.$engineEvents.off('layer-added', this.onAddOrphanLayer)
    this.$engineEvents.off('layer-removed', this.onRemoveOrphanLayer)
    this.$engineEvents.off('layer-shown', this.reorderLayers)
    Events.off('navigator-disconnected', this.resetCatalogServiceEventsListeners)
    Events.off('navigator-reconnected', this.resetCatalogServiceEventsListeners)
    Events.off('websocket-disconnected', this.resetCatalogServiceEventsListeners)
    Events.off('websocket-reconnected', this.resetCatalogServiceEventsListeners)
    this.finalize()
  }
}
