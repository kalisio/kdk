import _ from 'lodash'
import explode from '@turf/explode'
import kinks from '@turf/kinks'
import clean from '@turf/clean-coords'
import { getType } from '@turf/invariant'
import logger from 'loglevel'
import moment from 'moment'
import { Time } from '../../../core/client/time.js'
import { transformFeatures } from '../utils.js'

export const featureService = {
  methods: {
    async getBaseQueryForFeatures (options) {
      // Any base query to process ?
      const baseQuery = {}
      if (options.baseQuery) {
        if (typeof options.baseQuery === 'function') {
          const result = await options.baseQuery()
          // A null query indicate to skip update
          if (!result) return
          else Object.assign(baseQuery, result)
        } else {
          Object.assign(baseQuery, options.baseQuery)
        }
      }
      return baseQuery
    },
    async getSortQueryForFeatures (options) {
      // Any sort query to process ?
      const sortQuery = {}
      if (options.sortQuery) {
        if (typeof options.sortQuery === 'function') {
          const result = await options.sortQuery()
          Object.assign(sortQuery, result)
        } else {
          Object.assign(sortQuery, options.sortQuery)
        }
      }
      return { $sort: sortQuery }
    },
    getFeaturesUpdateInterval (options) {
      const interval = (_.has(options, 'every')
        ? _.get(options, 'every')
        // Backward compatibility with old configuration style
        : _.get(options, this.engine, options).interval)
      return (interval ? moment.duration(interval) : null)
    },
    getFeaturesQueryInterval (options) {
      const interval = this.getFeaturesUpdateInterval(options)
      let queryInterval = (_.has(options, 'queryFrom')
        ? _.get(options, 'queryFrom')
        // Backward compatibility with old configuration style
        : _.get(options, this.engine, options).queryInterval)
      // If query interval not given use 2 x refresh interval as default value
      // this ensures we cover last interval if server/client update processes are not in sync
      if (!queryInterval && interval) queryInterval = moment.duration(-2 * interval.asMilliseconds())
      return (queryInterval ? moment.duration(queryInterval) : null)
    },
    shouldSkipFeaturesUpdate (lastUpdateTime, options, interval) {
      // If not given try to compute query interval from options
      if (!interval) {
        interval = this.getFeaturesUpdateInterval(options)
      }
      // We assume this is not a time-varying layer
      if (!interval) return true
      const now = Time.getCurrentTime()
      const elapsed = moment.duration(now.diff(lastUpdateTime))
      // If query interval has elapsed since last update we need to update again
      return (Math.abs(elapsed.asMilliseconds()) < interval.asMilliseconds())
    },
    getFeaturesLevel (options) {
      return (this.selectableLevelsLayer && (this.selectableLevelsLayer.name === options.name) ? this.selectedLevel : null)
    },
    async getProbeFeatures (options) {
      // Any base/sort query to process ?
      const query = await this.getBaseQueryForFeatures(options)
      const sortQuery = await this.getSortQueryForFeatures(options)
      Object.assign(query, sortQuery)
      const response = await this.$api.getService(options.probeService).find({ query })
      const features = (response.type === 'FeatureCollection' ? response.features : [response])
      if (typeof options.processor === 'function') {
        features.forEach(feature => options.processor(feature))
      }
      if (options.transform) {
        transformFeatures(features, options.transform)
      }
      return response
    },
    async getProbeFeaturesFromLayer (name) {
      // Retrieve the layer
      const layer = this.getLayerByName(name)
      if (!layer) return
      return this.getProbeFeatures(layer)
    },
    async getFeatures (options, queryInterval, queryLevel) {
      // If not given try to compute query interval from options
      if (!queryInterval) {
        queryInterval = this.getFeaturesQueryInterval(options)
      }
      // If not given try to compute query level from options
      if (!queryLevel) {
        queryLevel = this.getFeaturesLevel(options)
      }
      // Any base query to process ?
      let query = await this.getBaseQueryForFeatures(options)
      // Request features with at least one data available during last query interval
      if (queryInterval) {
        // Check if we have variables to be aggregated in time or not
        if (options.variables) {
          query = Object.assign({
            $groupBy: options.featureId,
            // Take care we might have multiple variables targetting the same value name
            // but that differentiate using others properties (compound feature ID)
            $aggregate: _.uniq(options.variables.map(variable => variable.name))
          }, query)
        } else if (options.featureId) {
          query = Object.assign({
            $groupBy: options.featureId,
            $aggregate: ['geometry']
          }, query)
        }
        const now = Time.getCurrentTime()
        if (moment.isDuration(queryInterval)) {
          // Depending on the duration format we might have negative or positive values
          const gte = (queryInterval.asMilliseconds() > 0
            ? now.clone().subtract(queryInterval)
            : now.clone().add(queryInterval))
          const lte = now
          Object.assign(query, {
            $sort: { time: -1, runTime: -1 },
            time: {
              $gte: gte.format(),
              $lte: lte.format()
            }
          })
          // If we can aggregate then keep track of last element of each aggregation
          if (options.featureId) query.$limit = 1
        } else if (typeof queryInterval === 'object') {
          query.time = queryInterval
        } else {
          Object.assign(query, {
            $sort: { time: -1, runTime: -1 },
            time: { $lte: now.format() }
          })
          // If we can aggregate then keep track of last element of each aggregation
          if (options.featureId) query.$limit = 1
        }
      }
      if (!_.isNil(queryLevel)) {
        query.level = queryLevel
      }
      // Any sort query to process ?
      const sortQuery = await this.getSortQueryForFeatures(options)
      // Take care to not erase possible existing sort options
      _.merge(query, sortQuery)
      const response = await this.$api.getService(options.service).find({ query })
      const features = (response.type === 'FeatureCollection' ? response.features : [response])
      if (typeof options.processor === 'function') {
        features.forEach(feature => options.processor(feature))
      }
      if (options.transform) {
        transformFeatures(features, options.transform)
      }
      return response
    },
    async getFeaturesFromLayer (name, queryInterval) {
      // Retrieve the layer
      const layer = this.getLayerByName(name)
      if (!layer) return
      return this.getFeatures(layer, queryInterval)
    },
    async getMeasureForFeature (layer, feature, startTime, endTime) {
      let probedLocation
      this.setCursor('processing-cursor')
      try {
        // Support compound ID
        const featureId = (Array.isArray(layer.featureId) ? layer.featureId : [layer.featureId])
        const baseQuery = featureId.reduce((result, id) =>
          Object.assign(result, { ['properties.' + id]: _.get(feature, 'properties.' + id) }),
        {})
        const result = await this.getFeatures(_.merge({
          baseQuery
        }, layer), {
          $gte: startTime.format(),
          $lte: endTime.format()
        })
        if (result.features.length > 0) {
          probedLocation = result.features[0]
        } else {
          probedLocation = _.cloneDeep(feature)
        }
      } catch (error) {
        logger.error(error)
      }
      this.unsetCursor('processing-cursor')
      return probedLocation
    },
    checkFeatures (geoJson, options = {
      kinks: true,
      redundantCoordinates: true
    }) {
      const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
      // Removes redundant coordinates
      if (options.redundantCoordinates) {
        features.forEach(feature => clean(feature, { mutate: true }))
      }
      // Filter invalid features
      let kinksFeatures
      if (options.kinks) {
        kinksFeatures = _.remove(features, feature => {
          const type = getType(feature)
          if ((type === 'MultiPolygon') || (type === 'Polygon')) {
            const invalidFeatures = kinks(feature)
            return _.get(invalidFeatures, 'features', []).length > 0
          } else { // No possible self-intersection on points, self-intersections allowed on lines
            return false
          }
        })
      }
      return { kinks: kinksFeatures }
    },
    async createFeatures (geoJson, layerId, chunkSize = 5000, processCallback) {
      if (!layerId) return
      const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
      features.forEach(feature => {
        // Remove any temporary ID as we will use the one from MongoDB
        delete feature._id
        feature.layer = layerId
      })
      // Single edition mode
      if (features.length === 1) {
        const feature = await this.$api.getService('features').create(features[0])
        return feature
      } else {
        // Create chunks to avoid reaching some limits (upload size, timeout, etc.)
        // We create chunks according to the number of points and not features.
        // Indeed otherwise it would create very different chunks depending on the geometry type
        // (eg a bucket of 1000 polygons can actually contains a lot of points).
        // const chunks = _.chunk(features, chunkSize)
        const chunks = []
        let chunkPoints = 0
        let chunk = []
        features.forEach(feature => {
          const explodedFeature = explode(feature)
          const nbPoints = explodedFeature.features.length
          // Check if current chunk is not full
          if ((chunkPoints + nbPoints) <= chunkSize) {
            chunkPoints += nbPoints
            chunk.push(feature)
          } else {
            // Otherwise push current chunk if not empty
            if (chunk.length > 0) {
              chunks.push(chunk)
            }
            // Then start new chunk
            chunk = [feature]
            chunkPoints = nbPoints
          }
        })
        // Push last chunk
        if (chunk.length > 0) {
          chunks.push(chunk)
        }
        // Write the chunks
        for (let i = 0; i < chunks.length; i++) {
          await this.$api.getService('features').create(chunks[i])
          if (typeof processCallback === 'function') await processCallback(i, chunks[i])
        }
      }
    },
    async editFeaturesGeometry (geoJson) {
      const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
      const updatedFeatures = []
      for (let i = 0; i < features.length; i++) {
        const feature = features[i]
        if (feature._id) {
          const updatedFeature = await this.$api.getService('features').patch(feature._id, _.pick(feature, ['geometry']))
          updatedFeatures.push(updatedFeature)
        }
      }
      return (geoJson.type === 'FeatureCollection' ? Object.assign(geoJson, { features: updatedFeatures }) : updatedFeatures)
    },
    async editFeaturesProperties (geoJson) {
      const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
      const updatedFeatures = []
      for (let i = 0; i < features.length; i++) {
        const feature = features[i]
        if (feature._id) {
          const updatedFeature = await this.$api.getService('features').patch(feature._id, _.pick(feature, ['properties']))
          updatedFeatures.push(updatedFeature)
        }
      }
      return (geoJson.type === 'FeatureCollection' ? Object.assign(geoJson, { features: updatedFeatures }) : updatedFeatures)
    },
    async removeFeatures (geoJsonOrLayerId) {
      // Remove all features of a given layer
      if (typeof geoJsonOrLayerId === 'string') {
        await this.$api.getService('features').remove(null, { query: { layer: geoJsonOrLayerId } })
      } else {
        const features = (geoJsonOrLayerId.type === 'FeatureCollection' ? geoJsonOrLayerId.features : [geoJsonOrLayerId])
        for (let i = 0; i < features.length; i++) {
          const feature = features[i]
          if (feature._id) await this.$api.getService('features').remove(feature._id)
        }
      }
    }
  },
  created () {
    // Extend timeout for large write operations
    this.$api.getService('features').timeout = 60 * 60 * 1000 // 1h should be sufficient since we also have size limits
  }
}
