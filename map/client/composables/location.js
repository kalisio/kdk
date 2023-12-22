import _ from 'lodash'
import logger from 'loglevel'
import { ref } from 'vue'
import { Store, i18n } from '../../../core.client.js'
import { Geolocation } from '../geolocation.js'
import { searchLocation, listGeocoders } from '../utils/utils.location.js'

export function useLocation () {
  // Data
  const availableGeocoders = ref([])
  const selectedGeocoders = ref([])

  // Functions
  // Input geocoders if given should be like { source: xxx, selected: true }
  async function setGeocoders (geocoders) {
    if (_.isNull(geocoders)) {
      // clear the geocoders
      availableGeocoders.value = []
      selectedGeocoders.value = []
    } else {
      // check the capabilities to list the geocoders
      const allGeocoders = await listGeocoders()
      if (_.isEmpty(geocoders)) {
        availableGeocoders.value = _.map(allGeocoders, geocoder => {
          return { value: geocoder, label: i18n.tie(`Geocoders.${geocoder}`) }
        })
        selectedGeocoders.value = allGeocoders
      } else {
        availableGeocoders.value = geocoders
          .filter(geocoder => allGeocoders.includes(geocoder.source))
          .map(geocoder => ({ value: geocoder.source, label: i18n.tie(`Geocoders.${geocoder.source}`) }))
        selectedGeocoders.value = _.map(_.filter(geocoders, geocoder => geocoder.selected), 'source')
      }
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
