<template>
  <k-layers-selector :layers="layers" :options="options">
    <template v-slot:panel-header>
      <div class="row full-width justify-center">
        <q-select class="col-11" v-model="selected" :options="forecastModels" filled @input="onModelSelected">
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
  </k-layers-selector>
</template>

<script>
export default {
  name: 'k-weather-forecast-selector',
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
  data () {
    return {
      selected: {}
    }
  },
  watch: {
    forecastModel: function (model) {
      this.selected = model
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
    this.selected = this.forecastModel
  }
}
</script>

