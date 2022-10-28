import moment from 'moment'
import * as gu from '../../../common/geotiff-utils.js'
import * as wu from '../../../common/weacast-utils.js'
import * as dsu from '../../../common/data-source-utils.js'

import _ from 'lodash'
import { Time } from '../../../../core/client/time.js'
import { makeGridSource, extractGridSourceConfig } from '../../../common/grid.js'
import { TiledMeshLayer } from '../../leaflet/TiledMeshLayer.js'

export const tiledMeshLayers = {
  data () {
    return {
      tiledMeshLayerSourceFactory: {}
    }
  },
  methods: {
    registerTiledMeshLayerSource (type, factory) {
      this.tiledMeshLayerSourceFactory[type] = factory
    },

    async createTiledMeshLayerSource (layer) {
      // Find matching source
      const now = Time.getCurrentTime()
      const meteoModelName = this.forecastModel ? this.forecastModel.name : null
      const source = dsu.getSourceByTime(layer.dataSources, now, meteoModelName)
      if (!source) return null

      return await this.tiledMeshLayerSourceFactory[source.type](this, layer, source)
    },

    async createLeafletTiledMeshLayer (options) {
      const layerOptions = options.leaflet || options

      // Check for valid type
      if (layerOptions.type !== 'tiledMeshLayer') return

      // Copy options
      const colorMap = _.get(options, 'variables[0].chromajs', null)
      if (colorMap) Object.assign(layerOptions, { chromajs: colorMap })

      let gridSource = null
      if (options.dataSources) {
        gridSource = await this.createTiledMeshLayerSource(options)
      } else {
        const apiToken = await this.$api.get('storage').getItem(this.$config('gatewayJwt'))

        // Build grid source
        const [gridKey, gridConf] = extractGridSourceConfig(options)
        gridSource = makeGridSource(gridKey, { weacastApi: this.weacastApi, apiToken })
        gridSource.setup(gridConf)
        if (gridSource.updateCtx) {
          // define variables for source's dynamic properties
          if (apiToken) gridSource.updateCtx.jwtToken = apiToken
          gridSource.updateCtx.meteoElements = _.get(options, 'meteoElements')
        }
      }

      return new TiledMeshLayer(layerOptions, gridSource)
    },

    updateTiledMeshLayerZoomBounds (layer, model) {
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

    onAddTiledMeshLayer (layer) {
      if (!this.forecastModel || _.get(layer, 'leaflet.type') !== 'tiledMeshLayer') return
      this.updateTiledMeshLayerZoomBounds(layer, this.forecastModel)
    },

    onShowTiledMeshLayer (layer, engineLayer) {
      const isTiledMeshLayer = engineLayer instanceof TiledMeshLayer
      if (!isTiledMeshLayer) return

      // store displayed layers
      this.tiledMeshLayers.set(layer._id, engineLayer)
      // setup layer
      engineLayer.setModel(this.forecastModel)
      engineLayer.setTime(Time.getCurrentTime())
    },

    onHideTiledMeshLayer (layer, engineLayer) {
      const isTiledMeshLayer = engineLayer instanceof TiledMeshLayer
      if (!isTiledMeshLayer) return

      this.tiledMeshLayers.delete(layer._id)
    },

    onSelectedLevelChangedTiledMeshLayer (value) {
      if (!this.selectableLevelsLayer) return

      // send selected value only to associated layer
      const layer = this.tiledMeshLayers.get(this.selectableLevelsLayer._id)
      if (!layer) return

      layer.setLevel(value)
    },

    onForecastModelChangedTiledMeshLayer (model) {
      // update layer & engine layer {min,max}Zoom if required
      const tiledMeshLayers = _.filter(this.layers, (layer) => _.get(layer, 'leaflet.type') === 'tiledMeshLayer')
      for (const layer of tiledMeshLayers) this.updateTiledMeshLayerZoomBounds(layer, model)
      // broadcast model to visible layers
      this.tiledMeshLayers.forEach((engineLayer) => { engineLayer.setModel(model) })

      this.updateTiledMeshLayerSources()
    },

    onCurrentTimeChangedTiledMeshLayer (time) {
      // broadcast time to visible layers
      this.tiledMeshLayers.forEach((engineLayer) => { engineLayer.setTime(time) })

      this.updateTiledMeshLayerSources()
    },

    updateTiledMeshLayerSources () {
      for (const name of _.keys(this.layers)) {
        const layer = this.layers[name]
        if (!layer.dataSources) continue
        if (!this.isLayerVisible(layer.name)) continue
        this.createTiledMeshLayerSource(layer).then((gridSource) => {
          const engineLayer = this.tiledMeshLayers.get(layer._id)
          if (engineLayer)
            engineLayer.setSource(gridSource)
        })
      }
    }
  },

  created () {
    this.registerTiledMeshLayerSource('geotiff', async (activity, layer, source) => {
      // Build url generator context
      const context = {
        jwtToken: await activity.$api.get('storage').getItem(activity.$config('gatewayJwt')),
        time: Time.getCurrentTime(),
        // TODO: remove
        testToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOiI2MjIyM2E4NGYyMzMwOTAwMzJhMTk3YjIiLCJpYXQiOjE2NjY4NjUyMDUsImV4cCI6MTY2Njk1MTYwNSwiYXVkIjoidGVzdC5rYWxpc2lvLnh5eiIsImlzcyI6ImthbGlzaW8iLCJzdWIiOiIzZDk4MWMxYi1iMGFmLTQxMzktYTJjYS1lMzA0YTRmMDE4YTYiLCJqdGkiOiIzZjYzNDYzNS1lZDVlLTRiNjEtOTdmOC0yOGJlYmNjYzI1NzEifQ.ZxfOoqac-aL3izfzm-UziAMgOBlfZ_prnn80kx66Jj4'
      }
      const meteoModel = source.meteoModel ? activity.forecastModel : null
      Object.assign(context, dsu.defaultContext(context, layer, source, meteoModel))
      context.level = activity.selectedLevel !== null ? activity.selectedLevel : undefined

      const url = _.template(source.config.urlTemplate)(context)
      const meta = await gu.getMetadata(url)
      return {
        fetch: async (abort, bbox, res) => {
          return await gu.fetch (
            meta,
            { minLon: bbox[1], minLat: bbox[0], maxLon: bbox[3], maxLat: bbox[2] },
            { resLon: res[1], resLat: res[0] },
            abort)
        },
        getBBox: () => {
          return [
            meta.spatialBounds.minLat,
            meta.spatialBounds.minLon,
            meta.spatialBounds.maxLat,
            meta.spatialBounds.maxLon
          ]
        },
        getDataBounds: () => { return null },
        supportsNoData: () => { return meta.nodata !== undefined }
      }
    })

    this.registerTiledMeshLayerSource('weacast', async (activity, layer, source) => {
      const now = Time.getCurrentTime()
      const meta = await wu.fetcher(activity.weacastApi, source.meteoModel, layer.variables[0].name, now, true)
      return {
        fetch: async (abort, bbox, res) => {
          return await wu.fetchTile(
            meta,
            { minLon: bbox[1], minLat: bbox[0], maxLon: bbox[3], maxLat: bbox[2] },
            { resLon: res[1], resLat: res[0] },
            abort)
        },
        getBBox: () => {
          return [
            meta.spatialBounds.minLat,
            meta.spatialBounds.minLon,
            meta.spatialBounds.maxLat,
            meta.spatialBounds.maxLon
          ]
        },
        getDataBounds: () => {
          return [
            meta.dataBounds.minVal,
            meta.dataBounds.maxVal
          ]
        },
        supportsNoData: () => { return false }
      }
    })

    this.tiledMeshLayers = new Map()
    this.registerLeafletConstructor(this.createLeafletTiledMeshLayer)

    this.$engineEvents.on('layer-added', this.onAddTiledMeshLayer)
    this.$engineEvents.on('layer-shown', this.onShowTiledMeshLayer)
    this.$engineEvents.on('layer-hidden', this.onHideTiledMeshLayer)
    this.$engineEvents.on('selected-level-changed', this.onSelectedLevelChangedTiledMeshLayer)
    this.$engineEvents.on('forecast-model-changed', this.onForecastModelChangedTiledMeshLayer)
    this.$events.on('time-current-time-changed', this.onCurrentTimeChangedTiledMeshLayer)
  },

  beforeUnmount () {
    this.$engineEvents.off('layer-added', this.onAddTiledMeshLayer)
    this.$engineEvents.off('layer-shown', this.onShowTiledMeshLayer)
    this.$engineEvents.off('layer-hidden', this.onHideTiledMeshLayer)
    this.$engineEvents.off('selected-level-changed', this.onSelectedLevelChangedTiledMeshLayer)
    this.$engineEvents.off('forecast-model-changed', this.onForecastModelChangedTiledMeshLayer)
    this.$events.off('time-current-time-changed', this.onCurrentTimeChangedTiledMeshLayer)
  }
}
