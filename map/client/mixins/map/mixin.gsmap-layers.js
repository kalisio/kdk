import _ from 'lodash'

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

      // Then create layer
      return new GSMaPLayer(leafletOptions)
    }
  },
  created () {
    // Register the new layer constructor
    this.registerLeafletConstructor(this.createLeafletGSMaPLayer)
  }
}
