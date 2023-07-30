import _ from 'lodash'
import { ref } from 'vue'
import { Store, i18n } from '../../../core.client.js'
import { Geolocation } from '../geolocation.js'
import { searchLocation, listGeocoders } from '../utils/utils.location.js'

export function useLocation () {
  // Data
  const availableGeocoders = ref([])
  const selectedGeocoders = ref([])

  // Functions
  async function setGeocoders (geocoders) {
    if (_.isNull(geocoders)) {
      // clear the geocoders
      availableGeocoders.value = []
      selectedGeocoders.value = []
    } else if (_.isEmpty(geocoders)) {
      // check the capabilities to list the geocoders
      const geocoders = await listGeocoders()
      availableGeocoders.value = _.map(geocoders, geocoder => {
        return { value: geocoder, label: i18n.tie(geocoder) }
      })
      selectedGeocoders.value = geocoders
    } else {
      availableGeocoders.value = _.map(geocoders, geocoder => {
        return { value: geocoder.source, label: i18n.tie(geocoder.source) }
      })
      selectedGeocoders.value = _.map(_.filter(geocoders, geocoder => {
        return geocoder.selected
      }), geocoder => {
        return geocoder.source
      })
    }
  }
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
    setGeocoders,
    geolocate,
    search
  }
}
