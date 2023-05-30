<template>
  <div class="row items-center">
    <div class="col-12 col-md-5">
      <q-option-group
        :options="options"
        type="radio"
        v-model="mode"
        @update:model-value="onModeChanged"
      />
      <!-- Search location -->
      <q-select v-show="mode === 'search'"
        for="search-location"
        class="col-grow"
        borderless
        :dense="dense"
        clearable
        use-input
        v-model="location"
        hide-dropdown-icon
        :options="serachOptions"
        option-label="name"
        option-value="name"
        @filter="onSearch"
        @update:model-value="onUpdated">
        <template v-slot:prepend>
          <q-icon :dense="dense" name="search" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              {{ $t('KLocationField.NO_RESULTS') }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <!-- Location map -->
    <div class="col-12 col-md-7">
      <div v-show="showMap" id="show-location-map" style="width: 100%; height: 250px">
        <KLocationMap
          v-model="location"
          :editable="mode === 'map'"
          :drawable="mode === 'draw'"
          :closable="true"
          :toolbar="true"
          @update:model-value="onUpdated"
          @close="onClose"
        />
      </div>
      <div v-show="showError" id="show-location-error" v-html="locationErrorMessage">
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { formatGeocodingResult, formatUserCoordinates } from '../utils'
import { Geolocation } from '../geolocation'
import KLocationMap from './KLocationMap.vue'

export default {
  components: {
    KLocationMap
  },
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Object,
      default: () => null
    },
    user: {
      type: Boolean,
      default: true
    },
    draw: {
      type: Boolean,
      default: false
    },
    map: {
      type: Object,
      default: () => {
        return {
          editable: true
        }
      }
    },
    search: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    locationErrorMessage () {
      return (this.locationError ? this.$t(`errors.${this.locationError.code}`) : '')
    },
    hasLocation () {
      return _.has(this.location, 'coordinates') || (_.has(this.location, 'latitude') && _.has(this.location, 'longitude'))
    },
    showError () {
      return this.locationError && (this.mode === 'user')
    },
    showMap () {
      return !this.showError && (this.hasLocation || (this.mode === 'draw'))
    },
    locationName () {
      return this.location ? this.location.name : ''
    }
  },
  data () {
    const options = []
    if (this.search) options.push({ label: this.$t('KLocationInput.SEARCH_LOCATION'), value: 'search' })
    if (this.user) options.push({ label: this.$t('KLocationInput.GEOLOCATE'), value: 'user' })
    if (this.map) options.push({ label: this.$t('KLocationInput.LOCATION_MAP'), value: 'map' })
    if (this.draw) options.push({ label: this.$t('KLocationInput.DRAW_MAP'), value: 'draw' })

    return {
      mode: null,
      options,
      location: null,
      locationError: null,
      serachOptions: []
    }
  },
  methods: {
    async emitValue () {
      // We'd like to watch external changes but not internal ones, so that we use the API to avoid reentrance
      this.unwatch()
      this.$emit('update:modelValue', this.location)
      await this.$nextTick()
      this.unwatch = this.$watch('value', this.refresh)
    },
    async geolocate () {
      await Geolocation.update()
      this.locationError = this.$store.get('geolocation.error')
      const position = this.$store.get('geolocation.position') || { longitude: 0, latitude: 0 }
      this.location = {
        name: formatUserCoordinates(position.latitude, position.longitude, this.$store.get('locationFormat', 'FFf')),
        latitude: position.latitude,
        longitude: position.longitude
      }
      this.emitValue()
    },
    clear () {
      this.location = null
      this.mode = null
    },
    refresh () {
      if (this.modelValue) {
        this.location = this.modelValue
        // GeoJson geometry or simple location ?
        if (_.has(this.location, 'type') && (_.get(this.location, 'type') !== 'Point')) {
          this.mode = 'draw'
        } else if (_.has(this.location, 'latitude') && _.has(this.location, 'longitude')) {
          const coordinates = formatUserCoordinates(this.location.latitude, this.location.longitude, this.$store.get('locationFormat', 'FFf'))
          // Set name as coordinates if not given
          if (!this.location.name) {
            // If name is not given we are in map mode
            this.location.name = coordinates
            this.mode = 'map'
          } else {
            // If name is not given as coordinates we are in address mode
            if (this.location.name !== coordinates) this.mode = 'search'
            else this.mode = 'map'
          }
        }
      } else {
        this.clear()
      }
    },
    onModeChanged (mode) {
      // Reset current location
      this.location = null
      if ((mode === 'user') || (mode === 'map')) this.geolocate()
    },
    async onSearch (pattern, update, abort) {
      if (pattern.length < 3) {
        abort()
        return
      }
      // Build the list of responses
      const geocoderService = this.$api.getService('geocoder')
      if (!geocoderService) throw new Error('Cannot find geocoder service')
      const response = await geocoderService.create({ address: pattern })
      const places = []
      response.forEach(element => {
        const label = formatGeocodingResult(element)
        const place = {
          name: label,
          latitude: element.latitude,
          longitude: element.longitude
        }
        places.push(place)
      })
      update(() => { this.serachOptions = places })
    },
    onUpdated (value) {
      this.emitValue()
    },
    onClose (value) {
      this.clear()
      this.emitValue()
    }
  },
  created () {
    // Populate the component
    this.refresh()
    // We'd like to watch external changes but not internal ones, so that we use the API instead of watch
    this.unwatch = this.$watch('value', this.refresh)
  }
}
</script>
