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
    let groupStage = {
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
    debug(`Executing heatmap pipeline`, pipeline)
    const results = await collection.aggregate(pipeline).toArray()
    debug(`Found ${results.length} results for heatmap`, data)
    // Result is like [{ _id: { hour: 16, dayOfWeek: 1 }, count: 2 }, { _id: { hour: 18, dayOfWeek: 1 }, count: 4 }]
    // but we make it easier to read like this [{ hour: 16, dayOfWeek: 1, count: 2 }, { hour: 18, dayOfWeek: 1, count: 4 }]
    return results.map(result => Object.assign(result._id, { count: result.count }))
  }

}
