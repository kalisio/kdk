<template>
  <div v-if="forecastModels.length > 0">
    <k-layers-selector :layers="filteredLayers" :options="options">
      <template v-slot:header>
        <div class="q-ma-sm">
          <q-select for="forecast-model" id="forecast-model" v-model="model" :options="models" filled map-options emit-value @update:model-value="onModelChanged">
            <template v-slot:prepend>
              <q-icon name="las la-globe" />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" :id="scope.opt.name">
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
    </k-layers-selector>
  </div>
  <div v-else class="row justify-center q-pa-sm">
    <KStamp icon="las la-exclamation-circle" icon-size="sm" :text="$t('KWeatherLayersSelector.NO_MODEL_AVAILABLE')" text-size="0.9rem" direction="horizontal" />
  </div>
</template>

<script>
import _ from 'lodash'
import { KStamp } from '../../../../core/client/components'
import KLayersSelector from './KLayersSelector.vue'

export default {
  name: 'k-weather-layers-selector',
  components: {
    KStamp,
    KLayersSelector
  },
  props: {
    layers: {
      type: Array,
      default: () => []
    },
    forecastModels: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    models () {
      return this.forecastModels.map(forecastModel => Object.assign({
        value: forecastModel.name
      }, _.pick(forecastModel, ['label', 'description', 'icon', 'iconUrl'])))
    },
    filteredLayers () {
      if (this.mode === 'forecast') return this.filterForecastLayers()
      return this.filterArchiveLayers()
    }
  },
  data () {
    return {
      model: '',
      mode: 'forecast'
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
            if (_.get(layer.meteo_model, 'default.model') === this.model ||
                _.find(layer.meteo_model.sources, { model: this.model })) archiveLayers.push(layer)
            else this.hideLayer(layer)
          } else {
            this.hideLayer(layer)
          }
        } else this.hideLayer(layer)
      })
      return archiveLayers
    },
    onModelChanged (model) {
      const forecastModel = this.forecastModels.find(forecast => forecast.name === model)
      if (forecastModel) {
        const toggleAction = _.find(forecastModel.actions, { id: 'toggle' })
        if (toggleAction) toggleAction.handler()
      }
    }
  },
  created () {
    // Select default if any or first one
    let forecastModel = this.forecastModels.find(forecast => forecast.isDefault)
    if (!forecastModel) {
      forecastModel = (this.forecastModels.length > 0 ? this.forecastModels[0] : '')
    }
    if (forecastModel) {
      this.model = forecastModel.name
      this.onModelChanged(forecastModel.name)
    }
  }
}
</script>
