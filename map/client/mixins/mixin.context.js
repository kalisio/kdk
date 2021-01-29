import _ from 'lodash'
import sift from 'sift'

export default {
  methods: {
    getContextKey (context) {
      // Generate a unique key to store context based on app name, map activity name and context type
      return this.appName.toLowerCase() + `-${this.name}-${context}`
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
          break
        case 'view':
        default:
          return false
          break
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
    storeContext (context) {
      let targetParameters
      switch (context) {
        case 'layers':
          targetParameters = {
            layers: _.values(this.layers).filter(sift({ isVisible: true })).map(layer => layer.name).join(',')
          }
          break
        case 'view':
        default: 
          const bounds = this.getBounds()
          const south = bounds[0][0]
          const west = bounds[0][1]
          const north = bounds[1][0]
          const east = bounds[1][1]
          targetParameters = { south, west, north, east }
          break
      }
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
        }
      } else {
        targetParameters = this.getRouteContext(context)
      }
      // Restore context if possible
      if (!_.isEmpty(targetParameters)) {
        if (!_.isEqual(this.getRouteContext(context), targetParameters)) {
          this.updateRouteContext(context, targetParameters)
        }
        switch (context) {
          case 'layers':
            // Start from a clean state in case some defaults layers have been already activated
            let layers = _.values(this.layers).filter(sift({ isVisible: true })).map(layer => layer.name)
            for (let i = 0; i < layers.length; i++) {
              await this.hideLayer(layers[i])
            }
            // Then active context layers
            layers = targetParameters.layers.split(',')
            for (let i = 0; i < layers.length; i++) {
              await this.showLayer(layers[i])
            }
            break
          case 'view':
          default:
            this.zoomToBounds([
              [targetParameters.south, targetParameters.west],
              [targetParameters.north, targetParameters.east]
            ])
            break
        }
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
