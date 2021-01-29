<template>
  <q-select
    id="location-search"
    class="q-pl-sm q-pr-sm"
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
</template>

<script>
import { formatGeocodingResult } from '../utils'

export default {
  name: 'k-location-search',
  inject: ['kActivity'],  
  props: {
    dense: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      location: null,
      options: []
    }
  },
  methods: {
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
    onUpdated () {
      if (this.location) this.kActivity.center(this.location.longitude, this.location.latitude)
    }
  }
}
</script>
