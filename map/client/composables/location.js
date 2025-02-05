import _ from 'lodash'
import { ref } from 'vue'
import { Store, i18n, api } from '../../../core.client.js'
import { Geolocation } from '../geolocation.js'
import { useCurrentActivity } from './activity.js'
import { searchLocation, listGeocoders, filterGeocoders } from '../utils/utils.location.js'

export function useLocation () {
  const { getActivityProject } = useCurrentActivity({ selection: false, probe: false })

  // Data
  const availableGeocoders = ref([])
  const selectedGeocoders = ref([])
  const selectedViewbox = ref([])

  // Functions
  // Input geocoders if given should be like { source: xxx, selected: true }
  async function setGeocoders (geocoders) {
    const project = getActivityProject()
    const planet = (project ? project.getPlanetApi().getConfig() : api.getConfig())
    if (_.isNull(geocoders)) {
      // clear the geocoders
      availableGeocoders.value = []
      selectedGeocoders.value = []
    } else {
      // check the capabilities to list the geocoders
      let allGeocoders = await listGeocoders(planet)
      allGeocoders = filterGeocoders(allGeocoders, project)
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
  // Input viewbox if given should be like [lon1,lat1,lon2,lat2]
  async function setViewbox (viewbox) {
    if (_.isNull(viewbox)) {
      selectedViewbox.value = []
    } else {
      selectedViewbox.value = viewbox
    }
  }
  async function geolocate () {
    await Geolocation.update()
    const error = Store.get('geolocation.error')
    if (error) return
    return Store.get('geolocation.location')
  }
  async function search (pattern, limit = 25) {
    const project = getActivityProject()
    const planet = (project ? project.getPlanetApi().getConfig() : api.getConfig())
    return searchLocation(planet, pattern, {
      geocoders: selectedGeocoders.value,
      viewbox: selectedViewbox.value,
      limit
    })
  }
  // Expose
  return {
    availableGeocoders,
    selectedGeocoders,
    setGeocoders,
    setViewbox,
    geolocate,
    search
  }
}
