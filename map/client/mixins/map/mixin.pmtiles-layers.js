import _ from 'lodash'
import chroma from 'chroma-js'
import moment from 'moment'
import L from 'leaflet'
import * as protomaps from 'protomaps-leaflet'
import { mapbox_style } from '@kalisio/leaflet-pmtiles'
import { Time, Units } from '../../../../core/client/index.js'

export const pmtilesLayers = {
  methods: {
    async createLeafletPMTilesLayer (options) {
      const leafletOptions = options.leaflet || options
      // Check for valid types
      if (leafletOptions.type !== 'pmtiles') return
      // Optimize templating by creating compilers up-front
      const layerStyleTemplate = _.get(leafletOptions, 'template')
      if (layerStyleTemplate) {
        // We allow to template style properties according to feature, because it can be slow you have to specify a subset of properties
        leafletOptions.template = layerStyleTemplate.map(property => ({
          property, compiler: _.template(_.get(leafletOptions, property))
        }))
      }

      let rules = {}
      // Check for style information given as object or URL
      let style = _.get(leafletOptions, 'style')
      if (typeof style === 'string') {
        const response = await fetch(style)
        if (response.status !== 200) {
          throw new Error(`Impossible to fetch style ${style}: ` + response.status)
        }
        style = await response.json()
        const backgroundLayer = style.layers.find(layer => layer.type === 'background')
        if (backgroundLayer) leafletOptions.backgroundColor = backgroundLayer.paint['fill-color']
        // Convert to PMTiles plugin paint rules
        rules = mapbox_style(style, {})
      } else {
        // Manage templating
        leafletOptions.template.forEach(entry => {
          // protomaps allows property functions with zomm/feature as input
          const f = (zoom, feature) => {
            const context = { properties: feature.props, feature, chroma, moment, Units, Time, level: this.selectedLevel }
            return entry.property.endsWith('filter') ? (entry.compiler(context) === 'true'): entry.compiler(context)
          }
          _.set(leafletOptions, entry.property, f)
        })
        const isLabelSymbolizer = (rule) => rule.symbolizer.type.includes('Label') || rule.symbolizer.type.includes('Text')
        const isNotLabelSymbolizer = (rule) => !isLabelSymbolizer(rule)
        // Support v1.x as well as v2.x
        rules.paint_rules = rules.paintRules = _.map(_.filter(style, isNotLabelSymbolizer), paintRule => {
          return Object.assign(_.omit(paintRule, ['symbolizer']), {
            symbolizer: new protomaps[paintRule.symbolizer.type](paintRule.symbolizer)
          })
        })
        rules.label_rules = rules.labelRules = _.map(_.filter(style, isLabelSymbolizer), labelRule => {
          return Object.assign(_.omit(labelRule, ['symbolizer']), {
            symbolizer: new protomaps[labelRule.symbolizer.type](labelRule.symbolizer)
          })
        })
      }
      
      return this.createLeafletLayer({
        ...leafletOptions,
        ...rules,
        //debug: true,
        //levelDiff: 2
      })
    },
    onCurrentTimeChangedPMTilesLayers (time) {
      const pmtileslayers = _.values(this.layers).filter(sift({
        'leaflet.type': 'pmtiles',
        isVisible: true
      }))
      pmtileslayers.forEach(async pmtileslayer => {
        // Retrieve the layer
        const layer = this.getLeafletLayerByName(pmtileslayer.name)
        layer.redraw()
      })
    },
    onCurrentLevelChangedPMTilesLayers (level) {
      // Retrieve the layer associated to current level sélection
      let layer = this.selectableLevelsLayer
      if (layer) {
        const type = _.get(layer, `${this.engine}.type`)
        // Check if of right type
        if (type === 'pmtiles') {
          // Retrieve the engine layer and update
          layer = this.getLeafletLayerByName(layer.name)
          layer.redraw()
        }
      }
    }
  },
  created () {
    this.registerLeafletConstructor(this.createLeafletPMTilesLayer)
    this.$events.on('time-current-time-changed', this.onCurrentTimeChangedPMTilesLayers)
    this.$engineEvents.on('selected-level-changed', this.onCurrentLevelChangedPMTilesLayers)
  },
  beforeUnmount () {
    this.$events.off('time-current-time-changed', this.onCurrentTimeChangedPMTilesLayers)
    this.$engineEvents.off('selected-level-changed', this.onCurrentLevelChangedPMTilesLayers)
  }
}

// Not automatically declared by leaflet plugin
L.pmtiles = function (options) {
  return protomaps.leafletLayer(options)
}