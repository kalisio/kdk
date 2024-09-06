import _ from 'lodash'
import moment from 'moment'
import { Time, Units } from '../../../../core/client/index.js'

export const tooltip = {
  methods: {
    applyTooltips (entities, options) {
      for (let i = 0; i < entities.values.length; i++) {
        const entity = entities.values[i]
        const tooltip = this.generateStyle('tooltip', entity, options)
        if (tooltip) {
          // Default tooltip position (can change in sticky mode)
          const position = this.getPositionForEntity(entity)
          if (position) {
            const tooltipEntity = this.viewer.entities.add({ parent: entity, position, label: tooltip })
            // This option is not cesium specific so we have to manage it manually
            if (tooltip.sticky) tooltipEntity.sticky = true
          }
        }
      }
    },
    getDefaultTooltip (entity, options) {
      let tooltip
      if (entity.properties) {
        const properties = entity.properties.getValue(0)
        const cesiumOptions = options.cesium || options
        // Check if explicitely disabled first
        if (_.has(cesiumOptions, 'tooltip') && !_.get(cesiumOptions, 'tooltip')) return
        if (_.has(properties, 'tooltip') && !_.get(properties, 'tooltip')) return
        // Otherwise merge options
        const tooltipStyle = _.merge({}, _.get(this, 'activityOptions.engine.tooltip', {}),
          cesiumOptions.tooltip, properties.tooltip)
        // Default content
        let text = tooltipStyle.text
        if (!text) {
          if (tooltipStyle.property) {
            text = _.get(properties, tooltipStyle.property)
            if (text && (typeof text.toString === 'function')) text = text.toString()
          } else if (tooltipStyle.template) {
            const compiler = tooltipStyle.compiler
            // FIXME: the whole feature is lost by Cesium so that top-level properties have disappeared
            text = compiler({ feature: { properties }, properties, $t: this.$t, Units, Time, moment })
          }
        }
        if (text) {
          tooltip = Object.assign({
            text,
            show: (!!_.get(tooltipStyle, 'options.permanent'))
          }, tooltipStyle.options)
        }
      }
      return tooltip
    },
    isTooltipOpen (entity) {
      if (this.getNbChildrenForEntity(entity) > 0) {
        return _.get(entity, 'label.show', false)
      } else return false
    },
    openTooltip (entity, position) {
      if (this.getNbChildrenForEntity(entity) > 0) {
        const tooltip = this.getChildForEntity(entity)
        if (tooltip.label) tooltip.label.show = true
        if (tooltip.sticky) tooltip.position = position
      }
    },
    closeTooltip (entity) {
      if (this.getNbChildrenForEntity(entity) > 0) {
        const tooltip = this.getChildForEntity(entity)
        if (tooltip.label) tooltip.label.show = false
      }
    },
    onTooltip (options, event) {
      if (options) {
        const cesiumOptions = options.cesium || options
        const tooltipStyle = cesiumOptions.tooltip
        // Nothing to do in this case
        if (_.get(tooltipStyle, 'options.permanent')) return
      }
      // FIXME: show/hide tooltip
      const entity = event.target
      if (this.overEntity) {
        this.closeTooltip(this.overEntity)
        this.overEntity = null
      }
      // Only for entities from a layer
      if (options && entity) {
        this.overEntity = entity
        this.openTooltip(this.overEntity, event.pickedPosition)
      }
    }
  },
  created () {
    this.registerStyle('tooltip', this.getDefaultTooltip)
  },
  // Need to be done after created as the activity mixin initializes options in it
  beforeMount () {
    // Perform required conversion from JSON to Cesium objects
    if (_.has(this, 'activityOptions.engine.tooltip')) {
      _.set(this, 'activityOptions.engine.tooltip', this.convertToCesiumObjects(_.get(this, 'activityOptions.engine.tooltip')))
    }
  },
  mounted () {
    this.$engineEvents.on('mousemove', this.onTooltip)
  },
  beforeUnmount () {
    this.$engineEvents.off('mousemove', this.onTooltip)
  }
}
