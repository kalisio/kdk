import _ from 'lodash'
import { Time } from '../../../../core/client/time'
import { GSMaPLayer } from '../../leaflet/GSMaPLayer'

export default {
  methods: {
    async createLeafletGSMaPLayer (options) {
      const leafletOptions = options.leaflet || options
      // Check for valid type
      if (leafletOptions.type !== 'gsmapLayer') return

      // Copy options
      const colorMap = _.get(options, 'variables[0].chromajs', null)
      if (colorMap) Object.assign(leafletOptions, { chromajs: colorMap })

      // Add current time to options
      leafletOptions.time = Time.getCurrentTime()

      // Then create layer
      return new GSMaPLayer(leafletOptions)
    }
  },
  created () {
    // Register the new layer constructor
    this.registerLeafletConstructor(this.createLeafletGSMaPLayer)
  }
}
