import _ from 'lodash'

export default {
  methods: {
    applyTooltips (entities, options) {
      for (let i = 0; i < entities.values.length; i++) {
        const entity = entities.values[i]
        const tooltip = this.generateCesiumStyle('tooltip', entity, options)
        if (tooltip) {
          // Default tooltip position (can change in sticky mode)
          const position = this.getPositionForEntity(entity)
          const tooltipEntity = this.viewer.entities.add({ parent: entity, position, label: tooltip })
          // This option is not cesium specific so we have to manage it manually
          if (tooltip.sticky) tooltipEntity.sticky = true
        }
      }
    },
    getDefaultTooltip (entity, options) {
      let tooltip
      if (entity.properties) {
        const properties = entity.properties.getValue(0)
        const cesiumOptions = options.cesium || options
        const tooltipStyle = _.merge({}, this.options.tooltip,
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
            text = compiler({ feature: { properties }, properties })
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
      // Nothing to do in this case
      if (options && _.get(options, 'cesium.tooltip.permanent)')) return
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
    this.registerCesiumStyle('tooltip', this.getDefaultTooltip)
    // Perform required conversion from JSON to Cesium objects
    if (this.options.tooltip) this.options.tooltip = this.convertToCesiumObjects(this.options.tooltip)
  },
  mounted () {
    this.$on('mousemove', this.onTooltip)
  },
  beforeDestroy () {
    this.$off('mousemove', this.onTooltip)
  }
}
