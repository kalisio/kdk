import _ from 'lodash'
import chroma from 'chroma-js'
import moment from 'moment'
import sift from 'sift'
import L from 'leaflet'
import * as protomaps from 'protomaps-leaflet'
import { mapbox_style, kdk_style } from '@kalisio/leaflet-pmtiles'
import { api, Time, Units, Events, TemplateContext } from '../../../../core/client/index.js'
import * as time from '../../../../core/client/utils/utils.time.js'
import * as layers from '../../utils/utils.layers.js'

function detectStyleType (style) {
  // `style` field on pmtile layer definition can be one of:
  // - string => in this case we assume this is a mapbox json style
  // - kdk style object
  // - protomaps style object

  if (typeof style === 'string') return 'mapbox'
  // Look for 'symbolizer' keys in the object, if we find one, this is a protomaps style
  if (_.some(style, (rule) => rule.symbolizer !== undefined)) return 'protomaps'
  // Otherwise we assume this is a kdk style object
  return style ? 'kdk' : 'empty'
}

export const pmtilesLayers = {
  methods: {
    async processLeafletPMTilesLayer (options, properties = ['urlTemplate', 'styleTemplate', 'template']) {
      const leafletOptions = options.leaflet || options

      // Token required by templating
      const planetApi = (typeof options.getPlanetApi === 'function' ? options.getPlanetApi() : api)
      const apiJwt = (planetApi.hasConfig('apiJwt') ? await planetApi.get('storage').getItem(planetApi.getConfig('apiJwt')) : null)
      const gatewayJwt = (planetApi.hasConfig('gatewayJwt') ? await planetApi.get('storage').getItem(planetApi.getConfig('gatewayJwt')) : null)

      if (properties.includes('urlTemplate')) {
        const urlTemplate = _.get(leafletOptions, 'urlTemplate')
        if (urlTemplate) {
          const context = Object.assign({
            apiJwt, gatewayJwt, moment, Units, Time, level: this.selectedLevel, ...time
          }, TemplateContext.get())
          leafletOptions.url = _.template(urlTemplate)(context)
        }
      }
      if (properties.includes('styleTemplate')) {
        const styleTemplate = _.get(leafletOptions, 'styleTemplate')
        if (styleTemplate) {
          const context = Object.assign({
            apiJwt, gatewayJwt, moment, Units, Time, level: this.selectedLevel, ...time
          }, TemplateContext.get())
          leafletOptions.style = _.template(styleTemplate)(context)
        }
      }
      if (properties.includes('template')) {
        // Optimize templating by creating compilers up-front
        const layerStyleTemplate = _.get(leafletOptions, 'template')
        if (layerStyleTemplate) {
          // We allow to template style properties according to feature, because it can be slow you have to specify a subset of properties
          leafletOptions.template = layerStyleTemplate.map(property => ({
            property, compiler: _.template(_.get(leafletOptions, property))
          }))
        }
      }
    },
    async createLeafletPMTilesLayer (options) {
      const leafletOptions = options.leaflet || options
      // Check for valid types
      if (leafletOptions.type !== 'pmtiles') return
      // Process main options
      await this.processLeafletPMTilesLayer(options)
      // Then create rendering rules
      let rules = {}
      let style = _.get(leafletOptions, 'style')
      const styleType = detectStyleType(style)
      if (styleType === 'mapbox') {
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
        const templates = _.get(leafletOptions, 'template', [])
        templates.forEach(entry => {
          // protomaps allows property functions with zoom/feature as input
          const f = (zoom, feature) => {
            const context = Object.assign({ properties: feature.props, feature, chroma, moment, Units, Time, level: this.selectedLevel }, TemplateContext.get())
            if (entry.property.endsWith('filter')) {
              const result = entry.compiler(context)
              return (result === 'true')
            } else {
              return entry.compiler(context)
            }
          }
          _.set(leafletOptions, entry.property, f)
        })
        if (styleType === 'protomaps') {
          const styleRules = _.map(style, rule => Object.assign(_.omit(rule, ['symbolizer']), {
            symbolizer: new protomaps[rule.symbolizer.type](rule.symbolizer)
          })
          )
          const isLabelSymbolizer = (rule) => typeof rule.symbolizer.place === 'function'
          const isNotLabelSymbolizer = (rule) => !isLabelSymbolizer(rule)
          // Support v1.x as well as v2.x
          rules.paint_rules = rules.paintRules = _.filter(styleRules, isNotLabelSymbolizer)
          rules.label_rules = rules.labelRules = _.filter(styleRules, isLabelSymbolizer)
        } else if (styleType === 'kdk') {
          // Translate kdk style to protomap rules
          rules = kdk_style(style, leafletOptions.dataLayer)
        }
        if (options.filters) {
          // Translate layer filters to filter function
          const filterFn = layers.getFilterFunctionFromLayerFilters(options)
          rules.paintRules.forEach(rule => {
            // kdkFilter member may not be present, this is added by kdk_style when translating kdk style
            // to leaflet-protomaps rules
            if (rule.kdkFilter) {
              rule.filter = (zoom, feature) => {
                // Final filter = kdk style filter + updated filter
                return rule.kdkFilter(zoom, feature) && filterFn({ zoom, feature, properties: feature.props })
              }
            } else {
              rule.filter = (zoom, feature) => filterFn({ zoom, feature, properties: feature.props })
            }
          })
        }
      }

      return this.createLeafletLayer({
        ...leafletOptions,
        ...rules,
        //debug: true,
        //levelDiff: 2
      })
    },
    async updatePMTilesLayers() {
      const pmtilesLayers = _.values(this.layers).filter(sift({
        'leaflet.type': 'pmtiles',
        isVisible: true
      }))

      pmtilesLayers.forEach(async pmtilesLayer => {
        const layer = this.getLeafletLayerByName(pmtilesLayer.name)
        const leafletOptions = pmtilesLayer.leaflet || pmtilesLayer
        const urlTemplate = _.get(leafletOptions, 'urlTemplate')
        if (urlTemplate) {
          await this.processLeafletPMTilesLayer(pmtilesLayer, ['urlTemplate'])
          layer.views = protomaps.sourcesToViews(leafletOptions)
        }
        layer.redraw()
      })
    },
    onCurrentTimeChangedPMTilesLayers (time) {
      this.updatePMTilesLayers()
    },
    onTemplateContextChangedPMTilesLayers(path, value, previousValue) {
      this.updatePMTilesLayers()
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
    },
    onLayerFilterToggledPMTilesLayers (layer, filter) {
      // Filtering is managed by mongodb query syntax, we need to update the filter function
      const filterFn = layers.getFilterFunctionFromLayerFilters(layer)
      // Retrieve the engine layer and update the filter function directly
      layer = this.getLeafletLayerByName(layer. name)
      if (!layer) return
      layer.paintRules.forEach(rule => {
        // kdkFilter member may not be present, this is added by kdk_style when translating kdk style
        // to leaflet-protomaps rules
        if (rule.kdkFilter) {
          rule.filter = (zoom, feature) => {
            // Final filter = kdk style filter + updated filter
            return rule.kdkFilter(zoom, feature) && filterFn({ zoom, feature, properties: feature.props })
          }
        } else {
          rule.filter = (zoom, feature) => filterFn({ zoom, feature, properties: feature.props })
        }
      })
      layer.redraw()
    }
  },
  created () {
    this.registerLeafletConstructor(this.createLeafletPMTilesLayer)
    Events.on('time-current-time-changed', this.onCurrentTimeChangedPMTilesLayers)
    Events.on('template-context-changed', this.onTemplateContextChangedPMTilesLayers)
    this.$engineEvents.on('selected-level-changed', this.onCurrentLevelChangedPMTilesLayers)
    this.$engineEvents.on('layer-filter-toggled', this.onLayerFilterToggledPMTilesLayers)
  },
  beforeUnmount () {
    Events.off('time-current-time-changed', this.onCurrentTimeChangedPMTilesLayers)
    Events.off('template-context-changed', this.onTemplateContextChangedPMTilesLayers)
    this.$engineEvents.off('selected-level-changed', this.onCurrentLevelChangedPMTilesLayers)
    this.$engineEvents.off('layer-filter-toggled', this.onLayerFilterToggledPMTilesLayers)
  }
}

// Not automatically declared by leaflet plugin
L.pmtiles = function (options) {
  return protomaps.leafletLayer(options)
}
