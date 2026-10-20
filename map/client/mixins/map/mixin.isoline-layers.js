import _ from 'lodash'
import moment from 'moment'
import { Time } from '../../../../core/client/time.js'
import { Events } from '../../../../core/client/events.js'
import { TemplateContext } from '../../../../core/client/template-context.js'
import * as time from '../../../../core/client/utils/utils.time.js'
import { makeGridSource, extractGridSourceConfig } from '../../../common/grid.js'
import { listenToLoadingEventsForLayer, unlistenToLoadingEventsForLayer } from '../../utils/utils.layers.js'
import { IsolineLayer } from '../../leaflet/IsolineLayer.js'

export const isolineLayers = {
  methods: {
    async createLeafletIsolineLayer (options) {
      const layerOptions = options.leaflet || options

      // Check for valid type
      if (layerOptions.type !== 'isolineLayer') return

      // Color isolines according to the underlying variable's chromajs config, same as the tiled mesh layer
      const colorMap = _.get(options, 'variables[0].chromajs', null)
      if (colorMap && layerOptions.useColorScale) Object.assign(layerOptions, { chromajs: colorMap })
      // Isolines and their labels are styled like any GeoJSON layer (style.line/style.point, templates),
      // so compile templates, build variable color scales and store layer styles exactly the same way
      this.processGeoJsonStyleOptions(options)
      // Variables are part of the style templating context
      if (options.variables) layerOptions.variables = options.variables
      // Tooltips are generated exactly as for GeoJSON layers (tooltip.template/property/html/options, zoom range, etc.)
      layerOptions.generateTooltip = (feature, layer) => this.generateStyle('tooltip', feature, layer, options, this.map.getZoom())

      // Build grid source
      const [gridKey, gridConf] = extractGridSourceConfig(options)
      const planetApi = (typeof options.getPlanetApi === 'function' ? options.getPlanetApi() : this.getWeacastApi())
      const apiJwt = (planetApi.hasConfig('apiJwt') ? await planetApi.get('storage').getItem(planetApi.getConfig('apiJwt')) : null)
      const gatewayJwt = (planetApi.hasConfig('gatewayJwt') ? await planetApi.get('storage').getItem(planetApi.getConfig('gatewayJwt')) : null)
      const gridSource = makeGridSource(gridKey, { planetApi })
      gridSource.setup(gridConf)
      if (gridSource.updateCtx) {
        // define variables for source's dynamic properties
        Object.assign(gridSource.updateCtx, {
          apiJwt,
          gatewayJwt,
          moment,
          Time,
          ...time,
          // This one is for backward compatibility
          jwtToken: gatewayJwt,
          meteoElements: _.get(options, 'meteoElements'),
          ...TemplateContext.get()
        })
      }

      return new IsolineLayer(layerOptions, gridSource)
    },

    updateIsolineLayerZoomBounds (layer, model) {
      const minZoom = _.get(layer, `leaflet.meteoModelMinZoom[${model.name}]`)
      const maxZoom = _.get(layer, `leaflet.meteoModelMaxZoom[${model.name}]`)

      if (minZoom) layer.leaflet.minZoom = minZoom
      else delete layer.leaflet.minZoom
      if (maxZoom) layer.leaflet.maxZoom = maxZoom
      else delete layer.leaflet.maxZoom
      this.updateLayerDisabled(layer)

      // reflect on engine layers
      const engineLayer = this.getLeafletLayerByName(layer.name)
      if (engineLayer) {
        if (minZoom) engineLayer.options.minZoom = minZoom
        else delete engineLayer.options.minZoom
        if (maxZoom) engineLayer.options.maxZoom = maxZoom
        else delete engineLayer.options.maxZoom
      }
    },

    onAddIsolineLayer (layer) {
      if (!this.forecastModel || _.get(layer, 'leaflet.type') !== 'isolineLayer') return
      this.updateIsolineLayerZoomBounds(layer, this.forecastModel)
    },

    onShowIsolineLayer (layer, engineLayer) {
      const isIsolineLayer = engineLayer instanceof IsolineLayer
      if (!isIsolineLayer) return

      // store displayed layers
      this.isolineLayers.set(layer._id, engineLayer)
      // setup layer
      engineLayer.setModel(this.forecastModel)
      engineLayer.setTime(Time.getCurrentTime())
      if (this.selectableLevelsLayer && (this.selectableLevelsLayer._id === layer._id)) {
        engineLayer.setLevel(this.selectedLevel)
      }
      // Reflect loading state back onto the reactive layer definition so eg. UI can
      // display a spinner while isolines are being fetched for the current view
      listenToLoadingEventsForLayer(layer, engineLayer)
    },

    onHideIsolineLayer (layer, engineLayer) {
      const isIsolineLayer = engineLayer instanceof IsolineLayer
      if (!isIsolineLayer) return

      unlistenToLoadingEventsForLayer(layer, engineLayer)
      this.isolineLayers.delete(layer._id)
    },

    onSelectedLevelChangedIsolineLayer (value) {
      if (!this.selectableLevelsLayer) return

      // send selected value only to associated layer
      const layer = this.isolineLayers.get(this.selectableLevelsLayer._id)
      if (!layer) return

      layer.setLevel(value)
    },

    onForecastModelChangedIsolineLayer (model) {
      // update layer & engine layer {min,max}Zoom if required
      const isolineLayers = _.filter(this.layers, (layer) => _.get(layer, 'leaflet.type') === 'isolineLayer')
      for (const layer of isolineLayers) this.updateIsolineLayerZoomBounds(layer, model)
      // broadcast model to visible layers
      this.isolineLayers.forEach((engineLayer) => { engineLayer.setModel(model) })
    },

    onCurrentTimeChangedIsolineLayer (time) {
      // broadcast time to visible layers
      this.isolineLayers.forEach((engineLayer) => { engineLayer.setTime(time) })
    },

    onTemplateContextChangedIsolineLayer (path, value, previousValue) {
      // refresh visible layers so template-driven dynamic properties are recomputed
      this.isolineLayers.forEach((engineLayer) => {
        const gridSource = engineLayer.gridSource
        if (gridSource && gridSource.updateCtx) {
          Object.assign(gridSource.updateCtx, TemplateContext.get())
          gridSource.invalidate()
          gridSource.queueUpdate()
        }
      })
    }
  },

  created () {
    this.isolineLayers = new Map()
    this.registerLeafletConstructor(this.createLeafletIsolineLayer)

    this.$engineEvents.on('layer-added', this.onAddIsolineLayer)
    this.$engineEvents.on('layer-shown', this.onShowIsolineLayer)
    this.$engineEvents.on('layer-hidden', this.onHideIsolineLayer)
    this.$engineEvents.on('selected-level-changed', this.onSelectedLevelChangedIsolineLayer)
    this.$engineEvents.on('forecast-model-changed', this.onForecastModelChangedIsolineLayer)
    Events.on('time-current-time-changed', this.onCurrentTimeChangedIsolineLayer)
    Events.on('template-context-changed', this.onTemplateContextChangedIsolineLayer)
  },

  beforeUnmount () {
    this.$engineEvents.off('layer-added', this.onAddIsolineLayer)
    this.$engineEvents.off('layer-shown', this.onShowIsolineLayer)
    this.$engineEvents.off('layer-hidden', this.onHideIsolineLayer)
    this.$engineEvents.off('selected-level-changed', this.onSelectedLevelChangedIsolineLayer)
    this.$engineEvents.off('forecast-model-changed', this.onForecastModelChangedIsolineLayer)
    Events.off('time-current-time-changed', this.onCurrentTimeChangedIsolineLayer)
    Events.off('template-context-changed', this.onTemplateContextChangedIsolineLayer)
  }
}
