<template>
  <div class="row items-center no-wrap">
    <!--
      User location
    -->
    <q-btn v-if="user" id="geolocate" icon="las la-street-view" color="primary" :flat="!geolocated" dense round @click="geolocate()">
      <q-tooltip>{{ $t('KLocationInput.GEOLOCATE') }}</q-tooltip>
    </q-btn>
    <!--
      Location map
    -->
    <q-btn v-if="map" id="show-location-map" icon="las la-map-marker" color="primary" flat dense round>
      <q-tooltip>{{ $t('KLocationInput.LOCATION_MAP') }}</q-tooltip>
      <q-popup-proxy transition-show="scale" transition-hide="scale">
        <q-card>
          <k-location-map v-model="location" width="350px" height="400px" :editable="map.editable" :toolbar="true" @input="onUpdated" />
        </q-card>
      </q-popup-proxy>
    </q-btn>
    <!--
      Search location
    -->
    <q-select
      id="search-location"
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
import { formatGeocodingResult, formatUserCoordinates } from '../utils'
import { Geolocation } from '../geolocation'

export default {
  name: 'k-location-input',
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
    geolocated: {
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
    locationName () {
      return this.location ? this.location.name : ''
    }
  },
  data () {
    return {
      location: null,
      options: []
    }
  },
  methods: {
    async geolocate () {
      await Geolocation.update()
      const position = this.$store.get('geolocation.position')
      if (position) {
        this.location = {
          name: formatUserCoordinates(position.latitude, position.longitude, this.$store.get('locationFormat', 'FFf')),
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
    if (this.value) {
      this.location = this.value
      // Set name as coordinates if not given
      if (!this.location.name && this.location.latitude && this.location.longitude) {
        this.location.name = formatUserCoordinates(this.location.latitude, this.location.longitude, this.$store.get('locationFormat', 'FFf'))
      }
    }
  }
}
</script>
