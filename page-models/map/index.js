import { ClientFunction } from 'testcafe'
import NavigationBar from './navigation-bar'
import Timeline from './timeline'
import MapActivity from './map-activity'
import Catalog from './catalog'

export { NavigationBar }
export { Timeline }
export { MapActivity }
export { Catalog }

// Mock Geolocation API that does not work well in headless browsers
// See https://github.com/DevExpress/testcafe/issues/1991
export const mockLocationAPI = ClientFunction(() => {
  navigator.geolocation.getCurrentPosition = (f) => f({
    coords: {
      latitude: 43.2996151,
      longitude: 1.9287062
    },
    timestamp: Date.now()
  })
})
