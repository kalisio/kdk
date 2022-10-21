import moment from 'moment'
import { makeTime, readAsTimeOrDuration, floorTo, ceilTo } from '../../../common/moment-utils.js'
import { getMetadata as geotiffGetMetadata, fetch as geotiffFetch } from '../../../common/geotiff-utils.js'
import * as wu from '../../../common/weacast-utils.js'

import _ from 'lodash'
import { Time } from '../../../../core/client/time.js'
import { makeGridSource, extractGridSourceConfig } from '../../../common/grid.js'
import { TiledMeshLayer } from '../../leaflet/TiledMeshLayer.js'

const GridSourceStore = {
  geotiff: async (layer, source, context) => {
    const url = _.template(source.config.urlTemplate)(context)
    const meta = await geotiffGetMetadata(url)
    return {
      fetch: async (abort, bbox, res) => {
        return await geotiffFetch (
          meta,
          { minLon: bbox[1], minLat: bbox[0], maxLon: bbox[3], maxLat: bbox[2] },
          { resLon: res[1], resLat: res[0] },
          abort)
      },
      getBBox: () => { return [meta.bounds.minLat, meta.bounds.minLon, meta.bounds.maxLat, meta.bounds.maxLon] },
      getDataBounds: () => { return null }
    }
  },
  weacast: async (layer, source, context) => {
    const meta = await wu.fetcher(context.weacastApi, context.meteoModel, layer.variables[0].name, context.time)
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
      }
    }
  }
}

function getSource (definition, { meteoModel, time }) {
  const now = moment()
  const matchs = []
  for (const source of definition.sources) {
    if (source.meteoModel && meteoModel && source.meteoModel !== meteoModel) continue
    const from = source.from ? makeTime(readAsTimeOrDuration(source.from), now) : now
    const to = source.to ? makeTime(readAsTimeOrDuration(source.to), now) : now
    if (time.isBetween(from, to)) matchs.push(source)
  }
  return matchs
}

async function buildSource (mixin, layer) {
  const context = {
    weacastApi: mixin.weacastApi,
    jwtToken: await mixin.$api.get('storage').getItem(mixin.$config('gatewayJwt')),
    time: Time.getCurrentTime(),
    meteoModel: mixin.forecastModel.name
  }
  const source = getSource(layer.dataSources, { meteoModel: mixin.forecastModel.name, time: Time.getCurrentTime() })
  return source ? GridSourceStore[source.type](layer, source, context) : null
}

export const tiledMeshLayers = {
  methods: {
    async createLeafletTiledMeshLayer (options) {
      const layerOptions = options.leaflet || options

      // Check for valid type
      if (layerOptions.type !== 'tiledMeshLayer') return

      // Copy options
      const colorMap = _.get(options, 'variables[0].chromajs', null)
      if (colorMap) Object.assign(layerOptions, { chromajs: colorMap })

      let gridSource = null
      if (options.dataSources) {
        // gridSource = await buildSource(this, options)
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
    },

    onCurrentTimeChangedTiledMeshLayer (time) {
      // broadcast time to visible layers
      this.tiledMeshLayers.forEach((engineLayer) => { engineLayer.setTime(time) })

      // for (const layer of this.layers) {
      //   if (!layer.dataSources) continue
      //   if (!this.isLayerVisible(layer.name)) continue
      //   // const gridSource = await buildSource(this, options)
      //   buildSource(this, options).then((gridSource) => { engineLayer.setSource(gridSource) })
      // }

      // gridSource = buildSource(this, options)
    }
  },

  created () {
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
