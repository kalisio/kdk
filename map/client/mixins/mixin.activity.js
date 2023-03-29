import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import explode from '@turf/explode'
import { Loading, Dialog } from 'quasar'
import { setEngineJwt } from '../utils.js'
import { utils as kCoreUtils } from '../../../core/client/index.js'

export const activity = {
  data () {
    return {
      forecastModelHandlers: {},
      layerCategories: [],
      variables: [],
      engine: 'leaflet',
      engineReady: false,
      engineContainerWidth: null,
      engineContainerHeight: null,
      selectedLayer: null
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
      let layers = []
      // We get layers coming from global catalog first if any
      const globalCatalogService = this.$api.getService('catalog', '')
      if (globalCatalogService) {
        const response = await globalCatalogService.find()
        layers = layers.concat(response.data)
      }
      // Then we get layers coming from contextual catalog if any
      const catalogService = this.$api.getService('catalog')
      if (catalogService && (catalogService !== globalCatalogService)) {
        const response = await catalogService.find()
        layers = layers.concat(response.data)
      }
      // Do we need to inject a token ?
      await setEngineJwt(layers)
      return layers
    },
    async addCatalogLayer (layer) {
      // Check if available for current engine
      if (layer[this.engine]) {
        // Process i18n
        if (layer.i18n) {
          const locale = kCoreUtils.getAppLocale()
          const fallbackLocale = kCoreUtils.getAppFallbackLocale()
          let i18n = _.get(layer.i18n, locale)
          if (i18n) this.$i18n.mergeLocaleMessage(locale, i18n)
          i18n = _.get(layer.i18n, fallbackLocale)
          if (i18n) this.$i18n.mergeLocaleMessage(fallbackLocale, i18n)
        }
        if (layer.name && this.$te(layer.name)) layer.label = this.$t(layer.name)
        if (layer.description && this.$te(layer.description)) layer.description = this.$t(layer.description)
        // Check for Weacast API availability
        const isWeacastLayer = _.get(layer, `${this.engine}.type`, '').startsWith('weacast.')
        if (isWeacastLayer && (!this.weacastApi || !this.forecastModel)) return
        await this.addLayer(layer)
      }
      // Filter layers with variables, not just visible ones because we might want to
      // probe weather even if there is no visual representation (e.g. in globe)
      if (layer.variables) this.variables = _.uniqBy(this.variables.concat(layer.variables), (variable) => variable.name)
    },
    async removeCatalogLayer (layer) {
      // Check if available for current engine
      if (layer[this.engine]) {
        await this.removeLayer(layer.name)
      }
    },
    async getCatalogCategories () {
      let categories = []
      // We get categories coming from global catalog first if any
      const globalCatalogService = this.$api.getService('catalog', '')
      if (globalCatalogService) {
        const response = await globalCatalogService.find({ query: { type: 'Category' } })
        categories = categories.concat(response.data)
      }
      // Then we get categories coming from contextual catalog if any
      const catalogService = this.$api.getService('catalog')
      if (catalogService && (catalogService !== globalCatalogService)) {
        const response = await catalogService.find({ query: { type: 'Category' } })
        categories = categories.concat(response.data)
      }
      return categories
    },
    async addCatalogCategory (category) {
      // Process i18n
      if (category.i18n) {
        const locale = kCoreUtils.getAppLocale()
        const fallbackLocale = kCoreUtils.getAppFallbackLocale()
        let i18n = _.get(category.i18n, locale)
        if (i18n) this.$i18n.mergeLocaleMessage(locale, i18n)
        i18n = _.get(category.i18n, fallbackLocale)
        if (i18n) this.$i18n.mergeLocaleMessage(fallbackLocale, i18n)
      }
      if (category.name && this.$te(category.name)) category.label = this.$t(category.name)
      if (category.description && this.$te(category.description)) category.description = this.$t(category.description)
      this.layerCategories.push(category)
    },
    async refreshLayerCategories () {
      this.layerCategories = []
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
    isUserLayer (layer) {
      return (_.get(layer, 'scope') === 'user')
    },
    isFeatureLayer (layer) {
      return (_.get(layer, 'service') === 'features')
    },
    hasFeatureSchema (layer) {
      return _.has(layer, 'schema')
    },
    isLayerSelectable (layer) {
      // Only possible when not edited by default
      if ((typeof this.isLayerEdited === 'function') && this.isLayerEdited(layer)) return false
      return _.get(layer, 'isSelectable', true)
    },
    isLayerProbable (layer) {
      return _.get(layer, 'isProbable', false)
    },
    isLayerStorable (layer) {
      // Only possible when not saved by default
      if (layer._id) return false
      return _.get(layer, 'isStorable', this.isUserLayer(layer))
    },
    isLayerEditable (layer) {
      // Only possible when saved by default
      if (!layer._id) return false
      return _.get(layer, 'isEditable', this.isUserLayer(layer))
    },
    isLayerRemovable (layer) {
      return _.get(layer, 'isRemovable', this.isUserLayer(layer))
    },
    isLayerStyleEditable (layer) {
      return _.get(layer, 'isStyleEditable', this.isUserLayer(layer))
    },
    isLayerDataEditable (layer) {
      return _.get(layer, 'isDataEditable', this.isUserLayer(layer) && this.isFeatureLayer(layer))
    },
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
      // Add 'virtual' action used to trigger the layer
      actions.push({ id: 'toggle', handler: () => this.onTriggerLayer(layer) })
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
    onZoomIn () {
      const center = this.getCenter()
      this.center(center.longitude, center.latitude, center.zoomLevel ? center.zoomLevel + 1 : center.altitude * 0.5)
    },
    onZoomOut () {
      const center = this.getCenter()
      this.center(center.longitude, center.latitude, center.zoomLevel ? center.zoomLevel - 1 : center.altitude * 2)
    },
    onSelectLayer (layer) {
      this.selectedLayer = layer
    },
    onZoomToLayer (layer) {
      this.zoomToLayer(layer.name)
    },
    async onSaveLayer (layer) {
      // Take care that WFS layers rely on the same type as our own feature layers
      if (!_.has(layer, 'wfs') && _.get(layer, `${this.engine}.type`) === 'geoJson') {
        const geoJson = this.toGeoJson(layer.name)
        // Check for invalid features first
        const check = this.checkFeatures(geoJson)
        if (check.kinks.length > 0) {
          const result = await kCoreUtils.dialog({
            title: this.$t('mixins.activity.INVALID_FEATURES_DIALOG_TITLE', { features: check.kinks }),
            message: this.$t('mixins.activity.INVALID_FEATURES_DIALOG_MESSAGE', { features: check.kinks }),
            options: {
              type: 'toggle',
              model: [],
              items: [
                { label: this.$t('mixins.activity.DOWNLOAD_INVALID_FEATURES_LABEL'), value: 'download' }
              ]
            },
            html: true,
            ok: {
              label: this.$t('OK'),
              flat: true
            },
            cancel: {
              label: this.$t('CANCEL'),
              flat: true
            }
          })
          if (!result.ok) return
          // Export invalid features if required
          if (_.get(result, 'data', []).includes('download')) {
            kCoreUtils.downloadAsBlob(JSON.stringify({ type: 'FeatureCollection', features: check.kinks }),
              this.$t('mixins.activity.INVALID_FEATURES_FILE'), 'application/json;charset=utf-8;')
          }
        }
        // Change data source from in-memory to features service
        _.set(layer, 'service', 'features')
        if (_.has(layer, 'leaflet')) _.set(layer, 'leaflet.source', '/api/features')
        if (_.has(layer, 'cesium')) _.set(layer, 'cesium.source', '/api/features')
        const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
        // If too much data use tiling
        // The threshold is based on the number of points and not features.
        // Indeed otherwise the complexity will be different depending on the geometry type
        // (eg a bucket of 1000 polygons can actually contains a lot of points).
        let nbPoints = 0
        features.forEach(feature => {
          nbPoints += explode(feature).features.length
        })
        if (this.is2D() && (nbPoints > 5000)) {
          _.set(layer, 'leaflet.tiled', true)
          _.set(layer, 'leaflet.minZoom', 15)
        }
        Loading.show({ message: this.$t('mixins.activity.SAVING_LABEL', { processed: 0, total: features.length }) })
        try {
          let createdLayer = await this.$api.getService('catalog')
            .create(_.omit(layer, ['actions', 'label', 'isVisible', 'isDisabled']))
          const chunkSize = _.get(this, 'activityOptions.featuresChunkSize', 5000)
          let nbFeatures = 0
          // We use the generated DB ID as layer ID on features
          await this.createFeatures(geoJson, createdLayer._id, chunkSize, (i, chunk) => {
            // Update saving message according to new chunk data
            nbFeatures += chunk.length
            Loading.show({
              message: this.$t('mixins.activity.SAVING_LABEL', { processed: nbFeatures, total: features.length })
            })
          })
          // Because we save all features in a single service use filtering to separate layers
          createdLayer = await this.$api.getService('catalog').patch(createdLayer._id, { baseQuery: { layer: createdLayer._id } })
          // Reset layer with new setup
          await this.resetLayer(createdLayer)
          if (_.get(layer, 'leaflet.tiled')) {
            this.$notify({ type: 'positive', message: this.$t('mixins.activity.SAVE_DIALOG_MESSAGE'), timeout: 10000, html: true })
          }
        } catch (error) {
          // User error message on operation should be raised by error hook, otherwise this is more a coding error
          logger.error(`[KDK] ${error}`)
        }
        Loading.hide()
      } else {
        // Otherwise simply save in catalog
        const createdLayer = await this.$api.getService('catalog')
          .create(_.omit(layer, ['actions', 'label', 'isVisible', 'isDisabled']))
        // Reset layer with new setup
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
    onEditLayerData (layer) {
      // this one is triggered by a layer action (toggle)
      if (this.isLayerEdited(layer)) {
        // always accept editions in the action
        this.stopEditLayer('accept')
      } else {
        // start editing properties by default
        this.startEditLayer(layer, { editMode: 'edit-properties' })
      }
    },
    onEndLayerEdition (status = 'accept') {
      // this one can be triggered from a toolbar to accept or reject changes
      this.stopEditLayer(status)
    },
    async onRemoveLayer (layer) {
      Dialog.create({
        title: this.$t('mixins.activity.REMOVE_DIALOG_TITLE', { layer: layer.label || layer.name }),
        message: this.$t('mixins.activity.REMOVE_DIALOG_MESSAGE', { layer: layer.label || layer.name }),
        html: true,
        ok: {
          label: this.$t('OK'),
          flat: true
        },
        cancel: {
          label: this.$t('CANCEL'),
          flat: true
        }
      }).onOk(async () => {
        Loading.show({ message: this.$t('mixins.activity.REMOVING_LABEL') })
        try {
          // Stop any running edition
          if ((typeof this.isLayerEdited === 'function') && this.isLayerEdited(layer)) this.onEditLayerData(layer)
          if (layer._id) {
            // If persistent feature layer remove features as well
            if (this.isFeatureLayer(layer)) {
              await this.removeFeatures(layer._id)
            }
            await this.$api.getService('catalog').remove(layer._id)
          }
          // Actual layer removal should be triggerred by real-time event
          // but as we might not always use sockets perform it anyway
          this.removeLayer(layer.name)
        } catch (error) {
          // User error message on operation should be raised by error hook, otherwise this is more a coding error
          logger.error(`[KDK] ${error}`)
        }
        Loading.hide()
      })
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
        this.forecastModelHandlers = { toggle: (model) => this.setForecastModel(model) }
      } else {
        this.forecastModelHandlers = {}
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
        if (!this.$geolocation.get().position) await this.$geolocation.update()
        const position = this.$geolocation.get().position
        if (position) this.center(position.longitude, position.latitude)
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
          if (layer) await this.removeCatalogLayer(layer)
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
  beforeMount () {
    // Merge the engine options using defaults
    const defaultOptions = _.get(config, `engines.${this.engine}`)
    if (defaultOptions) {
      logger.debug(`[KDK] ${this.engine} engine use defaults: ${JSON.stringify(defaultOptions, null, 2)}`)
      this.activityOptions.engine = _.defaultsDeep(this.activityOptions.engine, defaultOptions)
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
