<template>
  <div class="row items-center">
    <div class="col-12 col-md-5">
      <q-option-group
        :options="options"
        type="radio"
        v-model="mode"
        @input="onModeChanged"
      />
      <!-- Search location -->
      <q-select v-show="mode === 'search'"
        id="search-location"
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
    <!-- Location map -->
    <div class="col-12 col-md-7">
      <div v-show="hasLocation || (mode === 'draw')" id="show-location-map" style="width: 100%; height: 250px">
        <k-location-map v-model="location" :editable="mode === 'map'" :drawable="mode === 'draw'" :toolbar="true" @input="onUpdated" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { QOptionGroup } from 'quasar'
import { formatGeocodingResult, formatUserCoordinates } from '../utils'
import { Geolocation } from '../geolocation'

export default {
  name: 'k-location-input',
  components: {
    QOptionGroup,
  },
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
    hasLocation () {
      return _.has(this.location, 'latitude') && _.has(this.location, 'longitude')
    },
    locationName () {
      return this.location ? this.location.name : ''
    }
  },
  data () {
    let options = []
    if (this.search) options.push({ label: this.$i18n.t('KLocationInput.SEARCH_LOCATION'), value: 'search' })
    if (this.user) options.push({ label: this.$i18n.t('KLocationInput.GEOLOCATE'), value: 'user' })
    if (this.map) options.push({ label: this.$i18n.t('KLocationInput.LOCATION_MAP'), value: 'map' })
    if (this.draw) options.push({ label: this.$i18n.t('KLocationInput.DRAW_MAP'), value: 'draw' })
    
    return {
      mode: null,
      options,
      location: null,
      serachOptions: []
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
      this.$emit('input', this.location)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-location-map'] = this.$load('KLocationMap')
    // Populate the component
    if (this.value) {
      this.location = this.value
      // Simple location ?
      if (_.has(this.location, 'latitude') && _.has(this.location, 'longitude')) {
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
      } else if (_.has(this.location, 'coordinates')) { // GeoJson geometry
        this.mode = 'draw'
      }
    }
  }
}
</script>
