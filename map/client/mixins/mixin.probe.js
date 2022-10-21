import moment from 'moment'
// import * as dss from '../../../common/data-source.js'
// import { GeoTiffSource } from '../../../common/geotiff-source.js'
import { probeTimeRange as geotiffTimeRange } from '../../common/geotiff-utils.js'
import { makeTime, readAsTimeOrDuration, floorTo, ceilTo } from '../../common/moment-utils.js'
import { getNearestRunTime, getNearestForecastTime } from '@weacast/core/common.js'

function meteoModelContext (context, meteoModel) {
  if (!meteoModel) return {}
  const runTime = getNearestRunTime(context.time, meteoModel.runInterval)
  const forecastTime = getNearestForecastTime(context.time, meteoModel.interval)
  const forecastOffset = moment.duration(forecastTime.diff(runTime))
  return { meteoModel: meteoModel.name, runTime, forecastTime, forecastOffset }
}

const ProbeFunctionStore = {
  geotiff: async (mixin, layer, source, lat, lon, t0, t1) => {
    const context = {
      jwtToken: await mixin.$api.get('storage').getItem(mixin.$config('gatewayJwt')),
      testToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOiI2MjIyM2E4NGYyMzMwOTAwMzJhMTk3YjIiLCJpYXQiOjE2NjYxODY0MDIsImV4cCI6MTY2NjI3MjgwMiwiYXVkIjoidGVzdC5rYWxpc2lvLnh5eiIsImlzcyI6ImthbGlzaW8iLCJzdWIiOiIzZDk4MWMxYi1iMGFmLTQxMzktYTJjYS1lMzA0YTRmMDE4YTYiLCJqdGkiOiIwNjQ0ZTFjMC04ZGI1LTQ2ZjEtYjk3Yy0wNGVhOWExYTU4NjkifQ.nui6Pa9uf0yf8LwF5ZityzpiTJjwXDteBzm0DgrO1IQ'
    }

    const meteoModel = source.meteoModel ? mixin.weacastApi.models.find(model => model.name === source.meteoModel) : null
    const every = source.every ? moment.duration(source.every) : meteoModel ? moment.duration(meteoModel.interval, 's') : null
    const urlGenerator = _.template(source.config.urlTemplate)
    const probes = await geotiffTimeRange(
      urlGenerator, context, 'time', [ (ctx) => { return meteoModelContext(ctx, meteoModel) } ],
      { lat, lon},
      { t0: floorTo(t0, every), t1: ceilTo(t1, every) },
      every, null)

    const result = {
      variable: layer.variables[0].name,
      time: [],
      properties: []
    }
    probes.forEach((probe) => {
      result.time.push(probe.time),
      result.properties.push(probe.probe.bottomLeft.val)
    })
    return result
  },
  weacast: async (mixin, layer, source, lat, lon, t0, t1) => {
    const query = {
      forecastTime: {
        $gte: t0.format(),
        $lte: t1.format()
      },
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          }
        }
      }
    }
    const element = layer.variables[0].name
    const response = await mixin.weacastApi.getService('probes')
                                .create({
                                  forecast: source.meteoModel,
                                  elements: [ element ]
                                }, { query })

    const result = {
      variable: element,
      time: [],
      properties: []
    }

    if (response.features.length > 0) {
      result.time = response.features[0].forecastTime[element].map((time) => moment(time))
      result.properties = response.features[0].properties[element]
    }

    return result
  }
}

function getSourcesByTimeRange (definition, t0, t1) {
  const now = moment()
  const matchs = []
  for (const source of definition.sources) {
    const from = source.from ? makeTime(readAsTimeOrDuration(source.from), now) : null
    const to = source.to ? makeTime(readAsTimeOrDuration(source.to), now) : null
    const begin = from ? moment.max(from, t0) : t0
    const end = to ? moment.min(to, t1) : t1
    if (begin.isBefore(end)) matchs.push({ begin, end, source })
  }
  return matchs
}



export const probe = {
  methods: {
    async probeLocation (lat, lon, t0, t1) {
      const result = {
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        time: {},
        properties: {}
      }

      // search for layers with a dataSource definition
      const probeTasks = []
      for (const name of _.keys(this.layers)) {
        if (!this.isLayerVisible(name)) continue

        const layer = this.layers[name]
        if (!layer.dataSources) continue

        const matchs = getSourcesByTimeRange(layer.dataSources, t0, t1)
        // we'll have to probe each matching source
        for (const match of matchs) {
          probeTasks.push(ProbeFunctionStore[match.source.type](this, layer, match.source, lat, lon, match.begin, match.end))
        }
      }

      const results = await Promise.allSettled(probeTasks)

      // merge results
      for (const res of results) {
        if (!res.value) continue

        const variable = res.value.variable
        if (!result.time[variable]) {
          result.time[variable] = res.value.time
          result.properties[variable] = res.value.properties
        } else {
          result.time[variable] = res.value.time.concat(result.time[variable])
          result.properties[variable] = res.value.properties.concat(result.properties[variable])
        }
      }

      // sort times ?
      for (const v of _.keys(result.time))
        result.time[v].sort((a, b) => { return a.valueOf() < b.valueOf() ? -1 : 1 })

      return result
    }
  }
}
