<template>
  <div
    v-if="readOnly"
    :id="properties.name + '-field'"
  >
    {{ model ? model.properties.name : '' }}
  </div>
  <q-select
    v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    v-model="model"
    :label="label"
    clearable
    use-input
    hide-dropdown-icon
    :options="locations"
    :display-value="name"
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
    bottom-slots
    @filter="onSearch"
    @update:model-value="onChanged"
  >
    <!-- Extra actions -->
    <template v-slot:append>
      <div class="q-pl-xs row items-center">
        <!-- geocoders filtering -->
        <KAction
          v-if="allowConfiguration"
          id="configure"
          tooltip="KLocationField.FILTER"
          icon="las la-sliders-h"
          color="grey-7"
          size="0.8rem"
          dense
        >
          <q-popup-proxy>
            <KGeocodersFilter
              v-model="selectedGeocorders"
              :geocoders="availableGeocoders"
            />
          </q-popup-proxy>
        </KAction>
        <!-- geolocation -->
        <KAction
          v-if="allowGeolocation"
          id="geolocate"
          tooltip="KLocationField.GEOLOCATE"
          icon="las la-crosshairs"
          color="grey-7"
          size="0.8rem"
          dense
          :handler="onGeolocated"
        />
        <!-- map drawing -->
        <KAction
          v-if="allowMap"
          id="draw"
          tooltip="KLocationField.DRAW"
          icon="las la-edit"
          color="grey-7"
          size="0.8rem"
          dense
          :dialog="{
            component: 'location/KLocationMap',
            'v-model': model,
            draggable: true,
            header: map,
            widthPolicy: 'wide',
            cancelAction: 'CANCEL',
            okAction: {
              id: 'ok-button',
              label: 'APPLY',
              handler: 'getLocation'
            },
            style: 'min-height: 70vh;'
          }"
          @dialog-confirmed="onLocationChanged"
        />
      </div>
    </template>
    <!-- Selected item -->
    <template v-slot:selected-item="scope">
        {{ scope.opt ? scope.opt.properties.name : '' }}
    </template>
    <!-- Options -->
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps" class="option">
        <q-item-section>
          <q-item-label>{{ scope.opt.properties.name }}</q-item-label>
        </q-item-section>
        <q-tooltip
          class="q-pa-none"
          anchor="center end"
          self="center middle"
          style="border-radius: 25px;"
        >
          <KLocationMap
            :modelValue="scope.opt"
            style="min-width: 250px; min-height: 250px; border-radius: 50px;"
          />
        </q-tooltip>
      </q-item>
    </template>
    <!-- No options -->
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{ $t('KLocationField.NO_RESULTS') }}
        </q-item-section>
      </q-item>
    </template>
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper" />
    </template>
  </q-select>
</template>

<script>
import _ from 'lodash'
import { ref } from 'vue'
import { mixins as kdkCoreMixins } from '../../../../core/client'
import { useLocation } from '../../composables'
import { KAction } from '../../../../core/client/components'
import KGeocodersFilter from '../location/KGeocodersFilter.vue'
import KLocationMap from '../location/KLocationMap.vue'

export default {
  components: {
    KAction,
    KGeocodersFilter,
    KLocationMap
  },
  mixins: [kdkCoreMixins.baseField],
  computed: {
    name () {
      return _.get(this.model, 'properties.name', '')
    },
    allowConfiguration () {
      return !_.isEmpty(_.get(this.properties, 'field.geocoders'))
    },
    allowGeolocation () {
      return _.get(this.properties, 'field.geolocate', true)
    },
    allowMap () {
      return this.map !== null
    },
    map () {
      return _.get(this.properties, 'field.map')
    }
  },
  methods: {
    emptyModel () {
      return null
    },
    async onSearch (pattern, update, abort) {
      if (pattern.length < 4) {
        abort()
        return
      }
      const locations = await this.search(pattern)
      update(() => {
        this.locations = locations
      })
    },
    async onGeolocated () {
      const location = await this.geolocate()
      if (location) {
        this.fill(location)
        this.onChanged()
      }
    },
    onLocationChanged (context, location) {
      this.model = location
      return true
    }
  },
  setup () {
    // Data
    const { search, geolocate } = useLocation()
    const locations = ref([])
    const availableGeocoders = ref([])
    const selectedGeocorders = ref([])
    // Expose
    return {
      locations,
      availableGeocoders,
      selectedGeocorders,
      geolocate,
      search
    }
  },
  mounted () {
    this.availableGeocoders = _.filter(_.get(this.properties, 'field.geocoders'), geocoder => {
      return _.get(geocoder, 'selectable', true)
    })
    this.selectedGeocorders = _.map(this.availableGeocoders, geocoder => {
      return geocoder.value
    })
  }
}
</script>
