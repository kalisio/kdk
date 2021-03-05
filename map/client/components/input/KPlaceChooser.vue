<template>
  <q-select
    id="place-chooser"
    class="q-pl-sm q-pr-sm"
    autofocus
    fill-input
    hide-selected
    borderless
    dense
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
      <q-icon dense name="search" />
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
import { formatGeocodingResult } from '../../utils'

export default {
  name: 'k-place-chooser',
  props: {

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
      this.$emit('place-chosen', this.location)
    }
  }
}
</script>
