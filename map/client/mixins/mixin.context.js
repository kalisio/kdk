import _ from 'lodash'
import sift from 'sift'
import { utils as kCoreUtils } from '../../../core/client'

export default {
  methods: {
    getContextKey (context) {
      // Generate a unique key to store context based on app name, map activity name and context type
      return this.getAppName().toLowerCase() + `-${this.activityName}-${context}`
    },
    shouldRestoreContext (context) {
      // Use user settings except if the view has explicitly revoked restoration
      if (_.has(this, `activityOptions.restore.${context}`)) {
        if (!_.get(this, `activityOptions.restore.${context}`)) return false
      }
      return this.$store.get(`restore.${context}`)
    },
    getRouteContext (context) {
      switch (context) {
        case 'layers':
          if (_.get(this.$route, 'query.layers')) {
            return _.pick(this.$route.query, ['layers'])
          }
          break
        case 'view':
        default:
          if (_.get(this.$route, 'params.south') && _.get(this.$route, 'params.west') &&
              _.get(this.$route, 'params.north') && _.get(this.$route, 'params.east')) {
            const currentBounds = _.pick(this.$route.params, ['south', 'west', 'north', 'east'])
            return _.mapValues(currentBounds, value => _.toNumber(value))
          }
          break
      }
      return {}
    },
    contextAsQuery (context) {
      // Check if context is stored in route params or query
      switch (context) {
        case 'layers':
          return true
        case 'view':
        default:
          return false
      }
    },
    updateRouteContext (context, parameters) {
      const asQuery = this.contextAsQuery(context)
      // Clone route context to avoid any side effect
      const route = {
        query: Object.assign({}, _.get(this.$route, 'query', {})),
        params: Object.assign({}, _.get(this.$route, 'params', {}))
      }
      // Then update according to context
      if (asQuery) Object.assign(route.query, parameters)
      else Object.assign(route.params, parameters)
      // We catch as replacing with similar params raises a duplicate navigation error
      this.$router.replace(route).catch(_ => {})
    },
    getContextParameters (context) {
      let targetParameters
      switch (context) {
        case 'layers':
          targetParameters = {
            layers: _.values(this.layers).filter(sift({ isVisible: true })).map(layer => layer.name)
          }
          break
        case 'view':
        default: {
          const bounds = this.getBounds()
          const south = bounds[0][0]
          const west = bounds[0][1]
          const north = bounds[1][0]
          const east = bounds[1][1]
          targetParameters = { south, west, north, east }
        }
      }
      return targetParameters
    },
    async setContextParameters (context, targetParameters) {
      switch (context) {
        case 'layers': {
          if (!_.has(targetParameters, 'layers')) return
          // According to current state find which layers need to be (de)activated
          const activeLayers = _.values(this.layers).filter(sift({ isVisible: true })).map(layer => layer.name)
          const targetLayers = targetParameters.layers
          // List of layers to be (de)activated
          const activedLayers = _.difference(targetLayers, activeLayers)
          const inactivatedLayers = _.difference(activeLayers, targetLayers)
          // Take care that 3D requires at least a terrain layer.
          // So if we try to remove a terrain layer without activating a new one, keep it active
          // (this can be the case when the view has been saved from the 2D activity and restored in the 3D activity).
          const inactivatedTerrainLayer = _.find(inactivatedLayers, (name) => this.hasLayer(name) && (this.getLayerByName(name).type === 'TerrainLayer'))
          const activatedTerrainLayer = _.find(activedLayers, (name) => this.hasLayer(name) && (this.getLayerByName(name).type === 'TerrainLayer'))
          if (inactivatedTerrainLayer && !activatedTerrainLayer) _.pull(inactivatedLayers, inactivatedTerrainLayer)
          await Promise.all(activedLayers.map(layer => this.showLayer(layer)))
          await Promise.all(inactivatedLayers.map(layer => this.hideLayer(layer)))
          break
        }
        case 'view':
        default:
          if (!_.has(targetParameters, 'south') || !_.has(targetParameters, 'west') ||
              !_.has(targetParameters, 'north') || !_.has(targetParameters, 'east')) return
          this.zoomToBounds([
            [targetParameters.south, targetParameters.west],
            [targetParameters.north, targetParameters.east]
          ])
          break
      }
    },
    storeContext (context) {
      const targetParameters = this.getContextParameters(context)
      // Store both in URL and local storage, except if the user/view has explicitly revoked restoration
      if (this.shouldRestoreContext(context)) {
        if (!_.isEqual(this.getRouteContext(context), targetParameters)) {
          this.updateRouteContext(context, targetParameters)
        }
        window.localStorage.setItem(this.getContextKey(context), JSON.stringify(targetParameters))
      }
    },
    async restoreContext (context) {
      let targetParameters
      // Restore from local storage or route parameters
      if (this.shouldRestoreContext(context)) {
        const savedParameters = window.localStorage.getItem(this.getContextKey(context))
        if (savedParameters) {
          targetParameters = JSON.parse(savedParameters)
          // Backward compatibility: we previously stored the bounds as an array
          if (Array.isArray(targetParameters)) {
            targetParameters = {
              south: targetParameters[0][0],
              west: targetParameters[0][1],
              north: targetParameters[1][0],
              east: targetParameters[1][1]
            }
          }
        } else {
          // Check for a home context
          const response = await this.$api.getService('catalog').find({ query: { type: 'Context', isDefault: true } })
          const homeContext = (response.data.length > 0 ? response.data[0] : null)
          if (homeContext) targetParameters = homeContext
        }
      } else {
        targetParameters = this.getRouteContext(context)
      }
      // Restore context if possible
      if (!_.isEmpty(targetParameters)) {
        if (!_.isEqual(this.getRouteContext(context), targetParameters)) {
          this.updateRouteContext(context, targetParameters)
        }
        this.setContextParameters(context, targetParameters)
      }
      return targetParameters
    },
    clearContext (context) {
      // In order to clear we simply erase target property values
      let parameters
      switch (context) {
        case 'layers':
          parameters = { layers: undefined }
          break
        case 'view':
        default:
          parameters = { south: undefined, west: undefined, north: undefined, east: undefined }
          break
      }
      this.updateRouteContext(context, parameters)
      window.localStorage.removeItem(this.getContextKey(context))
    },
    async saveContext (context) {
      context = Object.assign({}, context)
      const hasLayers = context.layers
      // This flag is only useful in the options but will be replaced
      // by the actual layers when processed
      delete context.layers
      // Add required type for catalog
      context.type = 'Context'
      // Retrieve basic view parameters
      Object.assign(context, this.getContextParameters('view'))
      // Add layers parameters if required
      if (hasLayers) {
        Object.assign(context, this.getContextParameters('layers'))
      }
      await this.$api.getService('catalog').create(context)
    },
    async loadContext (context) {
      // If not context object retrieve it from catalog first
      if (typeof context === 'string') {
        if (kCoreUtils.isObjectID(context)) {
          context = await this.$api.getService('catalog').get(context)
        } else {
          const response = await this.$api.getService('catalog').find({ query: { type: 'Context', name: context } })
          context = (response.data.length > 0 ? response.data[0] : null)
        }
      }
      if (!context) throw new Error('Cannot find or invalid context')
      this.setContextParameters('view', context)
      this.setContextParameters('layers', context)
    },
    updateViewSettings (enabled) {
      if (!enabled) this.clearContext('view')
    },
    updateLayersSettings (enabled) {
      if (!enabled) this.clearContext('layers')
    }
  },
  mounted () {
    // Whenever restore settings are updated, update view as well
    this.$events.$on('restore-view-changed', this.updateViewSettings)
    this.$events.$on('restore-layers-changed', this.updateLayersSettings)
  },
  beforeDestroy () {
    this.$events.$off('restore-view-changed', this.updateViewSettings)
    this.$events.$off('restore-layers-changed', this.updateLayersSettings)
  }
}
