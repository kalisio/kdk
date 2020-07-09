import { ClientFunction } from 'testcafe'
import NavigationBar from './navigation-bar'
import Timeline from './timeline'
import MapActivity from './map-activity'
import Catalog from './catalog'
import LayerImportDialog from './layer-import-dialog'

export { NavigationBar }
export { Timeline }
export { MapActivity }
export { Catalog }
export { LayerImportDialog }

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

export const getLayers = ClientFunction(() => {
  const globalCatalogService = window.$api.getService('catalog', '')
  const catalogService = window.$api.getService('catalog')

  const p = []

  // We get layers coming from global catalog first if any
  if (globalCatalogService) p.push(globalCatalogService.find())
  // Then we get layers coming from contextual catalog if any
  if (catalogService && (catalogService !== globalCatalogService)) p.push(catalogService.find())

  return Promise.all(p).then((responses) => responses.flatMap(r => r.data))
})
