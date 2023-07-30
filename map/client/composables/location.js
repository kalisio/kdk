import _ from 'lodash'
import { ref } from 'vue'
import { Store } from '../../../core.client.js'
import { Geolocation } from '../geolocation.js'
import { searchLocation } from '../utils/utils.location.js'

export function useLocation () {
  // Data
  const availableGeocoders = ref([])
  const selectedGeocoders = ref([])

  // Functions
  async function geolocate () {
    await Geolocation.update()
    const error = Store.get('geolocation.error')
    if (error) return
    return Store.get('geolocation.location')
  }
  async function search (pattern) {
    return searchLocation(pattern, { geocoders: selectedGeocoders.value })
  }
  // Expose
  return {
    availableGeocoders,
    selectedGeocoders,
    geolocate,
    search
  }
}
