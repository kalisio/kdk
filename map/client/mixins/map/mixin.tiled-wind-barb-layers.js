import _ from 'lodash'
import moment from 'moment'
import { Time } from '../../../../core/client/time.js'
import { Events } from '../../../../core/client/events.js'
import { TemplateContext } from '../../../../core/client/template-context.js'
import * as time from '../../../../core/client/utils/utils.time.js'
import { makeGridSource, extractGridSourceConfig } from '../../../common/grid.js'
import { listenToLoadingEventsForLayer, unlistenToLoadingEventsForLayer } from '../../utils/utils.layers.js'
import { TiledWindBarbLayer } from '../../leaflet/TiledWindBarbLayer.js'

export const tiledWindBarbLayers = {
  methods: {
    async createLeafletTiledWindBarbLayer (options) {
      const layerOptions = options.leaflet || options

      // Check for valid type
      if (layerOptions.type !== 'tiledWindBarbLayer') return

      // Color barbs according to the underlying variable's chromajs config, same as the tiled mesh layer
      const colorMap = _.get(options, 'variables[0].chromajs', null)
      if (colorMap) Object.assign(layerOptions, { chromajs: colorMap })
      // The layer needs the u/v variable names itself, to probe both in a single combined request
      // (see TiledWindBarbLayer)
      Object.assign(layerOptions, { meteoElements: options.meteoElements })

      // Build u & v grid sources
      const [gridKey, gridConf] = extractGridSourceConfig(options)
      // Check API to be used in case the layer is coming from a remote "planet"
      const planetApi = (typeof options.getPlanetApi === 'function' ? options.getPlanetApi() : this.getWeacastApi())
      const uSource = makeGridSource(gridKey, { planetApi })
      const vSource = makeGridSource(gridKey, { planetApi })
      uSource.setup(gridConf)
      vSource.setup(gridConf)
      if (uSource.updateCtx) {
        // define variables for source's dynamic properties
        const apiJwt = (planetApi.hasConfig('apiJwt') ? await planetApi.get('storage').getItem(planetApi.getConfig('apiJwt')) : null)
        const gatewayJwt = (planetApi.hasConfig('gatewayJwt') ? await planetApi.get('storage').getItem(planetApi.getConfig('gatewayJwt')) : null)
        Object.assign(uSource.updateCtx, {
          apiJwt, gatewayJwt, moment, Time, ...time,
          // This one is for backward compatibility
          jwtToken: gatewayJwt,
          windComponent: _.get(options, 'meteoElements[0]'),
          ...TemplateContext.get()
        })
        Object.assign(vSource.updateCtx, {
          apiJwt, gatewayJwt, ...time,
          // This one is for backward compatibility
          jwtToken: gatewayJwt,
          windComponent: _.get(options, 'meteoElements[1]'),
          ...TemplateContext.get()
        })
      }

      return new TiledWindBarbLayer(layerOptions, uSource, vSource)
    },

    updateTiledWindBarbLayerZoomBounds (layer, model) {
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

    onAddTiledWindBarbLayer (layer) {
      if (!this.forecastModel || _.get(layer, 'leaflet.type') !== 'tiledWindBarbLayer') return
      this.updateTiledWindBarbLayerZoomBounds(layer, this.forecastModel)
    },

    onShowTiledWindBarbLayer (layer, engineLayer) {
      const isTiledWindBarbLayer = engineLayer instanceof TiledWindBarbLayer
      if (!isTiledWindBarbLayer) return

      // store displayed layers
      this.tiledWindBarbLayers.set(layer._id, engineLayer)

      // setup layer
      engineLayer.setModel(this.forecastModel)
      engineLayer.setTime(Time.getCurrentTime())
      if (this.selectableLevelsLayer && (this.selectableLevelsLayer._id === layer._id)) {
        engineLayer.setLevel(this.selectedLevel)
      }
      // Reflect tile loading state back onto the reactive layer definition so eg. UI can
      // display a spinner while tiles are being fetched for the current view
      listenToLoadingEventsForLayer(layer, engineLayer)
    },

    onHideTiledWindBarbLayer (layer, engineLayer) {
      const isTiledWindBarbLayer = engineLayer instanceof TiledWindBarbLayer
      if (!isTiledWindBarbLayer) return

      unlistenToLoadingEventsForLayer(layer, engineLayer)
      this.tiledWindBarbLayers.delete(layer._id)
    },

    onForecastModelChangedTiledWindBarbLayer (model) {
      // update layer & engine layer {min,max}Zoom if required
      const tiledWindBarbLayers = _.filter(this.layers, (layer) => _.get(layer, 'leaflet.type') === 'tiledWindBarbLayer')
      for (const layer of tiledWindBarbLayers) this.updateTiledWindBarbLayerZoomBounds(layer, model)
      // broadcast model to visible layers
      this.tiledWindBarbLayers.forEach((engineLayer) => { engineLayer.setModel(model) })
    },

    onCurrentTimeChangedTiledWindBarbLayer (time) {
      // broadcast time to visible layers
      this.tiledWindBarbLayers.forEach((engineLayer) => { engineLayer.setTime(time) })
    },

    onSelectedLevelChangedTiledWindBarbLayer (value) {
      if (!this.selectableLevelsLayer) return

      // send selected value only to associated layer
      const layer = this.tiledWindBarbLayers.get(this.selectableLevelsLayer._id)
      if (!layer) return

      layer.setLevel(value)
    },

    onTemplateContextChangedTiledWindBarbLayer (path, value, previousValue) {
      // refresh visible layers so template-driven dynamic properties are recomputed
      this.tiledWindBarbLayers.forEach((engineLayer) => {
        const gridSources = [engineLayer.uSource, engineLayer.vSource]
        gridSources.forEach((gridSource) => {
          if (gridSource && gridSource.updateCtx) {
            Object.assign(gridSource.updateCtx, TemplateContext.get())
            gridSource.invalidate()
            gridSource.queueUpdate()
          }
        })
      })
    }
  },

  created () {
    this.tiledWindBarbLayers = new Map()
    this.registerLeafletConstructor(this.createLeafletTiledWindBarbLayer)

    this.$engineEvents.on('layer-added', this.onAddTiledWindBarbLayer)
    this.$engineEvents.on('layer-shown', this.onShowTiledWindBarbLayer)
    this.$engineEvents.on('layer-hidden', this.onHideTiledWindBarbLayer)
    this.$engineEvents.on('selected-level-changed', this.onSelectedLevelChangedTiledWindBarbLayer)
    this.$engineEvents.on('forecast-model-changed', this.onForecastModelChangedTiledWindBarbLayer)
    Events.on('time-current-time-changed', this.onCurrentTimeChangedTiledWindBarbLayer)
    Events.on('template-context-changed', this.onTemplateContextChangedTiledWindBarbLayer)
  },

  beforeUnmount () {
    this.$engineEvents.off('layer-added', this.onAddTiledWindBarbLayer)
    this.$engineEvents.off('layer-shown', this.onShowTiledWindBarbLayer)
    this.$engineEvents.off('layer-hidden', this.onHideTiledWindBarbLayer)
    this.$engineEvents.off('selected-level-changed', this.onSelectedLevelChangedTiledWindBarbLayer)
    this.$engineEvents.off('forecast-model-changed', this.onForecastModelChangedTiledWindBarbLayer)
    Events.off('time-current-time-changed', this.onCurrentTimeChangedTiledWindBarbLayer)
    Events.off('template-context-changed', this.onTemplateContextChangedTiledWindBarbLayer)
  }
}
