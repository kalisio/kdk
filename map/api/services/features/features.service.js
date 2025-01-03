import _ from 'lodash'
import makeDebug from 'debug'
import { marshallComparisonFields } from '../../../../core/api/index.js'

const debug = makeDebug('kdk:map:features:service')

export default {

  // Count number of elements per time periods (hours, days, etc.)
  async heatmap (data, params) {
    let { query, field, count, timezone } = data
    // We could agregate using a single or multiple operators, e.g. hour or hour/dayOfWeek
    if (!Array.isArray(count)) count = [count]
    // Default time field
    if (!field) field = 'time'
    marshallComparisonFields(query)
    const collection = this.Model
    // Filter, e.g.
    // time: {
    //  $gte: xxx,
    //  $lte: xxx
    // }
    const matchStage = {
      $match: query
    }
    // Grouping, e.g.
    // _id: {
    //  hour: { $hour: 'time '},
    //  dayOfWeek: { $dayOfWeek: 'time '}
    // }
    const groupStage = {
      $group: {
        _id: {},
        count: {
          $sum: 1
        }
      }
    }
    count.forEach(countItem => {
      if (timezone) _.set(groupStage, `$group._id[${countItem}]`, { [`$${countItem}`]: { date: `$${field}`, timezone } })
      else _.set(groupStage, `$group._id[${countItem}]`, { [`$${countItem}`]: `$${field}` })
    })
    const pipeline = [matchStage, groupStage]
    debug('Executing heatmap pipeline', pipeline)
    const results = await collection.aggregate(pipeline).toArray()
    debug(`Found ${results.length} results for heatmap`, data)
    // Result is like [{ _id: { hour: 16, dayOfWeek: 1 }, count: 2 }, { _id: { hour: 18, dayOfWeek: 1 }, count: 4 }]
    // but we make it easier to read like this [{ hour: 16, dayOfWeek: 1, count: 2 }, { hour: 18, dayOfWeek: 1, count: 4 }]
    return results.map(result => Object.assign(result._id, { count: result.count }))
  },

  async formatGeoJSON(data, params) {
    let { query, sort, type } = data
    marshallComparisonFields(query)
    const pipeline = []
    const collection = this.Model

    if (query) pipeline.push({ $match: query })
    if (sort) pipeline.push({ $sort: sort })
    switch (type) {
      // Simple line string from a collection of points
      case 'LineString':
        pipeline.push(
          // Match stage: Filter for documents that have a "Point" geometry type, which is required for a LineString.
          {
            $match: {
              "geometry.type": "Point"
            }
          },

          // Group stage: Group all documents into a single document, aggregating coordinates and properties.
          {
            $group: {
              _id: null,
              allCoordinates: {
                $push: "$geometry.coordinates"
              }
            }
          },

          // Project stage: Construct the GeoJSON LineString and add properties.
          {
            $project: {
              _id: 0,
              type: { $literal: "Feature" },
              geometry: {
                type: { $literal: "LineString" },
                coordinates: "$allCoordinates"
              },
              properties: {
                name: "Generated LineString"
              }
            }
          }
        );
        break;

      // a feature collection of points and a linestring connecting them
      case 'PointedLineString':
        pipeline.push({
          $match: {
            "geometry.type": "Point"
          }
        },
          {
            // Group stage: Collect all documents of type "Point" into an array and all coordinates for the LineString.
            $group: {
              _id: null,
              features: {
                $push: "$$ROOT"  // Push entire documents of "Point" features.
              },
              allCoordinates: {
                $push: "$geometry.coordinates"  // Collect coordinates for the LineString.
              }
            }
          },
          {
            // Project stage: Create a FeatureCollection including both points and a LineString.
            $project: {
              _id: 0,
              type: { "$literal": "FeatureCollection" },
              features: {
                $concatArrays: [
                  "$features",  // Include original Point features.
                  [
                    {
                      type: "Feature",
                      geometry: {
                        type: "LineString",
                        coordinates: "$allCoordinates"  // Use all coordinates to create a LineString.
                      },
                      properties: {
                        name: "Generated LineString"
                      }
                    }
                  ]
                ]
              }
            }
          });



        break
      default:
        throw new Error('Unknown type : ' + type)
    }
    console.log('Executing formatGeoJSON pipeline', JSON.stringify(pipeline))
    const results = await collection.aggregate(pipeline).toArray()
    return results
  }

}
