import { kml } from '@tmcw/togeojson'
import { exportKml } from 'cesium'

export async function convertEntitiesToGeoJson(entities) {
  const kmlEntities = await exportKml({ entities, modelCallback: () => '' })
  const parser = new DOMParser()
  return kml(parser.parseFromString(kmlEntities.kml, 'application/xml'))
}
