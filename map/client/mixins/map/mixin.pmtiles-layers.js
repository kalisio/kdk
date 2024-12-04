import _ from 'lodash'
import chroma from 'chroma-js'
import moment from 'moment'
import sift from 'sift'
import L from 'leaflet'
import * as protomaps from 'protomaps-leaflet'
import { mapbox_style } from '@kalisio/leaflet-pmtiles'
import { Time, Units, TemplateContext } from '../../../../core/client/index.js'

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
        _.get(leafletOptions, 'template', []).forEach(entry => {
          // protomaps allows property functions with zomm/feature as input
          const f = (zoom, feature) => {
            const context = Object.assign({ properties: feature.props, feature, chroma, moment, Units, Time, level: this.selectedLevel }, TemplateContext.get())
            return entry.property.endsWith('filter') ? (entry.compiler(context) === 'true'): entry.compiler(context)
          }
          _.set(leafletOptions, entry.property, f)
        })
        if (style) {
          const styleRules = _.map(style, rule => Object.assign(_.omit(rule, ['symbolizer']), {
              symbolizer: new protomaps[rule.symbolizer.type](rule.symbolizer)
            })
          )
          const isLabelSymbolizer = (rule) => typeof rule.symbolizer.place === 'function'
          const isNotLabelSymbolizer = (rule) => !isLabelSymbolizer(rule)
          // Support v1.x as well as v2.x
          rules.paint_rules = rules.paintRules = _.filter(styleRules, isNotLabelSymbolizer)
          rules.label_rules = rules.labelRules = _.filter(styleRules, isLabelSymbolizer)
        }
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
        // Skip invisible layers
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