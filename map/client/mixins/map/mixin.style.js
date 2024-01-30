import _ from 'lodash'
import { getDefaultMarker, getDefaultStyle, convertToLeafletFromSimpleStyleSpec } from '../../utils.map.js'

export const style = {
  created () {
    this.registerStyle('markerStyle', getDefaultMarker)
    this.registerStyle('featureStyle',getDefaultStyle)
  },
  // Need to be done after created as the activity mixin initializes options in it
  beforeMount () {
    // Perform required conversion for default feature styling
    if (_.has(this, 'activityOptions.engine.featureStyle')) {
      convertToLeafletFromSimpleStyleSpec(_.get(this, 'activityOptions.engine.featureStyle'), 'update-in-place')
    }
    if (_.has(this, 'activityOptions.engine.pointStyle')) {
      convertToLeafletFromSimpleStyleSpec(_.get(this, 'activityOptions.engine.pointStyle'), 'update-in-place')
    }
  }
}
