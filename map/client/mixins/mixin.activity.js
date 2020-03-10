import _ from 'lodash'
import sift from 'sift'
import moment from 'moment'
import logger from 'loglevel'
import centroid from '@turf/centroid'
import { Dialog } from 'quasar'
import { setGatewayJwt } from '../utils'

export default function (name) {
  return {
    inject: ['klayout'],
    data () {
      return {
        forecastModelHandlers: {},
        layerCategories: [],
        variables: [],
        probedLocation: null,
        engine: 'leaflet',
        engineReady: false,
        engineContainerWidth: null,
        engineContainerHeight: null
      }
    },
    computed: {
      appName () {
        return this.$config('appName')
      },
      viewStyle () {
        return 'width: 100%; height: 100%; fontWeight: normal; zIndex: 0; position: absolute;'
      },
      variablesForCurrentLevel () {
        return this.variables.map(variable => Object.assign({ name: `${variable.name}-${this.selectedLevel}` }, _.omit(variable, ['name'])))
      },
      currentVariables () {
        return this.hasSelectableLevels ? this.variablesForCurrentLevel : this.variables
      },
      timelineEnabled () {
        // For now only weather forecast requires timeline
        return (_.values(this.layers).find(layer => layer.isVisible && layer.tags && layer.tags.includes('weather')) ||
            ((typeof this.isTimeseriesOpen === 'function') && this.isTimeseriesOpen()))
      }
    },
    methods: {
      is2D () {
        return (this.engine === 'leaflet')
      },
      is3D () {
        return (this.engine === 'cesium')
      },
      setNavigationBar (locationInput, beforeActions, afterActions) {
        const navigationBar = { locationInput, actions: { before: beforeActions, after: afterActions } }
        this.$store.patch('navigationBar', navigationBar)
      },
      clearNavigationBar () {
        const navigationBar = { locationInput: false, actions: { before: [], afte: [] } }
        this.$store.patch('navigationBar', navigationBar)
      },
      registerActivityActions () {
        // FAB
        let defaultActions = ['track-location', 'probe-location']
        if (this.is2D()) defaultActions = defaultActions.concat(['create-layer'])
        const actions = _.get(this, 'activityOptions.actions', defaultActions)
        const hasProbeLocationAction = (typeof this.onProbeLocation === 'function') && actions.includes('probe-location') && this.weacastApi && this.forecastModel
        const hasCreateLayerAction = (typeof this.onCreateLayer === 'function') && actions.includes('create-layer')
        if (hasProbeLocationAction) {
          this.registerFabAction({
            name: 'probe', label: this.$t('mixins.activity.PROBE'), icon: 'colorize', handler: this.onProbeLocation
          })
        }
        if (hasCreateLayerAction) {
          this.registerFabAction({
            name: 'create-layer', label: this.$t('mixins.activity.CREATE_LAYER'), icon: 'add', handler: this.onCreateLayer
          })
        }
        // Nav bar
        let defaultTools = ['side-nav', 'zoom', 'track-location', 'location-bar', 'fullscreen', 'catalog']
        if (this.engine === 'cesium') defaultTools = defaultTools.concat(['globe', 'vr'])
        else defaultTools = defaultTools.concat(['map'])
        const tools = _.get(this, 'activityOptions.tools', defaultTools)
        const hasSideNavTool = tools.includes('side-nav')
        const hasMapTool = tools.includes('map')
        const hasGlobeTool = tools.includes('globe')
        const hasVrTool = tools.includes('vr')
        const hasFullscreenTool = (typeof this.onToggleFullscreen === 'function') && tools.includes('fullscreen')
        const hasZoomTool = tools.includes('zoom')
        const hasTrackLocationTool = (typeof this.createLocationIndicator === 'function') && tools.includes('track-location')
        const hasLocationTool = tools.includes('location-bar')
        const hasCatalogTool = tools.includes('catalog')
        const beforeActions = []
        if (hasSideNavTool) {
          beforeActions.push({
            name: 'sidenav-toggle',
            label: this.$t('mixins.activity.TOGGLE_SIDENAV'),
            icon: 'menu',
            handler: () => { this.klayout.toggleLeftDrawer() }
          })
          beforeActions.push({ name: 'separator' })
        }
        if (hasZoomTool) {
          beforeActions.push({
            name: 'zoom-in', label: this.$t('mixins.activity.ZOOM_IN'), icon: 'add', handler: this.onZoomIn
          })
          beforeActions.push({
            name: 'zoom-out', label: this.$t('mixins.activity.ZOOM_OUT'), icon: 'remove', handler: this.onZoomOut
          })
          beforeActions.push({ name: 'separator' })
        }
        if (hasTrackLocationTool) {
          beforeActions.push({
            name: 'track-location', label: this.$t('mixins.activity.TRACK_LOCATION'), icon: 'track_changes', handler: this.onTrackLocation
          })
        }
        const afterActions = []
        if (hasMapTool) {
          afterActions.push({
            name: 'map-toggle', label: this.$t('mixins.activity.TOGGLE_MAP'), icon: 'map', route: { name: 'map', query: true }
          })
        }
        if (hasGlobeTool) {
          afterActions.push({
            name: 'globe-toggle', label: this.$t('mixins.activity.TOGGLE_GLOBE'), icon: 'terrain', route: { name: 'globe', query: true }
          })
        }
        if (hasVrTool) {
          afterActions.push({
            name: 'vr-toggle', label: this.$t('mixins.activity.TOGGLE_VR'), icon: 'burst_mode', handler: this.onToggleVr
          })
        }
        if (hasFullscreenTool) {
          afterActions.push({
            name: 'fullscreen-toggle', label: this.$t('mixins.activity.TOGGLE_FULLSCREEN'), icon: 'fullscreen', handler: this.onToggleFullscreen
          })
        }
        if (hasCatalogTool) {
          afterActions.push({ name: 'separator' })
          afterActions.push({
            name: 'catalog-toggle',
            label: this.$t('mixins.activity.TOGGLE_CATALOG'),
            icon: 'layers',
            handler: () => { this.klayout.toggleRightDrawer() }
          })
        }
        this.setNavigationBar(hasLocationTool, beforeActions, afterActions)
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
        const gatewayToken = this.$api.get('storage').getItem(this.$config('gatewayJwt'))
        return (gatewayToken ? setGatewayJwt(layers, gatewayToken) : layers)
      },
      async refreshLayers () {
        this.layers = {}
        this.layerCategories = _.get(this, 'activityOptions.catalog.categories', [])
        this.variables = []
        let catalogLayers = await this.getCatalogLayers()
        // Apply global layer filter
        catalogLayers = catalogLayers.filter(sift(_.get(this, 'activityOptions.catalog.filter', {})))
        // Iterate and await layers as creation is async and we need to have all layers ready
        // before checking if there is some background layer
        for (let i = 0; i < catalogLayers.length; i++) {
          const layer = catalogLayers[i]
          if (layer[this.engine]) {
            // Process i18n
            if (this.$t(layer.name)) layer.name = this.$t(layer.name)
            if (this.$t(layer.description)) layer.description = this.$t(layer.description)
            // Check for Weacast API availability
            const isWeacastLayer = _.get(layer, `${this.engine}.type`, '').startsWith('weacast.')
            if (isWeacastLayer && (!this.weacastApi || !this.forecastModel)) continue
            await this.addLayer(layer)
          }
          // Filter layers with variables, not just visible ones because we might want to
          // probe weather even if there is no visual representation (e.g. in globe)
          if (layer.variables) this.variables = _.uniqBy(this.variables.concat(layer.variables), (variable) => variable.name)
        }
        // We need at least an active background
        const hasVisibleBaseLayer = catalogLayers.find((layer) => (layer.type === 'BaseLayer') && layer.isVisible)
        if (!hasVisibleBaseLayer) {
          const baseLayer = catalogLayers.find((layer) => (layer.type === 'BaseLayer'))
          if (baseLayer) this.showLayer(baseLayer.name)
        }
      },
      isLayerStorable (layer) {
        if (_.has(layer, 'isStorable')) return _.get(layer, 'isStorable')
        // Only possible when not yet saved and GeoJson by default
        else return (!layer._id && (_.get(layer, `${this.engine}.type`) === 'geoJson'))
      },
      isLayerEditable (layer) {
        if (_.has(layer, 'isEditable')) return _.get(layer, 'isEditable')
        // Only possible on user-defined and saved layers by default
        else return (layer._id && (layer.service === 'features'))
      },
      isLayerRemovable (layer) {
        if (_.has(layer, 'isRemovable')) return _.get(layer, 'isRemovable')
        // Only possible on user-defined layers by default
        else return (!layer._id || (layer.service === 'features'))
      },
      registerLayerActions (layer) {
        let defaultActions = ['zoom-to', 'save', 'edit', 'remove']
        if (this.is2D()) defaultActions = defaultActions.concat(['edit-data'])
        const layerActions = _.get(this, 'activityOptions.layerActions', defaultActions)
        const actions = [{ name: 'toggle', handler: () => this.onTriggerLayer(layer) }]
        // Add supported actions
        if (layer.type === 'OverlayLayer') {
          if (layerActions.includes('zoom-to')) {
            actions.push({
              name: 'zoom-to',
              label: this.$t('mixins.activity.ZOOM_TO_LABEL'),
              icon: 'zoom_out_map',
              handler: () => this.onZoomToLayer(layer)
            })
          }
          if (this.isLayerStorable(layer) && !layer._id && layerActions.includes('save')) {
            actions.push({
              name: 'save',
              label: this.$t('mixins.activity.SAVE_LABEL'),
              icon: 'save',
              handler: () => this.onSaveLayer(layer)
            })
          }
          if (this.isLayerEditable(layer) && layerActions.includes('view-data')) {
            actions.push({
              name: 'view-data',
              label: this.$t('mixins.activity.VIEW_DATA_LABEL'),
              icon: 'view_list',
              handler: () => this.onViewLayerData(layer)
            })
          }
          if (this.isLayerEditable(layer) && layerActions.includes('chart-data')) {
            actions.push({
              name: 'chart-data',
              label: this.$t('mixins.activity.CHART_DATA_LABEL'),
              icon: 'pie_chart',
              handler: () => this.onChartLayerData(layer)
            })
          }
          if (this.isLayerEditable(layer) && layerActions.includes('edit')) {
            actions.push({
              name: 'edit',
              label: this.$t('mixins.activity.EDIT_LABEL'),
              icon: 'description',
              handler: () => this.onEditLayer(layer)
            })
            // Supported by underlying engine ?
            if ((typeof this.editLayer === 'function') && layerActions.includes('edit-data')) {
              actions.push({
                name: 'edit-data',
                label: this.isLayerEdited(layer.name)
                  ? this.$t('mixins.activity.STOP_EDIT_DATA_LABEL')
                  : this.$t('mixins.activity.START_EDIT_DATA_LABEL'),
                icon: 'edit_location',
                handler: () => this.onEditLayerData(layer)
              })
            }
          }
          if (this.isLayerRemovable(layer) && layerActions.includes('remove')) {
            actions.push({
              name: 'remove',
              label: this.$t('mixins.activity.REMOVE_LABEL'),
              icon: 'remove_circle',
              handler: () => this.onRemoveLayer(layer)
            })
          }
        }
        this.$set(layer, 'actions', actions)
        return actions
      },
      onLayerAdded (layer) {
        this.registerLayerActions(layer)
      },
      onTriggerLayer (layer) {
        if (!this.isLayerVisible(layer.name)) {
          this.showLayer(layer.name)
        } else {
          this.hideLayer(layer.name)
        }
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
        // Change data source from in-memory to features service
        _.merge(layer, {
          service: 'features',
          [this.engine]: { source: '/api/features' }
        })
        // When saving from one engine copy options to the other one so that it will be available in both of them
        _.set(layer, (this.is2D() ? 'cesium' : 'leaflet'), _.get(layer, this.engine))
        let createdLayer = await this.$api.getService('catalog')
          .create(_.omit(layer, ['actions', 'isVisible']))
        // layer._id = createdLayer._id
        // this.registerLayerActions(layer) // Refresh actions due to state change
        // Because we save all features in a single service use filtering to separate layers
        // We use the generated DB ID as layer ID on features
        await this.createFeatures(this.toGeoJson(layer.name), createdLayer._id)
        // Update filter in layer as well
        createdLayer = await this.$api.getService('catalog').patch(createdLayer._id, { baseQuery: { layer: createdLayer._id } })
        // Reset layer with new setup
        await this.removeLayer(layer.name)
        await this.addLayer(createdLayer)
      },
      async onViewLayerData (layer) {
        this.viewModal = await this.$createComponent('KFeaturesTable', {
          propsData: {
            contextId: this.contextId,
            layer,
            featureActions: [{
              name: 'zoom-to',
              label: this.$t('mixins.activity.ZOOM_TO_LABEL'),
              icon: 'zoom_out_map',
              handler: (feature) => {
                this.center(..._.get(centroid(feature), 'geometry.coordinates'))
                this.viewModal.close()
              }
            }]
          }
        })
        this.viewModal.$mount()
        this.viewModal.open()
        this.viewModal.$on('closed', () => {
          this.viewModal = null
        })
      },
      async onChartLayerData (layer) {
        this.chartModal = await this.$createComponent('KFeaturesChart', {
          propsData: {
            contextId: this.contextId,
            layer
          }
        })
        this.chartModal.$mount()
        this.chartModal.open()
        this.chartModal.$on('closed', () => {
          this.chartModal = null
        })
      },
      async onEditLayer (layer) {
        this.editModal = await this.$createComponent('editor/KModalEditor', {
          propsData: {
            service: 'catalog',
            contextId: this.contextId,
            objectId: layer._id
          }
        })
        this.editModal.$mount()
        this.editModal.open()
        this.editModal.$on('applied', updatedLayer => {
          // If renamed need to update the layer map accordingly
          if (layer.name !== updatedLayer.name) {
            this.renameLayer(layer.name, updatedLayer.name)
          }
          Object.assign(layer, updatedLayer)
          this.editModal.close()
          this.editModal = null
        })
      },
      async onEditLayerData (layer) {
        // Start/Stop edition
        this.editLayer(layer.name)
        this.registerLayerActions(layer) // Refresh actions due to state change
      },
      async onRemoveLayer (layer) {
        Dialog.create({
          title: this.$t('mixins.activity.REMOVE_DIALOG_TITLE', { layer: layer.name }),
          message: this.$t('mixins.activity.REMOVE_DIALOG_MESSAGE', { layer: layer.name }),
          html: true,
          ok: {
            label: this.$t('OK')
          },
          cancel: {
            label: this.$t('CANCEL')
          }
        }).onOk(async () => {
          // Stop any running edition
          if (this.isLayerEdited(layer.name)) await this.editLayer(layer.name)
          if (layer._id) {
            // If persistent feature layer remove features as well
            if (layer.service === 'features') {
              await this.removeFeatures(layer._id)
            }
            await this.$api.getService('catalog').remove(layer._id)
          }
          this.removeLayer(layer.name)
        })
      },
      onMapReady () {
        this.engineReady = true
        this.engine = 'leaflet'
      },
      onGlobeReady () {
        this.engineReady = true
        this.engine = 'cesium'
      },
      async onCreateLayer () {
        // Set layer data source to features service
        this.createModal = await this.$createComponent('editor/KModalEditor', {
          propsData: {
            service: 'catalog',
            contextId: this.contextId,
            baseObject: {
              type: 'OverlayLayer',
              icon: 'insert_drive_file',
              service: 'features',
              featureId: '_id',
              [this.engine]: {
                type: 'geoJson',
                isVisible: true,
                realtime: true,
                source: '/api/features'
              }
            }
          }
        })
        this.createModal.$mount()
        this.createModal.open()
        this.createModal.$on('applied', async createdLayer => {
          this.createModal.close()
          this.createModal = null
          // Update filter in layer as well
          createdLayer = await this.$api.getService('catalog').patch(createdLayer._id, { baseQuery: { layer: createdLayer._id } })
          // Create an empty layer used as a container
          await this.addLayer(createdLayer)
          // Start editing
          await this.onEditLayerData(createdLayer)
        })
      },
      onGeolocate () {
        // Force a refresh
        this.clearStoredView()
        this.updatePosition()
      },
      onGeolocationError (error) {
        // Remove geolocation action if not allowed by user
        if (error.code === 'GEOLOCATION_PERMISSION_DENIED') {
          this.unregisterFabAction('geolocate')
        }
      },
      onTrackLocation () {
        if (!this.locationIndicator) this.createLocationIndicator()
        else this.removeLocationIndicator()
      },
      geolocate () {
        if (!this.engineReady) {
          // logger.error('Engine not ready to geolocate')
          return
        }
        const position = this.$store.get('user.position')
        // 3D or 2D centering ?
        if (this.locateControl) this.locateControl.start()
        else if (position) {
          this.center(position.longitude, position.latitude)
        }
      },
      onProbeLocation () {
        const probe = async (options, event) => {
          this.unsetCursor('probe-cursor')
          const { start, end } = this.getTimeRange()
          await this.getForecastForLocation(event.latlng.lng, event.latlng.lat, start, end)
        }
        this.setCursor('probe-cursor')
        this.$once('click', probe)
      },
      onToggleFullscreen () {
        if (!this.$q.fullscreen.isActive) this.$q.fullscreen.request()
        else this.$q.fullscreen.exit()
      },
      getViewKey () {
        return this.appName.toLowerCase() + `-${this.name}-view`
      },
      shouldRestoreView() {
        // Use user settings except if the view has explicitly revoked restoration
        if (_.has(this, 'activityOptions.restore.view')) {
          if (!_.get(this, 'activityOptions.restore.view')) return false
        }
        return this.$store.get('restore.view')
      },
      storeView () {
        const bounds = this.getBounds()
        const south = bounds[0][0]
        const west = bounds[0][1]
        const north = bounds[1][0]
        const east = bounds[1][1]
        // Store both in URL and local storage, except if the user/view has explicitly revoked restoration
        if (this.shouldRestoreView()) {
          this.$router.push({ query: Object.assign({ south, west, north, east }, this.$route.query) })
          window.localStorage.setItem(this.getViewKey(), JSON.stringify(bounds))
        }
      },
      restoreView () {
        let bounds
        if (this.shouldRestoreView()) {
          const savedBounds = window.localStorage.getItem(this.getViewKey())
          if (savedBounds) bounds = JSON.parse(savedBounds)
        } else if (_.get(this.$route, 'query.south') && _.get(this.$route, 'query.west') &&
                   _.get(this.$route, 'query.north') && _.get(this.$route, 'query.east')) {
          bounds = [
            [_.get(this.$route, 'query.south'), _.get(this.$route, 'query.west')],
            [_.get(this.$route, 'query.north'), _.get(this.$route, 'query.east')]
          ]
        }
        // Restore state if required
        if (bounds) {
          const south = bounds[0][0]
          const west = bounds[0][1]
          const north = bounds[1][0]
          const east = bounds[1][1]
          this.$router.push({ query: Object.assign({ south, west, north, east }, this.$route.query) })
          this.zoomToBounds(bounds)
        }
        return bounds
      },
      clearStoredView () {
        this.$router.push({ query: {} })
        window.localStorage.removeItem(this.getViewKey())
      },
      updateViewSettings () {
        this.clearStoredView()
        this.restoreView()
      },
      async initialize () {
        // Geolocate by default if view has not been restored
        if (!this.restoreView()) {
          if (this.$store.get('user.position')) this.geolocate()
          // Provided by geolocation mixin if available
          else if (this.updatePosition) await this.updatePosition()
        }
        // Retrieve the forecast models
        if (this.setupWeacast) {
          try {
            await this.setupWeacast(this.$config('weacast'))
          } catch (error) {
            logger.error(error)
          }
          this.forecastModelHandlers = { toggle: (model) => this.setForecastModel(model) }
        } else {
          this.forecastModelHandlers = {}
        }
        // Retrieve the layers
        try {
          await this.refreshLayers()
        } catch (error) {
          logger.error(error)
        }
      },
      getTimeRange () {
        const now = moment.utc()
        let start = 0
        let end = 0

        // if user defined a custom width, use it
        const width = this.$store.get('timelineWidth')
        if (width) {
          start = -width * 24 * 60 * 60
          end = width * 24 * 60 * 60
        } else {
          // Start just before the first available data
          start = this.forecastModel
            ? this.forecastModel.lowerLimit - this.forecastModel.interval : -7 * 60 * 60 * 24
          // Override by config ?
          start = _.get(this, 'activityOptions.timeline.start', start)
          // Start just after the last available data
          end = this.forecastModel
            ? this.forecastModel.upperLimit + this.forecastModel.interval : 7 * 60 * 60 * 24
          // Override by config ?
          end = _.get(this, 'activityOptions.timeline.end', end)
        }
        return {
          start: now.clone().add({ seconds: start }),
          end: now.clone().add({ seconds: end })
        }
      }
    },
    beforeCreate () {
      // Config options: to be done first based on specific config name setup
      this.name = name
      this.options = this.$config(`${this.name}`)
      this.activityOptions = Object.assign({
        catalog: this.$config(`${this.name}Catalog`)
      }, this.$config(`${this.name}Activity`))
    },
    mounted () {
      this.$on('map-ready', this.onMapReady)
      this.$on('globe-ready', this.onGlobeReady)
      this.$on('layer-added', this.onLayerAdded)
      this.$events.$on('user-position-changed', this.geolocate)
      // Whenever restore view settings are updated, update view as well
      this.$events.$on('restore-view-changed', this.updateViewSettings)
      this.$events.$on('error', this.onGeolocationError)
    },
    beforeDestroy () {
      this.$off('map-ready', this.onMapReady)
      this.$off('globe-ready', this.onGlobeReady)
      this.$off('layer-added', this.onLayerAdded)
      this.$events.$off('user-position-changed', this.geolocate)
      this.$events.$off('restore-view-changed', this.updateViewSettings)
      this.$events.$off('error', this.onGeolocationError)
    }
  }
}
