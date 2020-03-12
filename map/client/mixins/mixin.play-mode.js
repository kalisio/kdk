import moment from 'moment'
import { readAsTimeOrDuration, makeTime } from '../../common/moment-utils'

const PLAY_MODES = {
  LIVE: 0,
  REPLAY: 1
}

export default {
  data () {
    return {
      playMode: undefined,
      timelineLayers: new Set(),
      associatedLayer: null,
      playRangeUpdater: null,
      liveUpdater: null
    }
  },
  methods: {
    togglePlayMode () {
      switch (this.playMode) {
        case PLAY_MODES.LIVE:
          this.setReplayMode()
          break
        case PLAY_MODES.REPLAY:
          this.setLiveMode()
          break
        default:
      }
    },
    setLiveMode () {
      this.setPlayMode(PLAY_MODES.LIVE)
    },
    setReplayMode () {
      this.setPlayMode(PLAY_MODES.REPLAY)
    },
    setPlayMode (mode) {
      this.playMode = mode

      if (mode !== PLAY_MODES.LIVE && this.liveUpdater) {
        clearInterval(this.liveUpdater)
        this.liveUpdater = null
      }

      /*
      if (mode === PLAY_MODES.LIVE) {
        this.timelineLayers.forEach(name => {
          const layer = this.getLayerByName(name)
          if (layer.tags) {
            if (layer.tags.indexOf('live') !== -1) layer.isDisabled = false
            if (layer.tags.indexOf('replay') !== -1) layer.isDisabled = true
          }
        })
      } else if (mode === PLAY_MODES.REPLAY) {
        this.timelineLayers.forEach(name => {
          const layer = this.getLayerByName(name)
          if (layer.tags) {
            if (layer.tags.indexOf('live') !== -1) layer.isDisabled = true
            if (layer.tags.indexOf('replay') !== -1) layer.isDisabled = false
          }
        })
      }
      */
    },
    scanMeteoModelLayer (layer) {
      const source = layer.meteo_model
      const playRange = {
        dependsOnForecastModel: true,
        ranges: {}
      }
      for (const item of source) {
        const model = this.forecastModels.find(model => model.name === item.model)
        if (!model) continue

        const range = {
          from: readAsTimeOrDuration(item.from),
          to: readAsTimeOrDuration(item.to),
          step: moment.duration(model.interval, 's')
        }
        if (playRange.ranges[item.model] === undefined) {
          playRange.ranges[item.model] = []
        }
        const ranges = playRange.ranges[item.model]
        ranges.push(range)
      }
      return playRange
    },
    scanTimeBasedLayer (layer) {
      const source = layer.time_based
      const playRange = {
        ranges: []
      }
      for (const item of source) {
        const range = {
          from: readAsTimeOrDuration(item.from),
          to: readAsTimeOrDuration(item.to),
          step: moment.duration(item.every)
        }
        playRange.ranges.push(range)
      }
      return playRange
    },
    scanWeacastLayer (layer) {
      const playRange = {
        dependsOnForecastModel: true,
        ranges: {}
      }

      for (const model of this.forecastModels) {
        playRange.ranges[model.name] = [{
          from: moment.duration(model.lowerLimit - model.interval, 's'),
          to: moment.duration(model.upperLimit + model.interval, 's'),
          step: moment.duration(model.interval, 's')
        }]
      }
      return playRange
    },
    makeTimelineConfig (playRange, reference) {
      let absoluteFrom = null
      let absoluteTo = null
      let smallestStep = null
      for (const range of playRange) {
        const from = makeTime(range.from, reference)
        const to = makeTime(range.to, reference)

        absoluteFrom = absoluteFrom ? moment.min(from, absoluteFrom) : from
        absoluteTo = absoluteTo ? moment.max(to, absoluteTo) : to
        smallestStep = smallestStep ? (smallestStep.asSeconds() > range.step.asSeconds() ? range.step : smallestStep) : range.step
      }

      const config = {}
      config.span = moment.duration(absoluteTo.diff(absoluteFrom))
      config.reference = absoluteFrom.clone().add(config.span / 2)
      config.step = smallestStep
      config.offset = moment.duration('PT0M')
      return config
    },
    setupPlayRange () {
      let playRange = null
      const layer = this.getLayerByName(this.associatedLayer)
      if (layer) {
        if (layer.playRange.dependsOnForecastModel) {
          playRange = layer.playRange.ranges[this.forecastModel.name]
        } else {
          playRange = layer.playRange.ranges
        }

        if (playRange) {
          const config = this.makeTimelineConfig(playRange, moment())
          // timeline mixin
          this.setupTimeline(config.span, config.reference, config.step, config.offset)
        }
      }

      return playRange
    },
    setupPlayRangeUpdater (playRange) {
      let needUpdater = false
      let updaterInterval = null
      for (const range of playRange) {
        needUpdater = needUpdater || moment.isDuration(range.from) || moment.isDuration(range.to)
        updaterInterval = updaterInterval ? (updaterInterval.asSeconds() > range.step.asSeconds() ? range.step : updaterInterval) : range.step
      }
      if (needUpdater) {
        this.playRangeUpdater = setInterval(this.setupPlayRange, updaterInterval.valueOf())
      }
    },
    setupPlayRangeAndRestartUpdater () {
      if (this.playRangeUpdater) {
        clearInterval(this.playRangeUpdater)
        this.playRangeUpdater = null
      }

      const playRange = this.setupPlayRange()
      if (playRange) {
        this.setupPlayRangeUpdater(playRange)
        this.enableTimeline()
      } else {
        this.disableTimeline()
      }
    },
    onPlayModeLayerAdded (layer) {
      if (layer.tags.indexOf('live') !== -1 || layer.tags.indexOf('replay') !== -1) {
        this.timelineLayers.add(layer.name)

        let playRange = null
        if (layer.meteo_model) {
          playRange = this.scanMeteoModelLayer(layer)
        } else if (layer.time_based) {
          playRange = this.scanTimeBasedLayer(layer)
        } else if (layer.leaflet && layer.leaflet.type.indexOf('weacast') !== -1) {
          playRange = this.scanWeacastLayer(layer)
        }

        if (playRange) layer.playRange = playRange
      }
    },
    onPlayModeLayerShown (layer, engineLayer) {
      if (!this.timelineLayers.has(layer.name)) return
      this.associatedLayer = layer.name
      this.setupPlayRangeAndRestartUpdater()
    },
    onPlayModeLayerHidden (layer, engineLayer) {
      if (layer.name === this.associatedLayer) {
        if (this.playRangeUpdater) {
          clearInterval(this.playRangepdater)
          this.playRangeUpdater = null
        }

        this.associatedLayer = null
        this.disableTimeline()
      }
    },
    onPlayModeForecastModelChanged (model) {
      if (this.associatedLayer) {
        this.setupPlayRangeAndRestartUpdater()
      }
    }
  },
  mounted () {
    this.$on('layer-added', this.onPlayModeLayerAdded)
    this.$on('layer-shown', this.onPlayModeLayerShown)
    this.$on('layer-hidden', this.onPlayModeLayerHidden)
    this.$on('forecast-model-changed', this.onPlayModeForecastModelChanged)
  },
  beforeDestroy () {
    if (this.playRangeUpdater) clearInterval(this.playRangeUpdater)
    this.$off('layer-added', this.onPlayModeLayerAdded)
    this.$off('layer-shown', this.onPlayModeLayerShown)
    this.$off('layer-hidden', this.onPlayModeLayerHidden)
    this.$off('forecast-model-changed', this.onPlayModeForecastModelChanged)
  }
}
