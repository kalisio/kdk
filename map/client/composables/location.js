import _ from 'lodash'
import logger from 'loglevel'
import { ref } from 'vue'
import { Store, Context, i18n } from '../../../core.client.js'
import { Geolocation } from '../geolocation.js'
import { Geocoder } from '../geocoder.js'
import { useCurrentActivity } from './activity.js'
import { filterGeocoders } from '../utils/utils.location.js'

export function useLocation () {
  const { getActivityProject } = useCurrentActivity({ selection: false, probe: false })

  // Data
  const availableGeocoders = ref([])
  const selectedGeocoders = ref([])
  const selectedViewbox = ref([])

  // Functions
  // Input geocoders if given should be like { source: xxx, selected: true }
  async function setGeocoders (geocoders) {
    if (_.isNull(geocoders)) {
      // clear the geocoders
      availableGeocoders.value = []
      selectedGeocoders.value = []
    } else {
      // check the capabilities to list the geocoders
      let allGeocoders = await Geocoder.getForwardCapabilities()
      allGeocoders = filterGeocoders(allGeocoders, getActivityProject())
      logger.debug('[KDK] Filtered geocoders:', allGeocoders)
      if (_.isEmpty(geocoders)) {
        availableGeocoders.value = _.map(allGeocoders, geocoder => {
          return { value: geocoder, label: i18n.tie(`Geocoders.${geocoder}`) }
        })
        selectedGeocoders.value = allGeocoders
      } else {
        availableGeocoders.value = _.reduce(geocoders, (reducedGeocoders, geocoder) => {
          const source = _.replace(geocoder.source, /^services:.*\//g, `services:${Context.getId()}/`)
          const label = _.replace(geocoder.source, /^services:.*\//g, `services:*/`)
          logger.debug('[KDK] Is geocoder available', source, label)
          if (allGeocoders.includes(source)) {
            reducedGeocoders.push({ value: source, label: i18n.tie(`Geocoders.${label}`), selected: geocoder.selected })
          }
          return reducedGeocoders
        }, [])
        selectedGeocoders.value = _.reduce(availableGeocoders.value, (reducedGeocoders, geocoder) => {
          console.log(geocoder)
          if (geocoder.selected) reducedGeocoders.push(geocoder.value)
          return reducedGeocoders
        }, [])
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
    return Geocoder.queryForward(pattern, {
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
