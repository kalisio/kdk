<template>
  <k-layers-panel :layers="layers" :categories="layerCategories" >
    <q-expansion-item slot="panel-footer" v-if="forecastModels.length > 0" icon="fas fa-globe" :label="$t('KCatalogPanel.FORECASTS_LABEL')">
      <k-forecast-models-selector :forecastModels="forecastModels" :forecastModelHandlers="forecastModelHandlers" :forecastModel="forecastModel" />
    </q-expansion-item>
  </k-layers-panel>
</template>

<script>
export default {
  name: 'k-catalog-panel',
  props: {
    layers: {
      type: Object,
      default: () => {}
    },
    layerCategories: {
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
    }
  },
  created () {
    this.$options.components['k-layers-panel'] = this.$load('KLayersPanel')
    this.$options.components['k-forecast-models-selector'] = this.$load('KForecastModelsSelector')
  }
}
</script>
