<template>
  <div
    v-if="readOnly"
    :id="properties.name + '-field'"
  >
    {{ name }}
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
              v-model="selectedGeocoders"
              :geocoders="availableGeocoders"
            />
            <div class="q-pl-sm q-pr-md" v-if="switchViewboxUsage">
              <q-separator inset class=" q-mt-md q-mb-md"/>
              <q-toggle
                  v-model="useViewbox"
                  size="xs"
                  :label="$t('KLocationField.VIEWBOX')"
                  @update:model-value="changeViewboxUsage"
              />
            </div>
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
            tools: map,
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
        {{ scope.opt.properties ? scope.opt.properties.name : scope.opt.name }}
    </template>
    <!-- Options -->
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps" class="option">
        <q-item-section>
          <q-item-label>{{ scope.opt.properties ? scope.opt.properties.name : scope.opt.name }}</q-item-label>
        </q-item-section>
        <q-item-section avatar v-if="scope.opt.properties.source">
          <q-chip dense size="0.7rem" color="primary" text-color="white">
            {{ $tie(`Geocoders.${scope.opt.properties.source}`) }}
          </q-chip>
        </q-item-section>
        <KLocationTip :location="scope.opt" />
      </q-item>
    </template>
    <!-- No options -->
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{ $t('KLocationField.NO_RESULT') }}
        </q-item-section>
      </q-item>
    </template>
    <!-- Helper -->
    <template v-if="hasHelper" v-slot:append>
      <k-action
        :id="properties.name + '-helper'"
        :label="helperLabel"
        :icon="helperIcon"
        :tooltip="helperTooltip"
        :url="helperUrl"
        :dialog="helperDialog"
        :context="helperContext"
        @dialog-confirmed="onHelperDialogConfirmed"
        color="primary"
      />
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
import KLocationTip from '../location/KLocationTip.vue'

export default {
  components: {
    KAction,
    KGeocodersFilter,
    KLocationTip
  },
  mixins: [kdkCoreMixins.baseField],
  computed: {
    name () {
      return _.get(this.model, 'properties.name', '')
    },
    allowConfiguration () {
      return !_.isNull(_.get(this.properties, 'field.geocoders'))
    },
    allowGeolocation () {
      return _.get(this.properties, 'field.geolocate', true)
    },
    allowMap () {
      return this.map !== null
    },
    map () {
      return _.get(this.properties, 'field.map')
    },
    switchViewboxUsage () {
      return _.get(this.properties, 'field.viewbox.selectable', false)
    }
  },
  methods: {
    emptyModel () {
      return null
    },
    async onSearch (pattern, update, abort) {
      if (pattern.length < 3) {
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
    },
    changeViewboxUsage () {
      this.setViewbox(this.useViewbox ? _.get(this.properties, 'field.viewbox.coordinates', []) : [])
    }
  },
  setup () {
    // Data
    const { availableGeocoders, selectedGeocoders, setGeocoders, setViewbox, search, geolocate } = useLocation()
    const locations = ref([])
    const useViewbox = ref(true)
    // Expose
    return {
      locations,
      useViewbox,
      availableGeocoders,
      selectedGeocoders,
      setGeocoders,
      setViewbox,
      geolocate,
      search
    }
  },
  mounted () {
    this.setGeocoders(_.get(this.properties, 'field.geocoders', []))
    this.setViewbox(_.get(this.properties, 'field.viewbox.coordinates', []))
  }
}
</script>
