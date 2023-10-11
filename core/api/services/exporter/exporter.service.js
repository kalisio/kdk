import _ from 'lodash'
import fs from 'fs-extra'
import zlib from 'zlib'
import Papa from 'papaparse'
import makeDebug from 'debug'

const debug = makeDebug('kdk:exporter:service')

class ExporterService {
  constructor (options, app) {
    this.app = app
  }

  async create(data, params) {
    // Retrieve export options
    const { serviceName } = data
    const serviceContext = _.get(data, 'serviceContext')
    const dataQuery = _.get(data, 'dataQuery', {})
    const batchSize = _.get(data, 'batchSize', 500)
    const outputFormat = _.get(data, 'outputFormat', 'json')
    const zipOutput = _.get(data, 'zipOutput', false)
    // Retrieve the service
    const service = this.app.getService(serviceName, serviceContext)
    // Set needed variables to process the request
    let offset = 0
    let responseSize = batchSize
    // Define ouputfile
    let outputFile = `${serviceName}.${outputFormat}`
    if (zipOutput) outputFile += '.gz'
    let outputSteam = fs.createWriteStream(outputFile)
    while (responseSize === batchSize) {
      const response = await service._find({ query: dataQuery, paginate: { max: batchSize, skip: offset } })
      let buffer
      if (outputFormat === 'csv') {
        buffer = Papa.unparse(response)
      } else {
        buffer = JSON.stringify(response)
      }
      if (zipOutput) {
        zlib.gzip(buffer, (error, zippedBuffer) => { 
          if (!error) outputSteam.write(zippedBuffer)
          else console.error(error)
        })
      } else {
        outputSteam.write(buffer)
      }
      responseSize = response.length
      offset+=responseSize
    }
  }
}

export default function (name, app, options) {
  return new ExporterService(options, app)
}