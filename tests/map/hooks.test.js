import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { hooks } from '../../map/api'

describe('map:hooks', () => {
  before(() => {
    chailint(chai, util)
  })

  it('marshalls geometry queries', () => {
    const hook = {
      type: 'before',
      params: {
        query: {
          geometry: { $near: { $geometry: { type: 'Point', coordinates: ['56', '0.3'] }, $maxDistance: '1000.50' } }
        }
      }
    }
    hooks.marshallGeometryQuery(hook)
    expect(typeof hook.params.query.geometry.$near.$geometry.coordinates[0]).to.equal('number')
    expect(typeof hook.params.query.geometry.$near.$geometry.coordinates[1]).to.equal('number')
    expect(hook.params.query.geometry.$near.$geometry.coordinates[0]).to.equal(56)
    expect(hook.params.query.geometry.$near.$geometry.coordinates[1]).to.equal(0.3)
    expect(typeof hook.params.query.geometry.$near.$maxDistance).to.equal('number')
    expect(hook.params.query.geometry.$near.$maxDistance).to.equal(1000.5)
  })

  it('convert results as GeoJson', () => {
    const hook = {
      type: 'after',
      params: {
        query: {
          geoJson: true
        }
      },
      result: [{
        location: { lat: -4, lon: 33 }
      }, {
        location: { lat: 47, lon: -96 }
      }]
    }
    hooks.marshallSpatialQuery(hook)
    hooks.asGeoJson({ longitudeProperty: 'location.lon', latitudeProperty: 'location.lat' })(hook)
    expect(hook.result.type).toExist()
    expect(hook.result.type).to.equal('FeatureCollection')
    expect(hook.result.features).toExist()
    expect(hook.result.features.length).to.equal(2)
    expect(hook.result.features[0].type).to.equal('Feature')
    expect(hook.result.features[0].geometry).toExist()
    expect(hook.result.features[0].geometry.type).to.equal('Point')
    expect(hook.result.features[0].geometry.coordinates).toExist()
    expect(hook.result.features[0].geometry.coordinates).to.deep.equal([33, -4])
    expect(hook.result.features[1].geometry.coordinates).to.deep.equal([-96, 47])
  })

  // Cleanup
  after(() => {
  })
})
