<template>
  <k-layers-selector :layers="filteredLayers" :options="options">
    <template v-slot:panel-header>
      <div class="q-ma-sm">
        <q-select v-model="model" :options="forecastModels" filled @input="onModelSelected">
          <template v-slot:prepend>
            <q-icon name="las la-globe" />
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
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
    <template v-if="hasArchiveLayers" v-slot:panel-footer>
      <q-tabs class="q-ma-sm text-primary" no-caps v-model="mode">
        <q-tab name="forecast" :label="$t('KWeatherLayersSelector.FORECASTS_LABEL')" />
        <q-tab name="archive" :label="$t('KWeatherLayersSelector.ARCHIVES_LABEL')" />
      </q-tabs>
    </template>
  </k-layers-selector>
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
      return _.find(this.layers, (layer) => { return layer.tags.includes('archive') }) !== undefined
    },
    filteredLayers () {
      if (this.mode === 'forecast') return _.filter(this.layers, (layer) => { return !layer.tags.includes('archive') })
      return _.filter(this.layers, (layer) => { 
        if (layer.tags.includes('archive')) {
          // check whether the current model is supported by the layer
          for (let i = 0; i < layer.meteo_model.length; ++i) {
            if (layer.meteo_model[i].model === this.model.name) return true
          }
        }
        return false
      })
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
    callHandler (action, layer) {
      if (this.forecastModelHandlers[action]) this.forecastModelHandlers[action](layer)
    },
    onModelSelected (model) {
      this.callHandler('toggle', model)
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-layers-selector'] = this.$load('catalog/KLayersSelector')
    // Set the current forecast model
    this.model = this.forecastModel
    console.log(this.model)
  }
}
</script>

