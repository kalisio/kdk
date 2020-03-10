<template>
  <div class="row items-center no-wrap">
    <!--
      User location
    -->
    <q-btn v-if="user" icon="my_location" color="primary" flat dense round @click="geolocate()">
      <q-tooltip>{{ $t('KLocationInput.GEOLOCATE') }}</q-tooltip>
    </q-btn>
    <!--
      Location map
    -->
    <q-btn v-if="map" icon="place" color="primary" flat dense round>
      <q-tooltip>{{ $t('KLocationInput.LOCATION_MAP') }}</q-tooltip>
      <q-popup-proxy transition-show="scale" transition-hide="scale">
        <k-location-map v-model="location" :editable="map.editable" @input="onUpdated" />
      </q-popup-proxy>
    </q-btn>
    <!--
      Search location
    -->
    <q-select
      v-show="search"
      class="col-grow"
      borderless
      :dense="dense"
      clearable
      use-input
      v-model="location"
      hide-dropdown-icon
      :options="options"
      option-label="name"
      option-value="name"
      @filter="onSearch"
      @input="onUpdated">
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
</template>

<script>
import formatcoords from 'formatcoords'
import { formatGeocodingResult } from '../utils'
import * as mixins from '../mixins'

export default {
  name: 'k-location-input',
  mixins: [
    mixins.geolocation
  ],
  props: {
    value: {
      type: Object,
      deafault: () => {
        return null
      }
    },
    user: {
      type: Boolean,
      default: true
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
    locationName () {
      return this.location ? this.location.name : ''
    },
    isUserLocationEnabled () {
      return this.userLocation
    },
    isLocationMapEnabled () {
      return this.locationMap
    }
  },
  data () {
    return {
      location: null,
      options: []
    }
  },
  methods: {
    geolocate () {
      this.updatePosition()
      const position = this.$store.get('user.position')
      if (position) {
        this.location = {
          name: formatcoords(position.latitude, position.longitude).format(this.$store.get('locationFormat', 'FFf')),
          latitude: position.latitude,
          longitude: position.longitude
        }
      } else {
        this.location = null
      }
      this.$emit('input', this.location)
    },
    async onSearch (pattern, update, abort) {
      if (pattern.length < 3) {
        abort()
        return
      }
      // Build the list of responses
      const geocoderService = this.$api.getService('geocoder')
      if (!geocoderService) throw Error('Cannot find geocoder service')
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
      update(() => { this.options = places })
    },
    onUpdated (value) {
      this.$emit('input', this.location)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-location-map'] = this.$load('KLocationMap')
    // Populate the component
    if (this.value) this.location = this.value
  }
}
</script>
