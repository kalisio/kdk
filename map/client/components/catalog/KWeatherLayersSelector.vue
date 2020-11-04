<template>
  <div v-if="forecastModels.length > 0">
    <k-layers-selector :layers="filteredLayers" :options="options">
      <template v-slot:header>
        <div class="q-ma-sm">
          <q-select id="forecast-model" v-model="model" :options="forecastModels" filled @input="onModelChanged">
            <template v-slot:prepend>
              <q-icon name="las la-globe" />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" :id="scope.opt.name">
                <q-item-section avatar>
                  <q-icon v-if="!scope.opt.iconUrl" :name="scope.opt.icon || 'las la-globe'" />
                </q-item-section>
                <q-item-section>
                  <q-item-label lines="1">
                    {{ scope.opt.label }}
                  </q-item-label>
                  <q-item-label caption lines="2">
                    {{ scope.opt.description }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </template>
      <template v-if="hasArchiveLayers" v-slot:footer>
        <q-tabs class="q-ma-sm text-primary" no-caps v-model="mode" @input="onModeChanged">
          <q-tab id="forecast" name="forecast" :label="$t('KWeatherLayersSelector.FORECASTS_LABEL')" />
          <q-tab id="archive" name="archive" :label="$t('KWeatherLayersSelector.ARCHIVES_LABEL')" />
        </q-tabs>
      </template>
    </k-layers-selector>
  </div>
  <div v-else>
    <k-label :text="$t('KWeatherLayersSelector.NO_MODEL_AVAILABLE')" alignement="center-top" icon-size="36px" direction="vertical" />
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-weather-layers-selector',
  props: {
    layers: {
      type: Array,
      default: () => []
    },
    forecastModels: {
      type: Array,
      default: () => []
    },
    forecastModelHandlers: {
      type: Object,
      default: () => {}
    },
    forecastModel: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    hasArchiveLayers () {
      return _.find(this.layers, (layer) => { return layer.tags.includes('archive') })
    },
    filteredLayers () {
      if (this.mode === 'forecast') return this.filterForecastLayers()
      return this.filterArchiveLayers()
    }
  },
  data () {
    return {
      model: {},
      mode: 'forecast'
    }
  },
  watch: {
    forecastModel: function (model) {
      this.model = model
    }
  },
  methods: {
    hideLayer (layer) {
      if (layer.isVisible) {
        const action = _.find(layer.actions, { name: 'toggle' })
        if (action) action.handler()
      }
    },
    filterForecastLayers () {
      const forecastLayers = []
      _.forEach(this.layers, (layer) => {
        if (!layer.tags.includes('archive')) forecastLayers.push(layer)
        else this.hideLayer(layer)
      })
      return forecastLayers
    },
    filterArchiveLayers () {
      const archiveLayers = []
      _.forEach(this.layers, (layer) => {
        if (layer.tags.includes('archive')) {
          if (_.has(layer, 'meteo_model')) {
            // check layer supports the current model
            // either with default model, or with a specific source
            if (_.get(layer.meteo_model, 'default.model') === this.model.name || _.find(layer.meteo_model.sources, { model: this.model.name })) archiveLayers.push(layer)
            else this.hideLayer(layer)
          } else {
            this.hideLayer(layer)
          }
        } else this.hideLayer(layer)
      })
      return archiveLayers
    },
    callHandler (action, layer) {
      if (this.forecastModelHandlers[action]) this.forecastModelHandlers[action](layer)
    },
    onModelChanged (model) {
      this.callHandler('toggle', model)
    },
    onModeChanged (mode) {
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-layers-selector'] = this.$load('catalog/KLayersSelector')
    this.$options.components['k-label'] = this.$load('frame/KLabel')
    // Set the current forecast model
    this.model = this.forecastModel
  }
}
</script>
