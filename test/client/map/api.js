import * as core from '../core/index.js'

// Decorate core API with some of the required features for map
export class Api extends core.Api {
  createClient (options = {}) {
    const client = super.createClient(options)

    client.createGeoJsonFeature = async (layerId, coordinates, properties = {}, service = 'features') => {
      // Deduce geometry type from coordinates
      let type = 'Point'
      if (Array.isArray(coordinates[0])) {
        type = (Array.isArray(coordinates[0][0]) ? 'Polygon' : 'LineString')
      }
      const feature = await client.getService(service).create(Object.assign({
        type: 'Feature',
        geometry: {
          type,
          coordinates
        },
        layer: layerId
      }, properties))
      return feature
    }

    client.updateGeoJsonFeature = async (featureId, coordinates, properties = {}, service = 'features') => {
      const feature = await client.getService(service).patch(featureId, Object.assign({
        'geometry.coordinates': coordinates
      }, properties))
      return feature
    }

    return client
  }
}
