import _ from 'lodash'
import { kml } from '@tmcw/togeojson'
import { exportKml } from 'cesium'

export async function convertEntitiesToGeoJson(entities) {
  const features = []
  if (entities.values.length === 0) return { type: 'FeatureCollection', features }
  // As cesium does not we usually keep track of original feature associated with an entity
  _.forEach(entities.values, entity => {
    if (entity.feature) features.push(entity.feature)
  })
  if (features.length > 0) return { type: 'FeatureCollection', features }
  // Otherwise try to export as KML then convert to GeoJson
  const kmlEntities = await exportKml({ entities, modelCallback: () => '' })
  const parser = new DOMParser()
  return kml(parser.parseFromString(kmlEntities.kml, 'application/xml'))
}
