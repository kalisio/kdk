import { kml } from '@tmcw/togeojson'
import Cesium from 'cesium/Source/Cesium.js'

export async function convertEntitiesToGeoJson(entities) {
  const kmlEntities = await Cesium.exportKml({ entities, modelCallback: () => '' })
  const parser = new DOMParser()
  return kml(parser.parseFromString(kmlEntities.kml, 'application/xml'))
}
