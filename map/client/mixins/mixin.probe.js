import moment from 'moment'
import { getNearestRunTime, getNearestForecastTime } from '@weacast/core/common.js'
import * as gu from '../../common/geotiff-utils.js'
import * as mu from '../../common/moment-utils.js'
import * as wu from '../../common/weacast-utils.js'
import * as dsu from '../../common/data-source-utils.js'

export const probe = {
  data () {
    return {
      probeMethodFactory: {}
    }
  },
  methods: {
    registerProbeMethod (type, method) {
      this.probeMethodFactory[type] = method
    },

    async probeLocation (lat, lon, t0, t1) {
      const result = {
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        time: {},
        properties: {}
      }

      const meteoModelName = this.forecastModel ? this.forecastModel.name : null

      // search for layers with a dataSource definition
      const probeTasks = []
      for (const name of _.keys(this.layers)) {
        if (!this.isLayerVisible(name)) continue

        const layer = this.layers[name]
        if (!layer.dataSources) continue

        const matchs = dsu.getSourcesByTimeRange(layer.dataSources, t0, t1, meteoModelName)
        // we'll have to probe each matching source
        for (const match of matchs) {
          probeTasks.push(this.probeMethodFactory[match.source.type](this, layer, match.source, lat, lon, match.begin, match.end))
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
  },

  created () {
    this.registerProbeMethod('geotiff', async (activity, layer, source, lat, lon, t0, t1) => {
      const context = {
        jwtToken: await activity.$api.get('storage').getItem(activity.$config('gatewayJwt')),
        // TODO: remove
        testToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOiI2MjIyM2E4NGYyMzMwOTAwMzJhMTk3YjIiLCJpYXQiOjE2NjY4NjUyMDUsImV4cCI6MTY2Njk1MTYwNSwiYXVkIjoidGVzdC5rYWxpc2lvLnh5eiIsImlzcyI6ImthbGlzaW8iLCJzdWIiOiIzZDk4MWMxYi1iMGFmLTQxMzktYTJjYS1lMzA0YTRmMDE4YTYiLCJqdGkiOiIzZjYzNDYzNS1lZDVlLTRiNjEtOTdmOC0yOGJlYmNjYzI1NzEifQ.ZxfOoqac-aL3izfzm-UziAMgOBlfZ_prnn80kx66Jj4'
      }
      context.level = activity.selectedLevel !== null ? activity.selectedLevel : undefined

      const meteoModel = source.meteoModel ? activity.forecastModel : null
      const every = source.every ? moment.duration(source.every) : meteoModel ? moment.duration(meteoModel.interval, 's') : null
      const urlGenerator = _.template(source.config.urlTemplate)
      const probes = await gu.probeTimeRange(
        urlGenerator, context, 'time', [ (ctx) => { return dsu.defaultContext(ctx, layer, source, meteoModel) } ],
        { lat, lon},
        { t0: mu.floorTo(t0, every), t1: mu.ceilTo(t1, every) },
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
    })

    this.registerProbeMethod('weacast', async (activity, layer, source, lat, lon, t0, t1) => {
      const response = await wu.probeTimeRange(
        activity.weacastApi,
        source.meteoModel,
        [ layer.variables[0].name ],
        { lat, lon }, { t0, t1 })

      const result = {
        variable: layer.variables[0].name,
        time: [],
        properties: []
      }

      if (response) {
        result.time = response.forecastTime[element].map((time) => moment(time))
        result.properties = response.properties[element]
      }

      return result
    })
  }
}
